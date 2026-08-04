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
    
    month_names = r'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec'
    date_pattern = rf'(?:(?:(?:{month_names})[a-z]*\s+)|(?:\d{{1,2}}[/-]))?\d{{4}}'
    end_pattern = rf'(?:{date_pattern}|present|current|now|today)'
    range_pattern = rf'({date_pattern})\s*(?:-|–|to)\s*({end_pattern})'
    
    # We will search in the entire text
    intervals = []
    now = datetime(2026, 8, 4)
    
    edu_keywords = ['university', 'college', 'bachelor', 'master', 'phd', 'degree', 'b.s.', 'b.a.', 'b.tech', 'education']
    
    for match in re.finditer(range_pattern, text_lower, re.IGNORECASE):
        start_str = match.group(1)
        end_str = match.group(2)
        
        # Check context (e.g. 100 characters before and after)
        start_pos = max(0, match.start() - 150)
        end_pos = min(len(text_lower), match.end() + 150)
        context = text_lower[start_pos:end_pos]
        
        is_edu = False
        for kw in edu_keywords:
            if kw in context:
                # To be safe, verify it's somewhat close or part of an education block
                # actually, maybe just checking if 'education' or 'degree' is near
                is_edu = True
                break
                
        if is_edu:
            print(f"Skipping {start_str} - {end_str} as it seems to be Education")
            continue
            
        start_date = parse_date(start_str)
        if not start_date: continue
        if end_str.lower() in ['present', 'current', 'now', 'today']: end_date = now
        else: end_date = parse_date(end_str)
        if not end_date: continue
        if start_date > end_date: continue
        intervals.append((start_date, end_date))
        print(f"Added {start_str} - {end_str}")
        
    if not intervals: return 0.0
    intervals.sort(key=lambda x: x[0])
    merged_intervals = [intervals[0]]
    for current in intervals[1:]:
        prev = merged_intervals[-1]
        if current[0] <= prev[1]: merged_intervals[-1] = (prev[0], max(prev[1], current[1]))
        else: merged_intervals.append(current)
    total_days = sum((end - start).days for start, end in merged_intervals)
    return round(total_days / 365.25, 1)

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
print("EXP:", calc(text))
