import json
from models.JobDescription import JobDescription
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()


class JDParser:
    def __init__(self):
            self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            self.model = "openai/gpt-oss-120b"
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
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert technical recruiter."},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        raw = response.choices[0].message.content
        if not raw:
            raise RuntimeError("Groq returned no parsed job description")
        return JobDescription.model_validate_json(raw)
        
        