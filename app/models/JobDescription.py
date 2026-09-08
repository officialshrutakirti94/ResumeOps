from pydantic import BaseModel, Field
from models.resume import ParsedResume

class JobDescription(BaseModel):
    title: str
    company: str
    location: str
    description: str
    requirements: list[str]
    responsibilities: list[str]


class JobDescriptionInput(BaseModel):
    text: str = Field(min_length=1)


class MatchJDRequest(BaseModel):
    job_description: JobDescription
    resume: ParsedResume

class KeywordComparison(BaseModel):
    keyword: str
    status: str
    evidence: str | None = None
    suggestion: str | None = None


class ComparisonResult(BaseModel):
    match_score: int = Field(ge=0, le=100)

    matched_skills: list[str]

    missing_skills: list[str]

    partial_matches: list[KeywordComparison]

    matched_requirements: list[str]

    missing_requirements: list[str]

    recommendations: list[str]

    summary: str