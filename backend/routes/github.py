# github.py
from fastapi import APIRouter
from services.github_service import get_github_data

router = APIRouter(
    prefix="/github",
    tags=["GitHub"]
)

@router.get("/{username}")
def github(username: str):

    return get_github_data(username)
