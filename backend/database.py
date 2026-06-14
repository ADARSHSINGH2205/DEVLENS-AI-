# database.py
from datetime import datetime, timezone

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from config import MONGO_URI

client = None
db = None
users_collection = None
last_mongo_error = ""


def get_users_collection():
    global client, db, users_collection, last_mongo_error

    if not MONGO_URI or MONGO_URI == "your_mongodb_uri":
        last_mongo_error = "MONGO_URI is not configured in backend/.env"
        return None

    if users_collection is None:
        try:
            client = MongoClient(
                MONGO_URI,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000,
                socketTimeoutMS=3000,
            )
            client.admin.command("ping")
            db = client["devconnect"]
            users_collection = db["users"]
            last_mongo_error = ""
        except PyMongoError as error:
            last_mongo_error = str(error)
            print(f"WARNING: MongoDB connection failed: {error}")
            return None

    return users_collection


def get_mongo_status():
    return {
        "connected": users_collection is not None,
        "error": last_mongo_error,
    }


def save_analysis_result(github_username, leetcode_username, result):
    global last_mongo_error

    collection = get_users_collection()

    if collection is None:
        return False

    github = result.get("github", {})
    leetcode = result.get("leetcode", {})
    linkedin = result.get("linkedin")
    ai_analysis = result.get("ai_analysis", "")

    document = {
        "github_username": github_username,
        "leetcode_username": leetcode_username,
        "developer_score": result.get("developer_score"),
        "github": {
            "username": github.get("username"),
            "followers": github.get("followers", 0),
            "repos": github.get("repos", 0),
            "stars": github.get("stars", 0),
            "top_languages": dict(
                sorted(
                    github.get("languages", {}).items(),
                    key=lambda item: item[1],
                    reverse=True
                )[:5]
            ),
        },
        "leetcode": {
            "username": leetcode.get("username"),
            "totalSolved": leetcode.get("totalSolved", 0),
            "easySolved": leetcode.get("easySolved", 0),
            "mediumSolved": leetcode.get("mediumSolved", 0),
            "hardSolved": leetcode.get("hardSolved", 0),
        },
        "ai_summary": str(ai_analysis)[:1000],
        "created_at": datetime.now(timezone.utc),
    }

    if linkedin:
        document["linkedin"] = {
            "profile_url": linkedin.get("profile_url"),
            "headline": linkedin.get("headline"),
            "skills": linkedin.get("skills", [])[:8],
            "experience": linkedin.get("experience"),
        }

    try:
        collection.update_one(
            {
                "github_username": github_username,
                "leetcode_username": leetcode_username,
            },
            {
                "$set": document,
                "$inc": {
                    "analysis_count": 1
                },
            },
            upsert=True
        )
        last_mongo_error = ""
        return True
    except PyMongoError as error:
        last_mongo_error = str(error)
        print(f"WARNING: MongoDB save failed: {error}")
        return False


def delete_saved_user(github_username, leetcode_username):
    global last_mongo_error

    collection = get_users_collection()

    if collection is None:
        return False

    try:
        result = collection.delete_one(
            {
                "github_username": github_username,
                "leetcode_username": leetcode_username,
            }
        )
        last_mongo_error = ""
        return result.deleted_count > 0
    except PyMongoError as error:
        last_mongo_error = str(error)
        print(f"WARNING: MongoDB delete failed: {error}")
        return False


def get_recent_users(limit=6):
    global last_mongo_error

    collection = get_users_collection()

    if collection is None:
        return []

    safe_limit = max(1, min(limit, 12))

    try:
        users = collection.find(
            {},
            {
                "_id": 0,
                "github_username": 1,
                "leetcode_username": 1,
                "developer_score": 1,
                "github.username": 1,
                "github.followers": 1,
                "github.repos": 1,
                "github.stars": 1,
                "leetcode.totalSolved": 1,
                "linkedin.headline": 1,
                "linkedin.experience": 1,
                "created_at": 1,
                "analysis_count": 1,
            }
        ).sort("created_at", -1).limit(safe_limit)

        result = []

        for user in users:
            created_at = user.get("created_at")

            if hasattr(created_at, "isoformat"):
                user["created_at"] = created_at.isoformat()

            result.append(user)

        return result
    except PyMongoError as error:
        last_mongo_error = str(error)
        print(f"WARNING: MongoDB fetch failed: {error}")
        return []
