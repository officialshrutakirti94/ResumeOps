from fastapi import UploadFile
import pymupdf  # PyMuPDF  

async def parse_pdf(file: UploadFile) -> str:
    """
    Parses a PDF file and returns its text content.

    Args:
        file (UploadFile): The uploaded PDF file.

    """
    pdf_bytes = await file.read()

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    text_content = ""
    for page in doc:
        text_content += page.get_text()
    return text_content


