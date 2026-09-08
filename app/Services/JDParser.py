from models.JobDescription import JobDescription
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()



class JDParser:
    def __init__(self):
            self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
            self.model = "gemini-2.5-flash"
    def parse(self,jd:str)->JobDescription:
        self.jd = jd
        prompt=f"""You are an expert technical recruiter.
Analyze the following job description and extract only information explicitly present.
Do not invent a company, location, requirement, or responsibility. Use empty strings or
empty lists when information is missing.

JOB DESCRIPTION:
---
{jd}
---

Return JSON matching this schema:
title: string
company: string
location: string
description: string
requirements: list[string]
responsibilities: list[string]
"""
        response=self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type="application/json",
                response_schema=JobDescription
            )
        )
        return response.parsed
        
        