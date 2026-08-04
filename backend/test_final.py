import sys
sys.path.append('/Users/zayn/Documents/Work/hirechance-ui/backend')
from app.services.recommend_service import recommend_service
import pdfplumber

def parse(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

text = parse("/app/data/raw/resumes/1_OliverDavisResume.pdf")
print("Experience calculated:", recommend_service.recommender.calculate_total_experience(text))
