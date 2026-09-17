from google import genai
from google.genai import types
import os
import asyncio
from dotenv import load_dotenv
from models import LLMResponse,User,ResumeMatchingScoreRes
load_dotenv()


def _client() -> genai.Client:
  api_key = os.getenv("GEMINI_API_KEY")
  if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not configured")
  return genai.Client(api_key=api_key)

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

  response = await asyncio.to_thread(
    _client().models.generate_content,
    model="gemini-2.5-flash",
    contents=prompt,
    config=types.GenerateContentConfig(
      temperature=0.1,
      response_mime_type="application/json",
      response_schema=LLMResponse
    )
  )
  if response.parsed is None:
    raise RuntimeError("Gemini returned no analysis result")
  return response.parsed


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

  response = await asyncio.to_thread(
    _client().models.generate_content,
    model="gemini-2.5-flash",
    contents=prompt,
    config=types.GenerateContentConfig(
      temperature=0.5,
      response_mime_type="application/json",
      response_schema=ResumeMatchingScoreRes
    )
    )
  if response.parsed is None:
    raise RuntimeError("Gemini returned no match score")
  return response.parsed
