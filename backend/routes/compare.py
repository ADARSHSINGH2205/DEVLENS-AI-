# compare.py
from fastapi import APIRouter

from services.github_service import get_github_data
from services.leetcode_service import get_leetcode_data

router = APIRouter(
    prefix="/compare",
    tags=["Compare"]
)

@router.get("/")
def compare(
    github1: str,
    github2: str,
    leetcode1: str,
    leetcode2: str
):

    user1_github = get_github_data(github1)
    user2_github = get_github_data(github2)

    user1_leetcode = get_leetcode_data(leetcode1)
    user2_leetcode = get_leetcode_data(leetcode2)

    return {
        "user1": {
            "github": user1_github,
            "leetcode": user1_leetcode
        },
        "user2": {
            "github": user2_github,
            "leetcode": user2_leetcode
        }
    }
