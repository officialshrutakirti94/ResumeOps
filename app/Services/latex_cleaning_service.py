"""
LaTeX Cleaning Service

Converts parsed LaTeX content to clean, readable text optimized for LLM processing.
Removes all formatting commands and produces concise, scannable text.

This reduces token usage significantly compared to raw LaTeX.
"""

import re


class LaTeXCleaningService:
    """
    Cleans LaTeX content for LLM processing.
    
    - Removes all LaTeX commands
    - Converts environments to readable structure
    - Preserves semantic content
    - Reduces token usage
    """

    def __init__(self):
        pass

    def clean(self, cleaned_text: str) -> str:
        """
        Further clean the already-cleaned text from parser.
        
        Args:
            cleaned_text: Output from TexParserService._generate_cleaned_content()
            
        Returns:
            Highly optimized text for LLM processing
        """
        # Remove any remaining LaTeX commands
        text = self._remove_latex_commands(cleaned_text)

        # Normalize whitespace
        text = self._normalize_whitespace(text)

        # Clean up common LaTeX artifacts
        text = self._remove_latex_artifacts(text)

        return text.strip()

    def _remove_latex_commands(self, text: str) -> str:
        """Remove remaining LaTeX commands like \textbf{}, \textit{}, etc."""
        # Remove \command{...} patterns
        text = re.sub(r'\\(?:text|emph|bf|it|tt|sc|small|large)[a-zA-Z]*\s*\{([^}]*)\}', r'\1', text)
        
        # Remove other single-argument commands
        text = re.sub(r'\\[a-zA-Z]+\{([^}]*)\}', r'\1', text)
        
        # Remove commands without arguments
        text = re.sub(r'\\[a-zA-Z]+\s*', '', text)
        
        # Remove escaped characters
        text = re.sub(r'\\(.)', r'\1', text)
        
        return text

    def _normalize_whitespace(self, text: str) -> str:
        """Normalize whitespace while preserving structure"""
        # Replace multiple spaces with single space
        text = re.sub(r' +', ' ', text)
        
        # Replace multiple newlines with double newline (preserves paragraphs)
        text = re.sub(r'\n\n+', '\n\n', text)
        
        # Clean up line endings
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        
        return text

    def _remove_latex_artifacts(self, text: str) -> str:
        """Remove common LaTeX artifacts"""
        # Remove standalone $ or $$
        text = re.sub(r'\$+', '', text)
        
        # Remove tilde ~
        text = re.sub(r'~', ' ', text)
        
        # Remove consecutive hyphens/dashes and normalize
        text = re.sub(r'[-–—]{2,}', '-', text)
        
        # Remove leading/trailing whitespace from lines
        lines = [line.strip() for line in text.split('\n')]
        text = '\n'.join(lines)
        
        return text
