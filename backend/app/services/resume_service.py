import os
import pdfplumber
from typing import Dict, Any

class ResumeService:
    def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """
        Dummy implementation for resume parsing.
        A real implementation would use pdfplumber, docx, spacy, transformers.
        """
        text = ""
        try:
            if file_path.endswith('.pdf'):
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            else:
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
        except Exception as e:
            text = f"Error reading file: {e}"
            
        name = "Candidate"
        target_role = "General Applicant"
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if lines:
            name = lines[0]
            if len(lines) > 1 and len(lines[1]) < 60:
                target_role = lines[1]

        # Basic mock parsing
        return {
            "name": name,
            "target_role": target_role,
            "skills": ["python", "java", "sql"],
            "education": "B.Tech Computer Science",
            "experience_months": 6,
            "raw_text": text
        }

    def score_resume(self, parsed_data: Dict[str, Any]) -> float:
        """
        Mock ATS scoring based on parsed data length/content
        """
        score = 0.5
        if "python" in parsed_data.get("skills", []):
            score += 0.2
        if parsed_data.get("experience_months", 0) > 0:
            score += 0.2
        return min(score, 1.0)
