from models.JobDescription import KeywordComparison, ComparisonResult
from models.JobDescription import JobDescription
from models.resume import ParsedResume
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()

class CompareAnalysisService:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = "gemini-2.5-flash"

    async def compare_resume_with_jd(self, jd: JobDescription, resume_content: ParsedResume) -> ComparisonResult:
        jd_data=jd.model_dump()
        resume_data=resume_content.resume.model_dump()
        prompt = f"""You are an expert technical recruiter comparing a job description with a candidate resume.

Use only evidence explicitly present in the resume. Do not invent experience, skills, or qualifications.
Treat a skill as matched when it is clearly present. Treat it as partial when the resume shows related
experience but does not explicitly demonstrate the exact requirement. Treat it as missing when there
is no supporting evidence. The match_score must be an integer from 0 to 100.

JOB DESCRIPTION:
{jd_data}

CANDIDATE RESUME:
{resume_data}

Return only JSON matching the ComparisonResult schema. For every partial match, include the resume
evidence when available and a practical suggestion. Keep recommendations grounded in the resume and JD.
"""
        response = await asyncio.to_thread(
            self.client.models.generate_content,
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type="application/json",
                response_schema=ComparisonResult
            )
        )
        if response.parsed is None:
            raise RuntimeError("Gemini returned no comparison result")
        return response.parsed