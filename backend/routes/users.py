from fastapi import APIRouter

from database import delete_saved_user, get_mongo_status, get_recent_users

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/recent")
def recent_users(limit: int = 6):
    return {
        "users": get_recent_users(limit),
        "mongo": get_mongo_status(),
    }


@router.delete("/profile")
def delete_user_profile(github_username: str, leetcode_username: str):
    deleted = delete_saved_user(github_username, leetcode_username)

    return {
        "deleted": deleted,
        "mongo": get_mongo_status(),
    }
