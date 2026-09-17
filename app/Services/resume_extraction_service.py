"""
Resume Extraction Service (Hybrid Approach)

Lightweight LLM-based semantic extraction from cleaned LaTeX content.

The LaTeX parsing and cleaning is done deterministically.
The LLM only handles semantic understanding:
- Identifying which content represents which resume sections
- Understanding context and relationships
- Mapping to the Resume schema

This reduces token usage and API costs significantly.
"""

import json
import os
import asyncio
from google import genai
from google.genai import types
from dotenv import load_dotenv
from models.resume import Resume, Experience, Project, Education

load_dotenv()


class ResumeExtractionService:
    """
    Lightweight semantic extraction from cleaned LaTeX content.
    
    LLM responsibilities (only these):
    - Identify candidate name
    - Identify target role
    - Categorize bullet points as experience/projects/achievements
    - Extract dates and durations
    - Identify skills
    - Identify education
    - Identify certifications
    
    The LLM does NOT need to:
    - Parse LaTeX syntax
    - Build document structure
    - Handle different resume templates (parser already did this)
    - Strip LaTeX commands (cleaner already did this)
    """

    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = "gemini-2.5-flash"

    async def extract_resume(self, cleaned_text: str, raw_tex: str) -> Resume:
        """
        Extract structured resume from cleaned LaTeX content.

        Args:
            cleaned_text: Pre-cleaned, readable text (from LaTeX parser)
            raw_tex: Original LaTeX (for reference only)

        Returns:
            Resume: Validated Pydantic Resume object
        """

        # Build a lightweight prompt that focuses on semantic extraction only
        prompt = f"""Extract resume information from the following clean text.

INSTRUCTIONS:
- Be conservative: only extract information explicitly present in the text
- Do NOT invent, hallucinate, or assume information
- Return empty values for missing information (not null)
- Return None for optional fields like summary if not present

RETURN SCHEMA (JSON):
{{
  "name": "Candidate name (string, or empty if missing)",
  "role": "Current or target role (string, or empty if missing)",
  "summary": "Brief professional summary (string or null)",
  "skills": ["list", "of", "skills"],
  "experience": [
    {{
      "company": "Company name",
      "role": "Job title",
      "duration": "Date range or duration",
      "bullets": ["achievement 1", "achievement 2"]
    }}
  ],
  "projects": [
    {{
      "name": "Project name",
      "description": ["Description line 1"],
      "technologies": ["tech1", "tech2"]
    }}
  ],
  "education": [
    {{
      "institution": "University/School name",
      "degree": "Degree name",
      "duration": "Year(s)",
      "details": ["Detail 1", "Detail 2"]
    }}
  ],
  "certifications": ["Cert 1", "Cert 2"]
}}

TEXT TO ANALYZE:
---
{cleaned_text}
---

Extract and return ONLY valid JSON matching the schema above.
"""

        try:
            response = await asyncio.to_thread(
              self.client.models.generate_content,
              model=self.model,
              contents=prompt,
              config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type="application/json",
                response_schema=Resume,
              ),
            )

            # Parse the response
            parsed_resume = response.parsed

            # Validate and return
            if parsed_resume is None:
              raise RuntimeError("Gemini returned no parsed resume")
            return parsed_resume

        except Exception as e:
            print(f"Error during LLM extraction: {e}")
            # Return empty resume on error
            return Resume(
                name="",
                role="",
                summary=None,
                skills=[],
                experience=[],
                projects=[],
                education=[],
                certifications=[],
            )

