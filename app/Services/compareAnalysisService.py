import json
from models.JobDescription import ComparisonResult
from models.JobDescription import JobDescription
from models.resume import ParsedResume
from groq import AsyncGroq
from dotenv import load_dotenv
import os

load_dotenv()


def _extract_json_object(raw: str):
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:].strip()
    return json.loads(text)


class CompareAnalysisService:
    def __init__(self):
        self.client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "openai/gpt-oss-120b"

    async def compare_resume_with_jd(self, jd: JobDescription, resume_content: ParsedResume) -> ComparisonResult:
        jd_data = jd.model_dump()
        resume_data = resume_content.resume.model_dump()
        prompt = """You are an expert technical recruiter comparing a job description with a candidate resume.

Your response must be valid JSON that matches this exact schema:
{
  "match_score": 0,
  "matched_skills": ["skill 1", "skill 2"],
  "missing_skills": ["skill 3"],
  "partial_matches": [
    {
      "keyword": "exact requirement or skill",
      "status": "matched|partial|missing",
      "evidence": "short text from resume supporting this",
      "suggestion": "actionable suggestion"
    }
  ],
  "matched_requirements": ["requirement 1", "requirement 2"],
  "missing_requirements": ["requirement 3"],
  "recommendations": ["string 1", "string 2"],
  "summary": "brief summary"
}

Rules:
- Use only evidence explicitly present in the resume.
- Do not invent experience, skills, or qualifications.
- match_score must be an integer from 0 to 100.
- partial_matches must be objects with keys exactly: keyword, status, evidence, suggestion.
- matched_requirements and missing_requirements must be arrays of strings, not arrays of objects.
- matched_skills, missing_skills, recommendations must all be arrays of strings.
- summary must be a concise narrative paragraph.
- Output ONLY valid JSON, with no markdown fences, no prose, no comments.

JOB DESCRIPTION:
""" + json.dumps(jd_data, ensure_ascii=False) + """

CANDIDATE RESUME:
""" + json.dumps(resume_data, ensure_ascii=False)
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert technical recruiter. Output only valid JSON matching the schema exactly."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        raw = response.choices[0].message.content

        if not raw:
            raise RuntimeError("Groq returned no comparison result")

        payload = _extract_json_object(raw)
        return ComparisonResult.model_validate(payload)