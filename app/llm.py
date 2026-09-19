import json
from groq import AsyncGroq
import os
from dotenv import load_dotenv
from models import LLMResponse,User,ResumeMatchingScoreRes
load_dotenv()


def _client() -> AsyncGroq:
  api_key = os.getenv("GROQ_API_KEY")
  if not api_key:
    raise RuntimeError("GROQ_API_KEY is not configured")
  return AsyncGroq(api_key=api_key)

async def analyze_resume_engine(content:str)->LLMResponse:
  prompt=f"""You are an expert technical recruiter.

  Analyze the candidate's resume-{content}.

  Extract skills, identify the likely role,
  evaluate experience level, identify strengths
  and missing skills.

  Return the result according to the provided schema:
      name:str
      role:str
      skills:list[str]
      experience_level:str
      strengths:list[str]"""

  client = _client()
  response = await client.chat.completions.create(
    model="openai/gpt-oss-120b",
    messages=[
      {"role": "system", "content": "You are an expert technical recruiter."},
      {"role": "user", "content": prompt},
    ],
    response_format={"type": "json_object"},
    temperature=0.1,
  )
  raw = response.choices[0].message.content
  if not raw:
    raise RuntimeError("Groq returned no analysis result")
  result = LLMResponse.model_validate_json(raw)
  return result


async def generateMatchScore(jd:str,resume_content:str)->ResumeMatchingScoreRes:
  prompt=f"""You are an expert technical recruiter.

  Analyze the candidate's resume-{resume_content}.

  Extract skills, identify the likely role,
  evaluate experience level, identify strengths
  and missing skills.
  
  now compare the candidate's resume with the job description-{jd}.

  then generate a score for this resume on comaprison with the jobDescription

  Return the result according to the provided schema:
      score:int
      matching_skills:list[str]
      missing_skills:list[str]
      suggestions:str"""

  client = _client()
  response = await client.chat.completions.create(
    model="openai/gpt-oss-120b",
    messages=[
      {"role": "system", "content": "You are an expert technical recruiter."},
      {"role": "user", "content": prompt},
    ],
    response_format={"type": "json_object"},
    temperature=0.5,
  )
  raw = response.choices[0].message.content
  if not raw:
    raise RuntimeError("Groq returned no match score")
  result = ResumeMatchingScoreRes.model_validate_json(raw)
  return result
