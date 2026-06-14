import requests


URL = "https://leetcode.com/graphql"
HEADERS = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
    "User-Agent": "AI-DevConnect-profile-analyzer"
}


def _graphql(query, variables):
    response = requests.post(
        URL,
        json={
            "query": query,
            "variables": variables
        },
        headers=HEADERS,
        timeout=12
    )
    response.raise_for_status()
    return response.json()


def _count_by_difficulty(items):
    counts = {
        item.get("difficulty"): item.get("count", 0)
        for item in items or []
    }

    return {
        "total": counts.get("All", 0),
        "easy": counts.get("Easy", 0),
        "medium": counts.get("Medium", 0),
        "hard": counts.get("Hard", 0)
    }


def get_leetcode_data(username):

    query = """
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        githubUrl
        twitterUrl
        linkedinUrl
        profile {
          realName
          userAvatar
          ranking
          reputation
          starRating
          aboutMe
          school
          websites
          countryName
          company
          skillTags
        }
        badges {
          id
          displayName
          icon
          creationDate
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
      recentSubmissionList(username: $username, limit: 12) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
      userProfileUserQuestionProgressV2(userSlug: $username) {
        numAcceptedQuestions {
          count
          difficulty
        }
        numFailedQuestions {
          count
          difficulty
        }
        numUntouchedQuestions {
          count
          difficulty
        }
      }
    }
    """

    try:
        data = _graphql(
            query,
            {
                "username": username
            }
        )
    except Exception as e:
        return {
            "error": str(e)
        }

    user = data.get("data", {}).get("matchedUser")

    if not user:
        return {
            "error": "User not found"
        }

    accepted = _count_by_difficulty(
        user.get("submitStats", {}).get("acSubmissionNum")
    )
    submitted = _count_by_difficulty(
        user.get("submitStats", {}).get("totalSubmissionNum")
    )
    profile = user.get("profile") or {}
    contest = data.get("data", {}).get("userContestRanking") or {}
    progress = data.get("data", {}).get("userProfileUserQuestionProgressV2") or {}

    return {
        "username": user.get("username") or username,
        "realName": profile.get("realName"),
        "avatar": profile.get("userAvatar"),
        "ranking": profile.get("ranking"),
        "reputation": profile.get("reputation", 0),
        "starRating": profile.get("starRating"),
        "aboutMe": profile.get("aboutMe"),
        "school": profile.get("school"),
        "company": profile.get("company"),
        "country": profile.get("countryName"),
        "websites": profile.get("websites") or [],
        "skillTags": profile.get("skillTags") or [],
        "githubUrl": user.get("githubUrl"),
        "twitterUrl": user.get("twitterUrl"),
        "linkedinUrl": user.get("linkedinUrl"),
        "totalSolved": accepted["total"],
        "easySolved": accepted["easy"],
        "mediumSolved": accepted["medium"],
        "hardSolved": accepted["hard"],
        "totalSubmissions": submitted["total"],
        "easySubmissions": submitted["easy"],
        "mediumSubmissions": submitted["medium"],
        "hardSubmissions": submitted["hard"],
        "contestRating": round(contest.get("rating", 0) or 0, 2),
        "contestsAttended": contest.get("attendedContestsCount", 0) or 0,
        "contestGlobalRanking": contest.get("globalRanking"),
        "contestTopPercentage": contest.get("topPercentage"),
        "contestParticipants": contest.get("totalParticipants"),
        "badges": user.get("badges") or [],
        "recentSubmissions": data.get("data", {}).get("recentSubmissionList") or [],
        "questionProgress": {
            "accepted": progress.get("numAcceptedQuestions") or [],
            "failed": progress.get("numFailedQuestions") or [],
            "untouched": progress.get("numUntouchedQuestions") or []
        }
    }
