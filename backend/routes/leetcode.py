# leetcode.py
from fastapi import APIRouter
from services.leetcode_service import get_leetcode_data

router = APIRouter(
    prefix="/leetcode",
    tags=["LeetCode"]
)

@router.get("/{username}")
def leetcode(username: str):
    return get_leetcode_data(username)
