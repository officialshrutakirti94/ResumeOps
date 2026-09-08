# Agent Integration Guide

## For Future: Resume Editor Agents

This document shows how editing agents will interact with the resume parser system.

## Data Flow

```
User uploads resume.tex
    ↓
POST /resume/upload
    ↓
ParsedResume:
  - raw_tex: "\\documentclass{...}\\name{John}..." (ORIGINAL, UNTOUCHED)
  - normalized_content: "John\nSoftware Engineer\n..."
  - resume: Resume(name="John", role="...", ...)
    
    └─ Includes source_mappings:
       [
         {"section": "name", "content": "John", "start_pos": 123, "end_pos": 127},
         {"section": "role", "content": "Engineer", "start_pos": 200, "end_pos": 208},
         ...
       ]
    ↓
Resume Editor Agent uses ParsedResume to:
  1. Display extracted Resume to user
  2. User makes changes in UI
  3. Find what changed (e.g., "Engineer" → "Senior Engineer")
  4. Locate in original LaTeX using source_mappings
  5. Modify only that section
  6. Return updated raw_tex
```

## Agent Code Examples

### Example 1: Update a Skill

```python
async def update_skill(parsed_resume: ParsedResume, old_skill: str, new_skill: str):
    """Agent modifies a specific skill in the resume"""
    
    # 1. Find source mapping for this skill
    source_maps = parsed_resume.source_mappings
    skill_map = next(
        (m for m in source_maps 
         if m["section"] == "skills" and m["content"] == old_skill),
        None
    )
    
    if not skill_map:
        raise ValueError(f"Skill '{old_skill}' not found in resume")
    
    # 2. Extract positions
    start_pos = skill_map["start_pos"]
    end_pos = skill_map["end_pos"]
    
    # 3. Modify original LaTeX at specific position
    raw_tex = parsed_resume.raw_tex
    original_snippet = raw_tex[start_pos:end_pos]
    
    # Example: \skill{Python} -> \skill{Rust}
    updated_snippet = original_snippet.replace(old_skill, new_skill)
    
    # 4. Rebuild the resume
    updated_tex = (
        raw_tex[:start_pos] + 
        updated_snippet + 
        raw_tex[end_pos:]
    )
    
    # 5. Return modified resume
    return updated_tex
```

### Example 2: Add Experience Bullet Point

```python
async def add_experience_bullet(
    parsed_resume: ParsedResume, 
    company: str, 
    new_bullet: str
):
    """Agent adds a bullet point to specific experience"""
    
    # 1. Find the experience section for this company
    exp_map = next(
        (m for m in parsed_resume.source_mappings 
         if m["section"] == "experience" and m["subsection"] == company),
        None
    )
    
    if not exp_map:
        raise ValueError(f"Experience at '{company}' not found")
    
    # 2. Get position
    start_pos = exp_map["start_pos"]
    end_pos = exp_map["end_pos"]
    
    # 3. Find the environment end (where bullets list ends)
    # Original might be:
    # \resumeSubheading{Google}{2020-2023}
    #   \resumeItem{First bullet}
    #   \resumeItem{Second bullet}
    # }
    
    raw_tex = parsed_resume.raw_tex
    experience_section = raw_tex[start_pos:end_pos]
    
    # 4. Inject new bullet (template-aware injection)
    # Detect pattern: \resumeItem{...} or \item ... or \bullet ...
    
    if "\\resumeItem{" in experience_section:
        # Custom command style
        new_bullet_tex = f"\\resumeItem{{{new_bullet}}}\n"
        # Insert before closing }
        insert_point = experience_section.rfind("}")
        updated_section = (
            experience_section[:insert_point] +
            new_bullet_tex +
            experience_section[insert_point:]
        )
    elif "\\item " in experience_section:
        # Standard itemize style
        new_bullet_tex = f"\\item {new_bullet}\n"
        # Insert before \end{itemize}
        insert_point = experience_section.rfind("\\end{")
        updated_section = (
            experience_section[:insert_point] +
            new_bullet_tex +
            experience_section[insert_point:]
        )
    
    # 5. Rebuild resume
    updated_tex = (
        raw_tex[:start_pos] +
        updated_section +
        raw_tex[end_pos:]
    )
    
    return updated_tex
```

### Example 3: Update Name

```python
async def update_candidate_name(parsed_resume: ParsedResume, new_name: str):
    """Agent updates candidate name"""
    
    # 1. Find name source mapping
    name_map = next(
        (m for m in parsed_resume.source_mappings 
         if m["section"] == "name"),
        None
    )
    
    if not name_map:
        # Name might not be in mappings if not detected
        # But we still have parsed_resume.resume.name
        raise ValueError("Name not found in source mappings")
    
    # 2-5. Same pattern as above
    raw_tex = parsed_resume.raw_tex
    start_pos = name_map["start_pos"]
    end_pos = name_map["end_pos"]
    
    old_name_section = raw_tex[start_pos:end_pos]
    updated_section = old_name_section.replace(
        parsed_resume.resume.name, 
        new_name
    )
    
    updated_tex = (
        raw_tex[:start_pos] +
        updated_section +
        raw_tex[end_pos:]
    )
    
    return updated_tex
```

### Example 4: Safe Pattern-Based Modification

```python
async def inject_into_environment(
    raw_tex: str,
    env_name: str,
    new_content: str,
    position: str = "end"  # "start" or "end"
):
    """
    Agent safely injects content into a LaTeX environment.
    
    Pattern: \begin{env} ... \end{env}
    
    Works for ANY environment (itemize, tabular, custom, etc.)
    No template assumptions needed.
    """
    import re
    
    # Find the environment
    pattern = rf"\\begin\{{{env_name}\}}(.*?)\\end\{{{env_name}\}}"
    match = re.search(pattern, raw_tex, re.DOTALL)
    
    if not match:
        raise ValueError(f"Environment '{env_name}' not found")
    
    # Get environment bounds
    env_start = match.start()
    env_end = match.end()
    env_content = match.group(1)
    
    # Inject at desired position
    if position == "end":
        # Insert before \end{...}
        insert_point = env_end - len(f"\\end{{{env_name}}}")
        new_env_content = env_content + "\n" + new_content
    else:  # position == "start"
        # Insert after \begin{...}
        insert_point = env_start + len(f"\\begin{{{env_name}}}")
        new_env_content = "\n" + new_content + env_content
    
    # Rebuild
    updated_tex = (
        raw_tex[:env_start] +
        f"\\begin{{{env_name}}}" +
        new_env_content +
        f"\\end{{{env_name}}}" +
        raw_tex[env_end:]
    )
    
    return updated_tex
```

## Key Principles for Agents

1. **Always preserve `raw_tex`**
   - Never modify the original except at specific positions
   - Use source_mappings to find exact positions

2. **Use source_mappings when available**
   - Prevents regex-based brittle matching
   - Guarantees exact positions from parser

3. **Fall back to safe regex when needed**
   - For injecting new content (not in original)
   - Use `\begin{env}...\end{env}` patterns
   - Still template-agnostic (environments work anywhere)

4. **Always return a valid LaTeX string**
   - Test that `updated_tex` is valid before returning
   - Can use `TexParserService.parse(updated_tex)` to validate

5. **Never hardcode LaTeX commands**
   - Accept that different templates use different commands
   - Detect patterns from source_mappings
   - Use generic environment/position-based injection

## Testing Agent Code

```python
# In agent test file:

async def test_agent_updates_skill():
    # 1. Get a parsed resume
    parser = TexParserService()
    parsed = parser.parse(SAMPLE_LATEX)
    
    # 2. Extract as Resume
    extractor = ResumeExtractionService()
    resume = await extractor.extract_resume(parsed["cleaned_text"], parsed["raw_tex"])
    
    parsed_resume = ParsedResume(
        raw_tex=parsed["raw_tex"],
        normalized_content=parsed["cleaned_text"],
        resume=resume
    )
    
    # 3. Run agent
    updated_tex = await update_skill(
        parsed_resume,
        old_skill="Python",
        new_skill="Go"
    )
    
    # 4. Verify
    assert "Go" in updated_tex
    assert parsed_resume.raw_tex != updated_tex  # Should be different
    
    # 5. Re-parse to ensure validity
    reparsed = parser.parse(updated_tex)
    assert reparsed["cleaned_text"] is not None  # Should parse successfully
```

## Summary

Agents will:
1. Receive `ParsedResume` from the upload endpoint
2. Use `source_mappings` to locate content in `raw_tex`
3. Modify ONLY the specific sections needed
4. Return updated `raw_tex` (all formatting preserved)
5. New agents can parse it again if needed

**No additional parsing logic needed in agents.**  
**No template assumptions needed in agents.**  
**All LaTeX formatting is automatically preserved.**
