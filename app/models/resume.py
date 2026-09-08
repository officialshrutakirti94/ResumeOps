from pydantic import BaseModel


class Experience(BaseModel):
    company: str
    role: str
    duration: str
    bullets: list[str]


class Project(BaseModel):
    name: str
    description: list[str]
    technologies: list[str]


class Education(BaseModel):
    institution: str
    degree: str
    duration: str
    details: list[str]


class Resume(BaseModel):
    name: str
    role: str
    summary: str | None = None
    skills: list[str]
    experience: list[Experience]
    projects: list[Project]
    education: list[Education]
    certifications: list[str]


class ParsedResume(BaseModel):
    """
    Wraps the original LaTeX and the extracted Resume model.
    Preserves raw_tex for later editing operations.
    """
    raw_tex: str
    normalized_content: str
    resume: Resume