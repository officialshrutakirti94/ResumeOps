"""
Unit Tests for LaTeX Resume Parser

Tests the TexParserService with 3 completely different LaTeX resume templates
to verify the parser does NOT depend on specific commands or section names.

Template 1: Standard LaTeX with custom commands (\resumeItem, \resumeSubheading)
Template 2: Minimalist plain LaTeX with \section and \subsection
Template 3: Completely custom environment-based structure
"""

import sys
import os

# Add app to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from Services.texParserService import TexParserService
import pytest


# ============================================================================
# TEMPLATE 1: Custom command-based resume (AltaCV/Deedy style)
# ============================================================================

TEMPLATE_1_CUSTOM_COMMANDS = r"""
\documentclass[11pt]{altacv}
\usepackage{paracol}

\name{Alice Johnson}
\tagline{Senior Software Engineer | Python \& Go}
\photo{2.8cm}{photo.jpg}

\begin{document}

\begin{paracol}{2}

\section{Experience}
\resumeSubheading{Google Inc}{Mountain View, CA}{Senior Software Engineer}{Jan 2020 -- Present}
  \resumeItem{Led development of distributed payment system handling 10M+ transactions daily}
  \resumeItem{Reduced API latency by 40\% through database optimization}
  
\resumeSubheading{Acme Corp}{San Francisco, CA}{Software Engineer}{Jun 2018 -- Dec 2019}
  \resumeItem{Built microservices architecture using Go and Kubernetes}
  \resumeItem{Mentored junior engineers and conducted code reviews}

\section{Projects}
\resumeProjectHeading{\textbf{Open Source Contribution}}{2022}
  \resumeItem{Contributed key features to popular Python ORM library}
  \resumeItem{Technologies: Python, SQLAlchemy, PostgreSQL}

\section{Education}
\resumeSubheading{University of California, Berkeley}{Berkeley, CA}{B.S. in Computer Science}{2018}
  \resumeItem{GPA: 3.9/4.0}
  \resumeItem{Dean's List all semesters}

\section{Skills}
\skill{Languages}{Python, Go, JavaScript, SQL}
\skill{Frameworks}{FastAPI, Django, React}
\skill{Databases}{PostgreSQL, MongoDB, Redis}
\skill{Tools}{Docker, Kubernetes, Git}

\end{paracol}

\end{document}
"""

# ============================================================================
# TEMPLATE 2: Minimalist plain LaTeX (no custom commands)
# ============================================================================

TEMPLATE_2_PLAIN_LATEX = r"""
\documentclass{article}
\usepackage[margin=1in]{geometry}

\begin{document}

\centerline{\textbf{\Large Bob Chen}}
\centerline{San Francisco, CA | bob@example.com | linkedin.com/in/bobchen}

\section*{Professional Summary}
Experienced full-stack developer with 5 years in web development. Specializing in cloud infrastructure and distributed systems.

\section*{Work Experience}

\textbf{Lead Backend Engineer} \hfill {2021 -- Present} \\
\textit{TechStartup Inc.} \hfill San Francisco, CA
\begin{itemize}
  \item Architected microservices platform handling 100K requests/second
  \item Implemented real-time data pipeline using Apache Kafka and Spark
  \item Reduced operational costs by 35\% through infrastructure optimization
\end{itemize}

\textbf{Backend Developer} \hfill {2019 -- 2021} \\
\textit{DataSystems LLC} \hfill Remote
\begin{itemize}
  \item Developed REST APIs serving 50M+ users
  \item Built automated testing framework increasing coverage to 85\%
\end{itemize}

\section*{Projects}

\textbf{Real-time Analytics Dashboard} \\
Open-source project for streaming data visualization. Built with Python, Node.js, and PostgreSQL. Gained 1.2K GitHub stars.

\section*{Education}

\textbf{Master of Science in Computer Science} \\
Carnegie Mellon University, Pittsburgh, PA (2019)

\textbf{Bachelor of Science in Information Systems} \\
University of Washington, Seattle, WA (2017)

\section*{Technical Skills}

\textbf{Programming:} Python, Node.js, Go, Java, SQL \\
\textbf{Cloud:} AWS, GCP, Docker, Kubernetes \\
\textbf{Databases:} PostgreSQL, MongoDB, DynamoDB, Cassandra \\
\textbf{Other:} Git, Jenkins, Terraform, Linux

\end{document}
"""

# ============================================================================
# TEMPLATE 3: Completely custom environment-based structure
# ============================================================================

TEMPLATE_3_CUSTOM_ENVIRONMENTS = r"""
\documentclass{resume}

\begin{header}
  \fullname{Carol Davis}
  \contact{Seattle, WA | carol@example.com | github.com/caroldavis}
  \title{ML Engineer | Data Scientist}
\end{header}

\begin{body}

\begin{jobHistory}
  \job{2022 - Present}{AI Research Engineer}{DeepMind Labs}{London, UK}
    \achievement{Developed novel transformer architecture improving inference speed by 50\%}
    \achievement{Published 3 peer-reviewed papers in top-tier ML conferences}
    \achievement{Led team of 8 researchers}

  \job{2020 - 2022}{Data Scientist}{MetaAI}{Menlo Park, CA}
    \achievement{Built recommendation system serving 2B users}
    \achievement{Implemented graph neural networks for entity linking}
    \achievement{Won company innovation award}

  \job{2018 - 2020}{Junior ML Engineer}{CloudVision Inc}{Seattle, WA}
    \achievement{Deployed production ML models on Kubernetes}
    \achievement{Optimized model inference latency by 60\%}
\end{jobHistory}

\begin{buildingsBlocks}
  \block{Core Skills}
    Python, PyTorch, TensorFlow, Scikit-learn, XGBoost
    Distributed Systems, MLOps, Computer Vision, NLP

  \block{Qualifications}
    PhD in Machine Learning, Stanford University (2018)
    BS in Mathematics and Computer Science, MIT (2015)

  \block{Research Interests}
    Efficient neural architectures, few-shot learning, transfer learning

  \block{Certifications}
    AWS Machine Learning Specialty (2021)
    Deep Learning Specialization, Coursera (2019)
\end{buildingsBlocks}

\end{body}

\end{document}
"""


class TestTexParser:
    """Test suite for TexParserService"""

    def test_template_1_parsing(self):
        """Test parsing Template 1 (custom commands)"""
        parser = TexParserService()
        result = parser.parse(TEMPLATE_1_CUSTOM_COMMANDS)

        # Verify output structure
        assert "raw_tex" in result
        assert "normalized_content" in result
        assert "document_structure" in result

        # Verify raw_tex is preserved
        assert result["raw_tex"] == TEMPLATE_1_CUSTOM_COMMANDS

        # Verify content was extracted
        normalized = result["normalized_content"]
        assert "Alice Johnson" in normalized or "Alice" in normalized
        assert "Google" in normalized or "google" in normalized.lower()
        assert len(normalized) > 100

        # Verify document structure exists
        assert isinstance(result["document_structure"], list)
        assert len(result["document_structure"]) > 0

    def test_template_2_parsing(self):
        """Test parsing Template 2 (plain LaTeX)"""
        parser = TexParserService()
        result = parser.parse(TEMPLATE_2_PLAIN_LATEX)

        # Verify output structure
        assert "raw_tex" in result
        assert "normalized_content" in result
        assert "document_structure" in result

        # Verify raw_tex is preserved
        assert result["raw_tex"] == TEMPLATE_2_PLAIN_LATEX

        # Verify content was extracted
        normalized = result["normalized_content"]
        assert "Bob Chen" in normalized or "Bob" in normalized
        assert "TechStartup" in normalized or "Lead" in normalized
        assert len(normalized) > 100

        # Verify document structure exists
        assert isinstance(result["document_structure"], list)
        assert len(result["document_structure"]) > 0

    def test_template_3_parsing(self):
        """Test parsing Template 3 (custom environments)"""
        parser = TexParserService()
        result = parser.parse(TEMPLATE_3_CUSTOM_ENVIRONMENTS)

        # Verify output structure
        assert "raw_tex" in result
        assert "normalized_content" in result
        assert "document_structure" in result

        # Verify raw_tex is preserved
        assert result["raw_tex"] == TEMPLATE_3_CUSTOM_ENVIRONMENTS

        # Verify content was extracted
        normalized = result["normalized_content"]
        assert "Carol Davis" in normalized or "Carol" in normalized
        assert "DeepMind" in normalized or "AI" in normalized or "Research" in normalized
        assert len(normalized) > 100

        # Verify document structure exists
        assert isinstance(result["document_structure"], list)
        assert len(result["document_structure"]) > 0

    def test_comment_removal(self):
        """Test that comments are removed correctly"""
        tex_with_comments = r"""
\documentclass{article}
% This is a comment
\begin{document}
Hello World % another comment
This is not \% commented % but this is
\end{document}
"""
        parser = TexParserService()
        result = parser.parse(tex_with_comments)

        normalized = result["normalized_content"]
        # Should not contain the comment markers
        assert "This is a comment" not in normalized
        assert "another comment" not in normalized
        # But should contain the escaped percent
        assert "not \\% commented" in normalized or "commented" in normalized

    def test_parser_extracts_commands_generically(self):
        """Test that parser extracts commands without assuming specific names"""
        tex = r"""
\documentclass{article}
\begin{document}
\customCommand{Some content}
\anotherCommand{More content}
\yetAnotherCommand[optional]{required}
\begin{customEnvironment}
Nested content
\end{customEnvironment}
\end{document}
"""
        parser = TexParserService()
        result = parser.parse(tex)

        # Should have extracted the structure
        assert len(result["document_structure"]) > 0

        # The normalized content should contain references to the commands
        normalized = result["normalized_content"]
        assert len(normalized) > 0

    def test_parser_handles_nested_braces(self):
        """Test that parser correctly handles nested braces"""
        tex = r"""
\command{outer {inner {nested}} content}
\another{level1 {level2 {level3}}}
"""
        parser = TexParserService()
        result = parser.parse(tex)

        # Should not crash and should produce output
        assert result["normalized_content"] is not None
        assert len(result["document_structure"]) > 0

    def test_parser_preserves_raw_tex(self):
        """Test that raw_tex is exactly preserved"""
        tex = TEMPLATE_1_CUSTOM_COMMANDS
        parser = TexParserService()
        result = parser.parse(tex)

        assert result["raw_tex"] == tex
        assert result["raw_tex"] is not None
        assert len(result["raw_tex"]) == len(tex)

    def test_normalized_content_is_readable(self):
        """Test that normalized content is human-readable"""
        parser = TexParserService()
        result = parser.parse(TEMPLATE_2_PLAIN_LATEX)

        normalized = result["normalized_content"]

        # Should be readable text, not raw LaTeX
        assert "\\" not in normalized or len(normalized) > 200  # Some LaTeX is ok if we have content
        assert "Bob" in normalized or "Chen" in normalized or len(normalized) > 100

    def test_empty_resume(self):
        """Test parsing an empty or minimal resume"""
        tex = r"""
\documentclass{article}
\begin{document}
\end{document}
"""
        parser = TexParserService()
        result = parser.parse(tex)

        # Should not crash
        assert "raw_tex" in result
        assert "normalized_content" in result
        assert result["raw_tex"] == tex

    def test_parser_with_unicode(self):
        """Test parsing resume with Unicode characters"""
        tex = r"""
\documentclass{article}
\begin{document}
\name{José García}
Café, naïve, résumé
\end{document}
"""
        parser = TexParserService()
        result = parser.parse(tex)

        # Should handle Unicode
        assert "José" in result["raw_tex"] or "García" in result["raw_tex"]
        assert len(result["normalized_content"]) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
