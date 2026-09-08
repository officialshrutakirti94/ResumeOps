# Resume Parser - Hybrid Architecture

## Overview

This is a **hybrid parser-LLM approach** for template-agnostic LaTeX resume parsing:
- **Deterministic parsing** for structural extraction
- **Minimal LLM** for semantic understanding only
- **Source mappings** preserved for agent-based editing

## Architecture Flow

```
.tex file (raw LaTeX)
     ↓
[TexParserService]
  - Generic LaTeX tokenization
  - No assumptions about template/commands
  - Preserves positions for source mapping
     ↓
cleaned_text: "Name\nRole\nExperience details\n..."
source_mappings: [{ section, subsection, content, start_pos, end_pos }]
document_structure: Parsed LaTeX tree
     ↓
[LaTeXCleaningService]
  - Removes \command{} patterns
  - Normalizes whitespace
  - Strips remaining LaTeX artifacts
  - Minimal token usage
     ↓
final_cleaned_text: "Name\nRole\nExperience details\n..."
     ↓
[ResumeExtractionService] (LLM)
  - Lightweight semantic extraction only
  - Identifies: name, role, skills, experience, projects, education, certifications
  - Does NOT parse LaTeX (parser already did)
  - Does NOT strip commands (cleaner already did)
     ↓
Resume (Pydantic model)
  - name: str
  - role: str
  - skills: list[str]
  - experience: list[Experience]
  - projects: list[Project]
  - education: list[Education]
  - certifications: list[str]
```

## Key Design Decisions

### 1. **Why Hybrid?**
- **Parser handles**: LaTeX structure (no assumptions about templates)
- **Cleaner handles**: Formatting removal (deterministic)
- **LLM handles**: Semantic understanding only (what content means, not how it's formatted)

**Result**: Lightweight LLM calls, universal template support, reduced costs

### 2. **Source Mappings for Agent Editing**

The `ParsedResume` model includes:
- `raw_tex`: Original LaTeX (untouched)
- `normalized_content`: Cleaned, readable text
- `source_mappings`: Maps each extracted piece to original LaTeX positions

**Why?** Agents will use source mappings to:
1. Find where "Skills" section is in original LaTeX
2. Locate specific skill in original LaTeX
3. Modify ONLY that skill's content
4. Preserve all LaTeX formatting

Example mapping:
```python
SourceMapping(
    section="skills",
    subsection="Python",
    content="Python",
    start_pos=1523,
    end_pos=1529,
    raw_tex_snippet="\\skill{Python}"
)
```

Then agents can:
```python
# Find and modify a skill in original LaTeX
tex_content = raw_tex
start, end = source_map.start_pos, source_map.end_pos
old_tex = tex_content[start:end]
new_tex = old_tex.replace("Python", "Python (Expert)")
modified_tex = tex_content[:start] + new_tex + tex_content[end:]
```

### 3. **Service Responsibilities**

#### TexParserService
- ✅ Tokenize LaTeX generically
- ✅ Build document tree (no semantic assumptions)
- ✅ Track positions for source mapping
- ✅ Preserve original LaTeX exactly
- ❌ Does NOT assume specific commands/sections
- ❌ Does NOT clean formatting

#### LaTeXCleaningService
- ✅ Remove \command{} patterns
- ✅ Normalize whitespace
- ✅ Strip LaTeX artifacts
- ✅ Reduce token usage
- ❌ Does NOT parse structure (parser did that)
- ❌ Does NOT perform semantic extraction

#### ResumeExtractionService
- ✅ Lightweight semantic extraction
- ✅ Identify resume sections and content
- ✅ Return structured Pydantic model
- ❌ Does NOT parse LaTeX (parser did that)
- ❌ Does NOT strip formatting (cleaner did that)
- ❌ Does NOT assume specific templates

### 4. **Token Usage Optimization**

Compared to naive LLM-only approach:

| Approach | Input Tokens | LLM Calls | Cost |
|----------|--------------|-----------|------|
| Raw LaTeX to LLM | 2000-5000 | 1 | High |
| Hybrid (our approach) | 400-800 | 1 | Low |
| Parser + Cleaner reduce tokens by **60-80%** |

## Future: Agent-Based Editing

When editing agents are added:

1. **Resume Editor Agent** receives:
   - Original LaTeX
   - ParsedResume with extracted data
   - Source mappings

2. **Agent can modify**:
   ```python
   # Change a skill
   source_map = find_source_mapping("skills", "Python")
   updated_tex = modify_tex_at_position(
       raw_tex, 
       source_map.start_pos, 
       source_map.end_pos, 
       new_skill_name
   )
   
   # Add a new bullet point to experience
   exp_map = find_source_mapping("experience", "Google")
   updated_tex = inject_bullet_into_environment(
       raw_tex,
       exp_map.start_pos,
       exp_map.end_pos,
       "New achievement"
   )
   ```

3. **Original formatting preserved**:
   - All LaTeX structure stays intact
   - Custom commands preserved
   - Environment nesting preserved
   - Only modified content changes

## Testing

Three test suites verify:
- `test_tex_parser.py`: Parser robustness with different templates
- `test_integration.py`: Full pipeline with mock LLM
- Both test that NO hardcoded assumptions exist

Test templates cover:
1. Custom commands (AltaCV/Deedy style)
2. Plain LaTeX (no custom commands)
3. Custom environments (completely different structure)

## Configuration

Environment variables:
- `GEMINI_API_KEY`: For LLM extraction

No hardcoded template patterns, section names, or command names.

## Future Extensibility

### Add a new field to Resume?
1. Update `Resume` Pydantic model
2. Update LLM prompt in `ResumeExtractionService`
3. No parser changes needed

### Support a new resume template?
- Parser already handles it generically
- No changes needed

### Add resume editing agents?
- Use `source_mappings` from parsing step
- Modify LaTeX at specific positions
- No template-specific logic needed
