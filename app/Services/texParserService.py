"""
Generic LaTeX Resume Parser

This service parses LaTeX resumes without assuming:
- Specific command names (\resumeItem, \resumeSubheading, etc.)
- Specific section names (Experience, Projects, Education, etc.)
- Specific template structure or ordering
- Custom LaTeX commands or environments

It produces:
1. A cleaned, readable text representation (for LLM processing)
2. Source mappings (for agent-based editing)
3. Preserves the original LaTeX untouched

Architecture for agent editing:
- Agents will use source_maps to locate sections in original LaTeX
- Agents modify only the identified content blocks
- Original formatting is preserved
"""

import re
from enum import Enum
from dataclasses import dataclass, field
from typing import Optional


class TokenType(Enum):
    """LaTeX token types"""
    COMMAND = "command"  # \command or \command{...}
    ENVIRONMENT_BEGIN = "env_begin"  # \begin{...}
    ENVIRONMENT_END = "env_end"  # \end{...}
    TEXT = "text"
    NEWLINE = "newline"
    COMMENT = "comment"
    BRACE_OPEN = "{"
    BRACE_CLOSE = "}"
    BRACKET_OPEN = "["
    BRACKET_CLOSE = "]"


@dataclass
class Token:
    """Represents a single LaTeX token"""
    type: TokenType
    value: str
    raw: str  # Original text including escape chars
    position: int = 0  # Character position in original document


@dataclass
class LaTeXNode:
    """Represents a structured node in the LaTeX document"""
    node_type: str  # "command", "environment", "text", "section"
    name: str = ""  # command name, environment name, or section name
    content: list = field(default_factory=list)  # list of child nodes or raw text
    raw_source: str = ""  # Original LaTeX source
    start_pos: int = 0  # Start position in original LaTeX
    end_pos: int = 0  # End position in original LaTeX
    properties: dict = field(default_factory=dict)  # Additional properties


@dataclass
class SourceMapping:
    """
    Maps a piece of content (name, role, skill, etc.) to its source in LaTeX.
    Used by agents to locate and modify specific resume sections.
    """
    section: str  # "name", "experience", "projects", "education", "skills", etc.
    subsection: str = ""  # "company", "role", "date", etc. (optional)
    content: str = ""  # The extracted text
    start_pos: int = 0  # Start position in original LaTeX
    end_pos: int = 0  # End position in original LaTeX
    raw_tex_snippet: str = ""  # The original LaTeX snippet


class TexParserService:
    """
    Generic LaTeX parser for resumes.
    
    Does NOT assume specific commands or sections.
    Produces cleaned content + source mappings for agent editing.
    """

    def __init__(self):
        self.raw_tex = ""
        self.tokens = []
        self.document_tree = []
        self.source_mappings = []

    def parse(self, tex_content: str) -> dict:
        """
        Parse LaTeX content and return cleaned representation with source maps.
        
        Args:
            tex_content: Raw LaTeX resume content
            
        Returns:
            dict with keys:
            - raw_tex: Original LaTeX (preserved)
            - cleaned_text: Human-readable cleaned text (for LLM)
            - source_mappings: Maps content to source LaTeX positions
            - document_structure: Structured document representation
        """
        self.raw_tex = tex_content
        self.source_mappings = []
        
        # Step 1: Remove comments
        cleaned_tex = self._remove_comments(tex_content)
        
        # Step 2: Tokenize
        self.tokens = self._tokenize(cleaned_tex)
        
        # Step 3: Build document tree
        self.document_tree = self._build_tree(self.tokens)
        
        # Step 4: Generate cleaned content (for LLM processing)
        cleaned_text = self._generate_cleaned_content(self.document_tree)

        self.source_mappings = self._build_source_mappings(self.document_tree)
        
        return {
            "raw_tex": self.raw_tex,
            "cleaned_text": cleaned_text,  # For LLM (lightweight)
            "source_mappings": [
                {
                    "section": m.section,
                    "subsection": m.subsection,
                    "content": m.content,
                    "start_pos": m.start_pos,
                    "end_pos": m.end_pos,
                    "raw_snippet": m.raw_tex_snippet,
                }
                for m in self.source_mappings
            ],
            "document_structure": self._tree_to_dict(self.document_tree)
        }

    def _remove_comments(self, tex_content: str) -> str:
        """
        Remove LaTeX comments (% to end of line) safely.
        Does not remove % inside commands or braces.
        """
        lines = tex_content.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Simple approach: if % appears, check if it's escaped
            # Look for \% (escaped percent) vs % (comment)
            result = ""
            i = 0
            while i < len(line):
                if i < len(line) - 1 and line[i:i+2] == '\\%':
                    # Escaped percent sign
                    result += '\%'
                    i += 2
                elif line[i] == '%':
                    # Comment starts here
                    result += ' ' * (len(line) - i)
                    break
                else:
                    result += line[i]
                    i += 1
            
            cleaned_lines.append(result)
        
        return '\n'.join(cleaned_lines)

    def _build_source_mappings(self, nodes: list) -> list:
        """Build editable source mappings for every parsed node."""
        mappings = []

        def visit(node: LaTeXNode, parent_section: str = "") -> None:
            section = node.name or parent_section or node.node_type
            mappings.append(SourceMapping(
                section=section,
                subsection=parent_section if parent_section and parent_section != section else "",
                content=self._node_content_text(node),
                start_pos=node.start_pos,
                end_pos=node.end_pos,
                raw_tex_snippet=self.raw_tex[node.start_pos:node.end_pos],
            ))
            for child in node.content:
                if isinstance(child, LaTeXNode):
                    visit(child, section)

        for node in nodes:
            visit(node)
        return mappings

    def _node_content_text(self, node: LaTeXNode) -> str:
        """Return readable text represented by a parsed node."""
        if node.node_type in ["text", "command"]:
            return " ".join(str(value) for value in node.content).strip()
        return self._generate_cleaned_content(node.content)

    def _tokenize(self, tex_content: str) -> list:
        """
        Tokenize LaTeX content into a stream of tokens.
        Tracks position in original content for source mapping.
        Generic approach that doesn't assume specific commands.
        """
        tokens = []
        i = 0
        length = len(tex_content)
        
        while i < length:
            # Skip whitespace except newlines
            if tex_content[i] in ' \t\r':
                i += 1
                continue
            
            # Newline
            if tex_content[i] == '\n':
                tokens.append(Token(TokenType.NEWLINE, '\n', '\n', position=i))
                i += 1
                continue
            
            # Braces
            if tex_content[i] == '{':
                tokens.append(Token(TokenType.BRACE_OPEN, '{', '{', position=i))
                i += 1
                continue
            
            if tex_content[i] == '}':
                tokens.append(Token(TokenType.BRACE_CLOSE, '}', '}', position=i))
                i += 1
                continue
            
            # Brackets
            if tex_content[i] == '[':
                tokens.append(Token(TokenType.BRACKET_OPEN, '[', '[', position=i))
                i += 1
                continue
            
            if tex_content[i] == ']':
                tokens.append(Token(TokenType.BRACKET_CLOSE, ']', ']', position=i))
                i += 1
                continue
            
            # LaTeX command or environment
            if tex_content[i] == '\\':
                raw_start = i
                i += 1
                
                # Read command name (letters, digits, asterisk)
                cmd_start = i
                while i < length and (tex_content[i].isalpha() or tex_content[i] in '*_'):
                    i += 1
                
                cmd_name = tex_content[cmd_start:i]
                raw_cmd = tex_content[raw_start:i]
                
                if cmd_name == 'begin':
                    tokens.append(Token(TokenType.COMMAND, '\\begin', raw_cmd, position=raw_start))
                elif cmd_name == 'end':
                    tokens.append(Token(TokenType.COMMAND, '\\end', raw_cmd, position=raw_start))
                else:
                    tokens.append(Token(TokenType.COMMAND, '\\' + cmd_name, raw_cmd, position=raw_start))
                
                continue
            
            # Regular text
            text_start = i
            while i < length and tex_content[i] not in '\n{}[]\\':
                i += 1
            
            text = tex_content[text_start:i].strip()
            if text:
                tokens.append(Token(TokenType.TEXT, text, text, position=text_start))
        
        return tokens

    def _build_tree(self, tokens: list) -> list:
        """
        Build a tree structure from tokens.
        Handles commands, environments, and text generically.
        Tracks positions for source mapping.
        """
        nodes = []
        i = 0
        
        while i < len(tokens):
            token = tokens[i]
            
            if token.type == TokenType.NEWLINE:
                i += 1
                continue
            
            elif token.type == TokenType.COMMAND:
                if token.value == '\\begin':
                    # Parse \begin{envname} ... \end{envname}
                    env_node, i = self._parse_environment(tokens, i)
                    if env_node:
                        nodes.append(env_node)
                    continue
                else:
                    # Regular command (possibly with arguments)
                    cmd_node, i = self._parse_command(tokens, i)
                    nodes.append(cmd_node)
                    continue
            
            elif token.type == TokenType.TEXT:
                nodes.append(LaTeXNode(
                    node_type="text",
                    content=[token.value],
                    raw_source=token.raw,
                    start_pos=token.position,
                    end_pos=token.position + len(token.raw)
                ))
                i += 1
                continue
            
            else:
                i += 1
        
        return nodes

    def _parse_command(self, tokens: list, start_idx: int) -> tuple:
        """Parse a single command with optional arguments, tracking positions"""
        cmd_token = tokens[start_idx]
        cmd_name = cmd_token.value  # e.g., "\resumeItem"
        start_pos = cmd_token.position
        i = start_idx + 1
        
        # Collect optional arguments [...]
        optional_args = []
        while i < len(tokens) and tokens[i].type == TokenType.BRACKET_OPEN:
            i += 1
            arg_content = []
            depth = 1
            while i < len(tokens) and depth > 0:
                if tokens[i].type == TokenType.BRACKET_OPEN:
                    depth += 1
                elif tokens[i].type == TokenType.BRACKET_CLOSE:
                    depth -= 1
                    if depth == 0:
                        break
                arg_content.append(tokens[i])
                i += 1
            optional_args.append(arg_content)
            i += 1  # Skip closing ]
        
        # Collect required arguments {...}
        required_args = []
        arg_end_pos = start_pos + len(cmd_token.raw)
        while i < len(tokens) and tokens[i].type == TokenType.BRACE_OPEN:
            i += 1
            arg_content = []
            depth = 1
            while i < len(tokens) and depth > 0:
                if tokens[i].type == TokenType.BRACE_OPEN:
                    depth += 1
                elif tokens[i].type == TokenType.BRACE_CLOSE:
                    depth -= 1
                    if depth == 0:
                        arg_end_pos = tokens[i].position + len(tokens[i].raw)
                        break
                arg_content.append(tokens[i])
                i += 1
            required_args.append(arg_content)
            i += 1  # Skip closing }
        
        # Convert argument tokens to text
        required_args_text = [self._tokens_to_text(arg) for arg in required_args]
        optional_args_text = [self._tokens_to_text(arg) for arg in optional_args]
        
        node = LaTeXNode(
            node_type="command",
            name=cmd_name,
            content=required_args_text,
            properties={
                "optional_args": optional_args_text
            },
            raw_source=cmd_token.raw,
            start_pos=start_pos,
            end_pos=arg_end_pos
        )
        
        return node, i

    def _parse_environment(self, tokens: list, start_idx: int) -> tuple:
        """Parse a \begin{env} ... \end{env} environment, tracking positions"""
        begin_token = tokens[start_idx]
        start_pos = begin_token.position
        i = start_idx + 1
        
        # Expect {envname}
        if i >= len(tokens) or tokens[i].type != TokenType.BRACE_OPEN:
            return None, i
        
        i += 1
        env_name_tokens = []
        while i < len(tokens) and tokens[i].type != TokenType.BRACE_CLOSE:
            env_name_tokens.append(tokens[i])
            i += 1
        
        env_name = self._tokens_to_text(env_name_tokens)
        i += 1  # Skip closing }
        
        # Collect content until \end{envname}
        content_nodes = []
        end_pos = start_pos
        while i < len(tokens):
            if tokens[i].type == TokenType.COMMAND and tokens[i].value == '\\end':
                # Check if this is \end{envname}
                end_check_idx = i + 1
                if (end_check_idx < len(tokens) and 
                    tokens[end_check_idx].type == TokenType.BRACE_OPEN):
                    end_check_idx += 1
                    end_name_tokens = []
                    while (end_check_idx < len(tokens) and 
                           tokens[end_check_idx].type != TokenType.BRACE_CLOSE):
                        end_name_tokens.append(tokens[end_check_idx])
                        end_check_idx += 1
                    end_name = self._tokens_to_text(end_name_tokens)
                    
                    if end_name == env_name:
                        # Found matching \end
                        end_pos = (tokens[end_check_idx].position + len(tokens[end_check_idx].raw)
                                   if end_check_idx < len(tokens) else i)
                        i = end_check_idx + 1  # Skip past }
                        break
            
            # Not the end, parse content
            if tokens[i].type == TokenType.NEWLINE:
                i += 1
                continue
            elif tokens[i].type == TokenType.COMMAND:
                if tokens[i].value in ['\\begin', '\\end']:
                    # Nested environment
                    nested, i = self._parse_environment(tokens, i)
                    if nested:
                        content_nodes.append(nested)
                else:
                    # Nested command
                    nested, i = self._parse_command(tokens, i)
                    content_nodes.append(nested)
            elif tokens[i].type == TokenType.TEXT:
                content_nodes.append(LaTeXNode(
                    node_type="text",
                    content=[tokens[i].value],
                    raw_source=tokens[i].raw,
                    start_pos=tokens[i].position,
                    end_pos=tokens[i].position + len(tokens[i].raw)
                ))
                i += 1
            else:
                i += 1
        
        node = LaTeXNode(
            node_type="environment",
            name=env_name,
            content=content_nodes,
            raw_source=begin_token.raw,
            start_pos=start_pos,
            end_pos=end_pos
        )
        
        return node, i

    def _tokens_to_text(self, tokens: list) -> str:
        """Convert a list of tokens to plain text"""
        result = []
        for token in tokens:
            if token.type == TokenType.TEXT:
                result.append(token.value)
            elif token.type in [TokenType.COMMAND]:
                # Include command as text
                result.append(token.value)
            elif token.type == TokenType.NEWLINE:
                result.append(' ')
        return ' '.join(result).strip()

    def _generate_cleaned_content(self, nodes: list, depth: int = 0) -> str:
        """
        Generate cleaned, human-readable content from the tree.
        Strips all LaTeX formatting for LLM processing.
        Reduced token size compared to normalized_content.
        """
        lines = []
        
        for node in nodes:
            if node.node_type == "text":
                text = ' '.join(node.content)
                if text.strip():
                    lines.append(text.strip())
            
            elif node.node_type == "command":
                # For commands, include argument content only (not the command itself)
                if node.content:
                    for arg in node.content:
                        if isinstance(arg, str) and arg.strip():
                            lines.append(arg.strip())
            
            elif node.node_type == "environment":
                # For environments, just process content recursively
                if node.content:
                    nested_content = self._generate_cleaned_content(node.content, depth + 1)
                    if nested_content:
                        lines.append(nested_content)
        
        return '\n'.join(filter(None, lines))

    def _tree_to_dict(self, nodes: list) -> list:
        """Convert tree to dictionary for JSON serialization, including positions"""
        result = []
        for node in nodes:
            node_dict = {
                "type": node.node_type,
                "name": node.name,
                "raw_source": node.raw_source,
                "start_pos": node.start_pos,
                "end_pos": node.end_pos
            }
            
            if node.content:
                if all(isinstance(c, str) for c in node.content):
                    node_dict["content"] = node.content
                else:
                    node_dict["content"] = self._tree_to_dict(node.content)
            
            if node.properties:
                node_dict["properties"] = node.properties
            
            result.append(node_dict)
        
        return result