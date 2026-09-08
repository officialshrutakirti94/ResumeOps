from pydantic import BaseModel


class User(BaseModel):
    resume_id: int
    resume_str: str


class LLMResponse(BaseModel):
    name: str
    role: str
    skills: list[str]
    experience_level: str
    education: list[str]
    strengths: list[str]


class ResumeMatchingScoreReq(BaseModel):
    resume: str
    job_description: str


class ResumeMatchingScoreRes(BaseModel):
    score: int
    matching_skills: list[str]
    missing_skills: list[str]
    suggestions: str
