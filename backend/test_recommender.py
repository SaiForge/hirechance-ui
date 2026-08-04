import sys
sys.path.append('/Users/zayn/Documents/hirechance-ui/backend')

from app.services.recommend_service import recommend_service

print("Testing recommender...")
res = recommend_service.recommend_jobs("AI Engineer with Python, React, and 4 years of experience at Amazon")
print(res[:1])
