import os
import sys
import traceback
import re
from datetime import datetime
from typing import List, Dict, Any
import numpy as np
if not hasattr(np, 'float_'):
    np.float_ = np.float64

class JobRecommenderModel:
    def __init__(self, model_name='all-MiniLM-L6-v2', db_path='./india_job_vector_db', collection_name='india_it_jobs'):
        self.model_name = model_name
        self.db_path = db_path
        self.collection_name = collection_name
        self.model = None
        self.client = None
        self.collection = None
        
        self.tier_1_companies = [
            'google', 'amazon', 'apple', 'meta', 'microsoft', 'netflix', 
            'openai', 'stripe', 'uber', 'airbnb', 'atlassian'
        ]
        self.tier_2_companies = [
            'swiggy', 'zomato', 'razorpay', 'flipkart', 'phonepe', 'paytm', 'cred'
        ]
        self.tier_1_colleges = ['iit', 'nit', 'bits pilani', 'iisc', 'iiit', 'isb']
        self.tier_2_colleges = ['vit', 'srm', 'dtu', 'pec']
        self.common_certs = ['aws certified', 'ccna', 'cka', 'google cloud professional', 'pmp', 'cissp']
        self.title_hierarchy = ['intern', 'junior', 'developer', 'senior', 'lead', 'manager', 'director']
        self.skills_list = [
            'python', 'java', 'react', 'aws', 'docker', 'kubernetes', 'sql', 'kafka', 
            'c++', 'c#', 'javascript', 'typescript', 'node.js', 'node', 'django', 'flask', 
            'spring', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 
            'azure', 'gcp', 'linux', 'git', 'ci/cd', 'jenkins', 'terraform', 'ansible', 
            'hadoop', 'spark', 'pytorch', 'tensorflow', 'keras', 'pandas', 'numpy', 
            'scikit-learn', 'graphql', 'mongodb', 'postgresql', 'mysql', 'redis', 
            'elasticsearch', 'rabbitmq', 'angular', 'vue', 'html', 'css'
        ]

        self._init_components()

    def _resolve_db_path(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        candidates = [
            os.path.join(base_dir, "india_job_vector_db"),
            self.db_path,
            "/home/site/wwwroot/india_job_vector_db",
            "/app/india_job_vector_db",
            "./india_job_vector_db",
            "india_job_vector_db",
        ]
        for p in candidates:
            if os.path.isdir(p) and os.listdir(p):
                print(f"[Model] Found valid vector DB at: {p}")
                return p
        raise RuntimeError(f"No valid vector DB found. Checked: {candidates}")

    def _init_components(self):
        import chromadb
        from sentence_transformers import SentenceTransformer

        resolved_db_path = self._resolve_db_path()

        self.model = SentenceTransformer(self.model_name, device='cpu')
        print(f"[Model] SentenceTransformer loaded: {self.model_name}")

        self.client = chromadb.PersistentClient(path=resolved_db_path)

        try:
            cols = self.client.list_collections()
            if cols:
                col_names = []
                for c in cols:
                    if isinstance(c, str):
                        col_names.append(c)
                    elif hasattr(c, 'name'):
                        col_names.append(c.name)
                    else:
                        col_names.append(str(c))
                print(f"[Model] Available collections: {col_names}")
            else:
                col_names = []
        except Exception as e:
            print(f"[Model] Warning listing collections: {e}")
            col_names = []

        if self.collection_name in col_names:
            self.collection = self.client.get_collection(name=self.collection_name)
        elif col_names:
            self.collection = self.client.get_collection(name=col_names[0])
            print(f"[Model] Using first available collection: {col_names[0]}")
        else:
            self.collection = self.client.get_or_create_collection(name=self.collection_name)
            print(f"[Model] Created new collection: {self.collection_name}")

    def __getstate__(self):
        state = self.__dict__.copy()
        state.pop('model', None)
        state.pop('client', None)
        state.pop('collection', None)
        return state

    def __setstate__(self, state):
        self.__dict__.update(state)
        self._init_components()

    def parse_date(self, date_str):
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

    def calculate_total_experience(self, text):
        text_lower = text.lower()
        
        month_names = r'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec'
        date_pattern = rf'(?:(?:(?:{month_names})[a-z]*\s+)|(?:\d{{1,2}}[/-]))?\d{{4}}'
        end_pattern = rf'(?:{date_pattern}|present|current|now|today)'
        range_pattern = rf'({date_pattern})\s*(?:-|–|to)\s*({end_pattern})'
        
        intervals = []
        now = datetime.now()
        
        edu_keywords = ['university', 'college', 'bachelor', 'master', 'phd', 'degree', 'b.s.', 'b.a.', 'b.tech', 'education', 'school', 'institute']
        
        for match in re.finditer(range_pattern, text_lower, re.IGNORECASE):
            start_str = match.group(1)
            end_str = match.group(2)
            
            # Check context (e.g. 150 characters before and after)
            start_pos = max(0, match.start() - 150)
            end_pos = min(len(text_lower), match.end() + 150)
            context = text_lower[start_pos:end_pos]
            
            is_edu = False
            for kw in edu_keywords:
                if kw in context:
                    is_edu = True
                    break
                    
            if is_edu:
                continue
                
            start_date = self.parse_date(start_str)
            if not start_date: continue
            if end_str.lower() in ['present', 'current', 'now', 'today']: end_date = now
            else: end_date = self.parse_date(end_str)
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

    def extract_entities(self, text):
        if not text: return set(), 0, set(), set(), -1, set()
        text_lower = text.lower()
        found_skills = set(skill for skill in self.skills_list if re.search(r'\b' + re.escape(skill) + r'\b', text_lower))
        exp_section_match = re.search(r'\b(?:experience|work history|employment|career)\b[\s:]*(.*?)(?:\b(?:education|skills|projects|certifications|summary|objective)\b|$)', text_lower, re.IGNORECASE | re.DOTALL)
        search_text = exp_section_match.group(1) if exp_section_match else text_lower
        found_companies = set()
        for company in self.tier_1_companies + self.tier_2_companies:
            if company == 'google': pattern = r'\bgoogle\b(?!\s+(?:cloud|workspace|ads)\b)'
            elif company == 'amazon': pattern = r'\bamazon\b(?!\s+(?:web\s+services|aws|s3)\b)'
            elif company == 'microsoft': pattern = r'\bmicrosoft\b(?!\s+(?:office|azure|sql)\b)'
            else: pattern = r'\b' + re.escape(company) + r'\b'
            if re.search(pattern, search_text): found_companies.add(company)
        found_colleges = set(college for college in self.tier_1_colleges + self.tier_2_colleges if re.search(r'\b' + re.escape(college) + r'\b', text_lower))
        found_certs = set(cert for cert in self.common_certs if re.search(r'\b' + re.escape(cert) + r'\b', text_lower))
        title_level = -1
        for i, title in enumerate(self.title_hierarchy):
            if re.search(r'\b' + re.escape(title) + r'\b', text_lower): title_level = max(title_level, i)
        exp_years = self.calculate_total_experience(text)
        if exp_years == 0.0:
            matches = re.findall(r'(\d+)\+?\s*years?', text_lower)
            if matches:
                try: exp_years = max([float(m) for m in matches])
                except ValueError: pass
        return found_skills, exp_years, found_companies, found_colleges, title_level, found_certs

    def calculate_brand_score(self, found_companies):
        if any(company in self.tier_1_companies for company in found_companies): return 100.0
        if any(company in self.tier_2_companies for company in found_companies): return 75.0
        return 40.0

    def calculate_edu_score(self, found_colleges):
        if any(college in self.tier_1_colleges for college in found_colleges): return 100.0
        if any(college in self.tier_2_colleges for college in found_colleges): return 75.0
        return 50.0

    def calculate_cert_score(self, jd_certs, cand_certs):
        if not jd_certs: return 80.0
        if cand_certs.intersection(jd_certs): return 100.0
        return 20.0

    def calculate_title_score(self, resume_level, jd_level):
        if resume_level == -1 or jd_level == -1: return 50.0
        if resume_level == jd_level: return 100.0
        if resume_level == jd_level - 1: return 80.0
        if resume_level <= jd_level - 2: return 50.0
        return 90.0

    def predict(self, resume_text: str) -> List[Dict[str, Any]]:
        if not resume_text or not resume_text.strip(): return []
        if self.model is None or self.collection is None: self._init_components()
        if self.model is None or self.collection is None: raise RuntimeError("Model or collection not initialized")

        try:
            col_count = self.collection.count()
        except Exception:
            col_count = 100
        if col_count == 0: return []
        
        resume_embedding = self.model.encode(resume_text).tolist()
        cand_skills, cand_exp, cand_companies, cand_colleges, cand_title_level, cand_certs = self.extract_entities(resume_text)
        cand_brand_score = self.calculate_brand_score(cand_companies)
        cand_edu_score = self.calculate_edu_score(cand_colleges)

        try:
            results = self.collection.query(
                query_embeddings=[resume_embedding],
                n_results=min(50, col_count),
                include=['metadatas', 'distances', 'documents']
            )
        except Exception as e:
            raise RuntimeError(f"ChromaDB query failed: {e}")

        def safe_get(obj, key):
            try: return obj[key]
            except: return getattr(obj, key, None)

        metadatas = safe_get(results, 'metadatas')
        distances = safe_get(results, 'distances')
        documents = safe_get(results, 'documents')
        
        if not metadatas or not distances: return []
        
        meta_list = list(metadatas[0]) if metadatas else []
        dist_list = list(distances[0]) if distances else []
        doc_list = list(documents[0]) if documents and len(documents) > 0 else [''] * len(meta_list)

        scored_results = []
        for meta, dist, doc in zip(meta_list, dist_list, doc_list):
            if not isinstance(meta, dict): continue
            jd_text = doc if doc else meta.get('Job_Description', '')
            if not jd_text: jd_text = str(meta)
                
            jd_skills, jd_exp, _, _, jd_title_level, jd_certs = self.extract_entities(jd_text)
            
            jd_title_text = str(meta.get('Job_Title', '')).lower()
            if jd_title_level == -1 and jd_title_text:
                for i, title in enumerate(self.title_hierarchy):
                    if re.search(r'\b' + re.escape(title) + r'\b', jd_title_text):
                        jd_title_level = max(jd_title_level, i)
                        
            title_score = self.calculate_title_score(cand_title_level, jd_title_level)
            cert_score = self.calculate_cert_score(jd_certs, cand_certs)
            
            try: dist_val = float(dist)
            except: dist_val = 0.5
            
            cosine_similarity = 1 - dist_val
            semantic_score = 50 + ((cosine_similarity - 0.40) / (0.75 - 0.40)) * (95 - 50)
            semantic_score = max(0, min(100, semantic_score))
            
            if not jd_skills:
                skill_score = 100.0
                keyword_overlap_score = 100.0
            else:
                matched_skills = cand_skills.intersection(jd_skills)
                skill_score = (len(matched_skills) / len(jd_skills)) * 100.0
                matched_keywords = [skill for skill in jd_skills if re.search(r'\b' + re.escape(skill) + r'\b', resume_text.lower())]
                keyword_overlap_score = (len(matched_keywords) / len(jd_skills)) * 100.0
                
            if jd_exp == 0: exp_score = 100.0
            elif cand_exp >= jd_exp: exp_score = 100.0
            else: exp_score = (cand_exp / jd_exp) * 100.0
                
            final_score = (semantic_score * 0.20) + (keyword_overlap_score * 0.25) + (skill_score * 0.15) + \
                          (exp_score * 0.10) + (cand_brand_score * 0.10) + (cand_edu_score * 0.05) + \
                          (title_score * 0.05) + (cert_score * 0.10)
            
            matched_skills_list = list(cand_skills.intersection(jd_skills)) if jd_skills else []
            missing_skills_list = list(jd_skills - cand_skills) if jd_skills else []
            
            exp_feedback = f"You have {cand_exp} years, JD requires {jd_exp} years."
            if cand_brand_score >= 100.0: pedigree_feedback = "Tier-1 experience detected."
            elif cand_brand_score >= 75.0: pedigree_feedback = "Tier-2 experience detected."
            else: pedigree_feedback = "No MAANG/Tier-1 experience detected."
            
            scored_results.append({
                'Company': str(meta.get('Company', 'N/A')),
                'Job_Title': str(meta.get('Job_Title', 'N/A')),
                'Description': str(jd_text),
                'Final_Score': round(final_score, 1),
                'Location': str(meta.get('Location', 'N/A')),
                'Job_URL': str(meta.get('Job_URL', 'N/A')),
                'Insights': {
                    "Semantic_Score": round(semantic_score, 1),
                    "Skill_Score": round(skill_score, 1),
                    "Experience_Score": round(exp_score, 1),
                    "Brand_Score": round(cand_brand_score, 1),
                    "Education_Score": round(cand_edu_score, 1),
                    "Matched_Skills": matched_skills_list,
                    "Missing_Skills": missing_skills_list,
                    "Experience_Feedback": exp_feedback,
                    "Pedigree_Feedback": pedigree_feedback
                },
                '_score': final_score
            })
            
        scored_results.sort(key=lambda x: x['_score'], reverse=True)
        
        final_results = []
        seen_companies = set()
        for item in scored_results:
            company = item['Company']
            if company not in seen_companies:
                seen_companies.add(company)
                del item['_score']
                final_results.append(item)
                if len(final_results) == 10: break
                    
        return final_results

sys.modules['__main__'].JobRecommenderModel = JobRecommenderModel

class RecommendationService:
    def __init__(self):
        self.recommender = None
        # Model will be loaded lazily on first request via recommend_jobs() or background thread

    def _load_model(self):
        print("=" * 60)
        print("[RecommendationService] Starting model initialization...")
        print(f"[RecommendationService] CWD: {os.getcwd()}")

        try:
            import pickle
            
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            # Look for model.pkl in common locations
            model_paths = [
                os.path.join(base_dir, "model.pkl"),
                "/home/site/wwwroot/model.pkl",
                "model.pkl", 
                "app/model.pkl", 
                "/app/model.pkl"
            ]
            loaded_path = None
            
            for p in model_paths:
                if os.path.exists(p):
                    loaded_path = p
                    break
                    
            if loaded_path:
                print(f"[RecommendationService] Loading model from {loaded_path}...")
                with open(loaded_path, 'rb') as f:
                    self.recommender = pickle.load(f)
                print("[RecommendationService] Model loaded successfully from pickle!")
            else:
                print("[RecommendationService] model.pkl not found. Falling back to direct instantiation...")
                self.recommender = JobRecommenderModel(
                    model_name='all-MiniLM-L6-v2',
                    db_path='./india_job_vector_db',
                    collection_name='india_it_jobs'
                )
                print("[RecommendationService] Model instantiated successfully!")
        except Exception as e:
            print(f"[RecommendationService] ERROR: {e}")
            traceback.print_exc()
            self.recommender = None

        print("=" * 60)

    def recommend_jobs(self, resume_text: str) -> List[Dict[str, Any]]:
        if self.recommender is None:
            self._load_model()
        if self.recommender is None:
            raise RuntimeError("Recommendation model is not available")
        return self.recommender.predict(resume_text)

recommend_service = RecommendationService()
