from fastapi import APIRouter

from services.github_service import get_github_data
from services.leetcode_service import get_leetcode_data
from services.linkedin_service import get_linkedin_data
from services.score_service import calculate_score
from services.gemini_service import analyze_profile
from database import save_analysis_result

router = APIRouter(
    prefix="/analyze",
    tags=["AI Analysis"]
)

@router.get("")
def analyze(
    github_username: str,
    leetcode_username: str,
    linkedin_url: str = ""
):

    github = get_github_data(
        github_username
    )

    if "error" in github:
        return github

    leetcode = get_leetcode_data(
        leetcode_username
    )

    if "error" in leetcode:
        return {
            "error": "Invalid LeetCode Username"
        }

    score = calculate_score(
        github,
        leetcode
    )

    linkedin = None

    if linkedin_url:
        linkedin = get_linkedin_data(
            linkedin_url
        )

    ai_result = analyze_profile(
        github,
        leetcode,
        linkedin
    )

    result = {
        "developer_score": score,
        "github": github,
        "leetcode": leetcode,
        "linkedin": linkedin,
        "ai_analysis": ai_result
    }

    mongo_saved = save_analysis_result(
        github_username,
        leetcode_username,
        result
    )

    result["mongo_saved"] = mongo_saved

    return result
