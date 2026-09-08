"""
Integration Tests for Resume Parser Pipeline

Tests the full pipeline: LaTeX parsing → Normalization → LLM extraction
Uses mock LLM responses for testing without API costs.
"""

import sys
import os
from unittest.mock import AsyncMock, patch, MagicMock

# Add app to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from Services.texParserService import TexParserService
from Services.resume_extraction_service import ResumeExtractionService
from models.resume import Resume, Experience, Project, Education
import pytest
import asyncio


# Sample resume in custom format
SAMPLE_RESUME = r"""
\documentclass{resume}

\name{John Smith}
\position{Full Stack Software Engineer}

\begin{document}

\section{Summary}
Experienced full-stack engineer with 7 years building scalable web applications
using React, Node.js, and cloud infrastructure.

\section{Experience}

\workItem{Senior Engineer}{TechCorp Inc}{2021 - Present}{New York, NY}
  \bullet Led team rebuilding legacy monolith into microservices
  \bullet Improved deployment time from 2 hours to 5 minutes
  \bullet Mentored 3 junior developers

\workItem{Software Engineer}{StartupXYZ}{2018 - 2021}{San Francisco, CA}
  \bullet Built real-time collaboration platform
  \bullet Implemented WebSocket infrastructure
  \bullet Reduced database queries by 70% through caching

\section{Projects}

\projectItem{Analytics Dashboard}
  \bullet Real-time data visualization platform
  \bullet Built with React, Node.js, PostgreSQL
  \bullet Used by 10K+ users

\section{Education}

\degreeItem{Bachelor of Science in Computer Science}{UC Berkeley}{2018}
  \bullet Relevant Coursework: Distributed Systems, Database Design

\section{Technical Skills}

Frontend: React, TypeScript, CSS, HTML
Backend: Node.js, Python, Go, Java
Databases: PostgreSQL, MongoDB, Redis
Cloud: AWS, Docker, Kubernetes
Tools: Git, Jenkins, Webpack

\section{Certifications}

AWS Solutions Architect Associate (2022)
Kubernetes Administrator Certified (2023)

\end{document}
"""


class TestResumePipeline:
    """Test the complete resume parsing pipeline"""

    @pytest.mark.asyncio
    async def test_full_pipeline_with_mock_llm(self):
        """Test complete pipeline: parse → normalize → extract (with mock LLM)"""

        # Step 1: Parse LaTeX
        parser = TexParserService()
        parsed = parser.parse(SAMPLE_RESUME)

        # Verify parsing succeeded
        assert "raw_tex" in parsed
        assert "normalized_content" in parsed
        assert parsed["raw_tex"] == SAMPLE_RESUME

        # Step 2: Mock the LLM response
        mock_resume = Resume(
            name="John Smith",
            role="Senior Full Stack Engineer",
            summary="Experienced full-stack engineer with 7 years building scalable web applications",
            skills=[
                "React",
                "Node.js",
                "TypeScript",
                "PostgreSQL",
                "AWS",
                "Docker",
                "Kubernetes",
                "Python",
                "Go",
            ],
            experience=[
                Experience(
                    company="TechCorp Inc",
                    role="Senior Engineer",
                    duration="2021 - Present",
                    bullets=[
                        "Led team rebuilding legacy monolith into microservices",
                        "Improved deployment time from 2 hours to 5 minutes",
                        "Mentored 3 junior developers",
                    ],
                ),
                Experience(
                    company="StartupXYZ",
                    role="Software Engineer",
                    duration="2018 - 2021",
                    bullets=[
                        "Built real-time collaboration platform",
                        "Implemented WebSocket infrastructure",
                    ],
                ),
            ],
            projects=[
                Project(
                    name="Analytics Dashboard",
                    description=["Real-time data visualization platform"],
                    technologies=["React", "Node.js", "PostgreSQL"],
                )
            ],
            education=[
                Education(
                    institution="UC Berkeley",
                    degree="Bachelor of Science in Computer Science",
                    duration="2018",
                    details=["Relevant Coursework: Distributed Systems, Database Design"],
                )
            ],
            certifications=[
                "AWS Solutions Architect Associate (2022)",
                "Kubernetes Administrator Certified (2023)",
            ],
        )

        # Step 3: Test extraction service
        extractor = ResumeExtractionService()

        # Mock the LLM call
        with patch.object(extractor.client.models, "generate_content") as mock_generate:
            mock_response = MagicMock()
            mock_response.parsed = mock_resume
            mock_generate.return_value = mock_response

            result = await extractor.extract_resume(
                normalized_content=parsed["normalized_content"], raw_tex=parsed["raw_tex"]
            )

            # Verify extraction succeeded
            assert result.name == "John Smith"
            assert result.role == "Senior Full Stack Engineer"
            assert len(result.skills) > 0
            assert len(result.experience) > 0
            assert len(result.projects) > 0
            assert len(result.education) > 0
            assert len(result.certifications) > 0

    def test_parser_structure_independence(self):
        """
        Verify that parser correctly handles different resume structures
        without assuming specific command names
        """

        # Different variations of the same information
        variations = [
            # Variation 1: Custom commands
            r"""
\resumeItem{John Doe}
\position{Senior Engineer}
\workDate{2020 - 2023}
\company{Google}
""",
            # Variation 2: Environments
            r"""
\begin{candidate}
John Doe
\end{candidate}
\begin{role}
Senior Engineer
\end{role}
""",
            # Variation 3: Plain text with sections
            r"""
\textbf{John Doe}
\textit{Senior Engineer}
2020 - 2023 | Google
""",
        ]

        for variation in variations:
            parser = TexParserService()
            result = parser.parse(variation)

            # All variations should:
            # 1. Preserve raw_tex
            assert result["raw_tex"] == variation

            # 2. Produce normalized content
            assert len(result["normalized_content"]) > 0

            # 3. Have a document structure
            assert isinstance(result["document_structure"], list)

    def test_parser_robustness_with_edge_cases(self):
        """Test parser robustness with edge cases"""

        edge_cases = [
            # Empty braces
            (r"\command{}", "Empty braces"),
            # Deeply nested braces
            (r"\cmd{a{b{c{d{e{f}}}}}}", "Deeply nested"),
            # Escaped characters
            (r"Price: \$100, email: user\@example.com", "Escaped characters"),
            # Multiple commands on one line
            (r"\cmd1{arg1}\cmd2{arg2}\cmd3{arg3}", "Multiple commands"),
            # Mixed environments and commands
            (r"\cmd \begin{env} content \end{env}", "Mixed"),
        ]

        for tex_content, description in edge_cases:
            parser = TexParserService()
            try:
                result = parser.parse(tex_content)
                assert result is not None
                assert "raw_tex" in result
                assert result["raw_tex"] == tex_content
            except Exception as e:
                pytest.fail(f"Parser failed on {description}: {e}")

    def test_normalized_content_quality(self):
        """Test that normalized content is suitable for LLM processing"""
        parser = TexParserService()
        result = parser.parse(SAMPLE_RESUME)

        normalized = result["normalized_content"]

        # Normalized content should:
        # 1. Be non-empty
        assert len(normalized) > 0

        # 2. Be readable (mostly printable characters)
        printable_chars = sum(1 for c in normalized if c.isprintable() or c.isspace())
        assert printable_chars / len(normalized) > 0.8

        # 3. Should not have excessive LaTeX markup (at most 20% should be special chars)
        special_chars = sum(1 for c in normalized if c in "\\{}[]")
        assert special_chars / len(normalized) < 0.2

    def test_extraction_graceful_failure(self):
        """Test that extraction handles LLM failures gracefully"""

        async def test_failure_handling():
            extractor = ResumeExtractionService()

            # Mock LLM to raise an exception
            with patch.object(extractor.client.models, "generate_content") as mock_generate:
                mock_generate.side_effect = Exception("API Error")

                result = await extractor.extract_resume(
                    normalized_content="Some content", raw_tex="\\tex"
                )

                # Should return empty Resume with no errors
                assert result.name == ""
                assert result.role == ""
                assert result.skills == []
                assert result.experience == []
                assert result.projects == []
                assert result.education == []
                assert result.certifications == []

        asyncio.run(test_failure_handling())

    def test_resume_model_validation(self):
        """Test that Resume Pydantic model validates correctly"""

        # Valid resume
        valid_resume = Resume(
            name="John Doe",
            role="Engineer",
            summary="Test summary",
            skills=["Python", "Go"],
            experience=[
                Experience(
                    company="Company",
                    role="Role",
                    duration="2020-2023",
                    bullets=["Achievement 1"],
                )
            ],
            projects=[
                Project(name="Project 1", description=["Desc"], technologies=["Tech1"])
            ],
            education=[
                Education(
                    institution="University",
                    degree="BS",
                    duration="2020",
                    details=["Detail1"],
                )
            ],
            certifications=["Cert1"],
        )

        assert valid_resume.name == "John Doe"
        assert len(valid_resume.skills) == 2

        # Minimal resume (all optional fields empty)
        minimal_resume = Resume(
            name="Jane Doe",
            role="",
            summary=None,
            skills=[],
            experience=[],
            projects=[],
            education=[],
            certifications=[],
        )

        assert minimal_resume.name == "Jane Doe"
        assert minimal_resume.role == ""
        assert minimal_resume.summary is None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
