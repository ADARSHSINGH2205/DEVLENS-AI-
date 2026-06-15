import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://frontend-adarsh21.vercel.app",
    "https://frontend-fzkuijhxh-adarsh21.vercel.app",
]
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", ",".join(DEFAULT_CORS_ORIGINS)).split(",")
    if origin.strip()
]

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found")

if not MONGO_URI or MONGO_URI == "your_mongodb_uri":
    print("WARNING: MONGO_URI not configured")
