import asyncio
import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from models import User, LLMResponse, ResumeMatchingScoreReq, ResumeMatchingScoreRes
from models.resume import ParsedResume
from models.JobDescription import (
    ComparisonResult,
    JobDescription,
    JobDescriptionInput,
)
from llm import analyze_resume_engine, generateMatchScore
from Services.texParserService import TexParserService
from Services.latex_cleaning_service import LaTeXCleaningService
from Services.resume_extraction_service import ResumeExtractionService
from Services.JDParser import JDParser
from Services.compareAnalysisService import CompareAnalysisService

load_dotenv()

app = FastAPI(title="Resume Analyzer API", version="1.0.0")

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.api_route("/", methods=["GET", "HEAD"])
def health_check():
    return {"message": "API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/resume/matchJD", response_model=ComparisonResult)
async def match_resume_with_jd(
    file: UploadFile = File(...),
    jd: str = Form(...),
):
    try:
        parsed_resume = await parse_resume_file(file)
        parsed_jd = await asyncio.to_thread(JDParser().parse, jd)
        comparer = CompareAnalysisService()
        return await comparer.compare_resume_with_jd(
            jd=parsed_jd,
            resume_content=parsed_resume,
        )
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Resume matching service failed: {error}",
        ) from error

@app.post("/resume/parseJD", response_model=JobDescription)
async def parse_job_description(request: JobDescriptionInput):
    parser = JDParser()
    return await asyncio.to_thread(parser.parse, request.text)


@app.post("/resume/upload", response_model=ParsedResume)
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload and parse a LaTeX resume file.
    
    Pipeline:
    1. Parse LaTeX (generic, no assumptions about template)
    2. Clean content (remove formatting, reduce tokens)
    3. Extract via LLM (lightweight semantic extraction only)
    
    Returns:
        ParsedResume: Contains raw_tex, cleaned_text, source_mappings, and extracted Resume
    """
    return await parse_resume_file(file)


async def parse_resume_file(file: UploadFile) -> ParsedResume:
    """Parse an uploaded LaTeX resume into the structured resume model."""
    if not file.filename or not file.filename.lower().endswith(".tex"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only .tex files are allowed.")

    content = await file.read()
    try:
        tex_content = content.decode("utf-8")
    except UnicodeDecodeError as error:
        raise HTTPException(status_code=400, detail="The .tex file must be UTF-8 encoded.") from error

    # Step 1: Parse LaTeX (deterministic structural parsing)
    parser = TexParserService()
    parsed_data = parser.parse(tex_content)
    
    # Step 2: Clean LaTeX content (deterministic formatting removal)
    cleaner = LaTeXCleaningService()
    final_cleaned_text = cleaner.clean(parsed_data["cleaned_text"])
    
    # Step 3: Extract resume using LLM (lightweight semantic extraction only)
    extractor = ResumeExtractionService()
    resume = await extractor.extract_resume(
        cleaned_text=final_cleaned_text,
        raw_tex=tex_content
    )
    
    # Return complete parsed resume with all metadata for agent editing
    return ParsedResume(
        source_mappings=parsed_data["source_mappings"],
        raw_tex=parsed_data["raw_tex"],
        normalized_content=final_cleaned_text,  # Cleaned content for reference
        resume=resume
    )


@app.post("/analyze_resume", response_model=LLMResponse)
async def analyze(resumeModel: User):
    response = await analyze_resume_engine(resumeModel.resume_str)
    return response


@app.post("/generate_matching_score", response_model=ResumeMatchingScoreRes)
async def matchScore(jdModel: ResumeMatchingScoreReq):
    res = await generateMatchScore(jdModel.job_description, jdModel.resume)
    return res

