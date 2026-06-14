# linkedin.py
from fastapi import APIRouter
from services.linkedin_service import get_linkedin_data

router = APIRouter(
    prefix="/linkedin",
    tags=["LinkedIn"]
)

@router.get("/")
def linkedin(profile_url: str):

    return get_linkedin_data(profile_url)
