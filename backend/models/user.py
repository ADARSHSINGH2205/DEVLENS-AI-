# user.py
from pydantic import BaseModel

class UserProfile(BaseModel):
    github: str
    leetcode: str
    linkedin: str
