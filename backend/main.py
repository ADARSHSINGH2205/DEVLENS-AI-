from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS, CORS_ORIGIN_REGEX
from routes.github import router as github_router
from routes.leetcode import router as leetcode_router
from routes.analyze import router as analyze_router
from routes.linkedin import router as linkedin_router
from routes.compare import router as compare_router
from routes.users import router as users_router

app = FastAPI(title="DevLens AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(github_router)
app.include_router(leetcode_router)
app.include_router(analyze_router)
app.include_router(linkedin_router)
app.include_router(compare_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "DevLens AI Running"
    }
