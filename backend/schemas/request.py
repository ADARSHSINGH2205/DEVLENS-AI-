# request.py
from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    github_username: str
    leetcode_username: str
    linkedin_url: str
