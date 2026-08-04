import pdfplumber
import sys

def parse(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

text = parse("/app/data/raw/resumes/1_OliverDavisResume.pdf")
print("--- EXTRACTED TEXT ---")
print(text)
print("----------------------")

import re
from datetime import datetime

def parse_date(date_str):
    if not date_str: return None
    date_str = date_str.strip()
    try:
        if len(date_str) == 4 and date_str.isdigit():
            return datetime(int(date_str), 1, 1)
        if '/' in date_str or '-' in date_str:
            sep = '/' if '/' in date_str else '-'
            parts = date_str.split(sep)
            if len(parts) == 2:
                month = int(parts[0].strip())
                year = int(parts[1].strip())
                if 1 <= month <= 12:
                    return datetime(year, month, 1)
        parts = date_str.split()
        if len(parts) >= 2:
            month_str, year_str = parts[-2], parts[-1]
            month_str = month_str[:3].title()
            month = datetime.strptime(month_str, "%b").month
            return datetime(int(year_str), month, 1)
    except ValueError:
        pass
    return None

def calc(text):
    text_lower = text.lower()
    start_keywords = r'\b(?:employment history|work experience|experience|professional experience)\b'
    end_keywords = r'\b(?:education|skills|projects|certifications|achievements)\b'
    start_match = re.search(start_keywords, text_lower)
    if start_match:
        start_idx = start_match.end()
        end_match = re.search(end_keywords, text_lower[start_idx:])
        if end_match:
            experience_text = text_lower[start_idx:start_idx + end_match.start()]
        else:
            experience_text = text_lower[start_idx:]
    else:
        experience_text = text_lower
    print("--- EXP TEXT ---")
    print(experience_text)
    
    month_names = r'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec'
    date_pattern = rf'(?:(?:(?:{month_names})[a-z]*\s+)|(?:\d{{1,2}}[/-]))?\d{{4}}'
    end_pattern = rf'(?:{date_pattern}|present|current|now|today)'
    range_pattern = rf'({date_pattern})\s*(?:-|–|to)\s*({end_pattern})'
    matches = re.findall(range_pattern, experience_text, re.IGNORECASE)
    print("MATCHES:", matches)
    if not matches: return 0.0
    intervals = []
    now = datetime(2026, 8, 4)
    for start_str, end_str in matches:
        start_date = parse_date(start_str)
        if not start_date: continue
        if end_str.lower() in ['present', 'current', 'now', 'today']: end_date = now
        else: end_date = parse_date(end_str)
        if not end_date: continue
        if start_date > end_date: continue
        intervals.append((start_date, end_date))
    if not intervals: return 0.0
    intervals.sort(key=lambda x: x[0])
    merged_intervals = [intervals[0]]
    for current in intervals[1:]:
        prev = merged_intervals[-1]
        if current[0] <= prev[1]: merged_intervals[-1] = (prev[0], max(prev[1], current[1]))
        else: merged_intervals.append(current)
    total_days = sum((end - start).days for start, end in merged_intervals)
    return round(total_days / 365.25, 1)

print("EXP:", calc(text))

