from collections import Counter
import os
import requests

HEADERS = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "AI-DevConnect-profile-analyzer",
    "Authorization": f"Bearer {os.getenv('GITHUB_TOKEN', '')}"
}

def _get_json(url, params=None):
    response = requests.get(
        url,
        headers=HEADERS,
        params=params,
        timeout=12
    )

    if response.status_code == 404:
        return None

    response.raise_for_status()
    return response.json()


def get_github_data(username):

    try:

        user_url = f"https://api.github.com/users/{username}"
        repo_url = f"https://api.github.com/users/{username}/repos"
        events_url = f"https://api.github.com/users/{username}/events/public"

        user = _get_json(user_url)

        if not user:
            return {
                "error": "GitHub user not found"
            }

        repos = _get_json(
            repo_url,
            {
                "per_page": 100,
                "sort": "updated",
                "direction": "desc"
            }
        ) or []

        events = _get_json(
            events_url,
            {
                "per_page": 30
            }
        ) or []

        total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
        total_forks = sum(repo.get("forks_count", 0) for repo in repos)
        total_watchers = sum(repo.get("watchers_count", 0) for repo in repos)
        open_issues = sum(repo.get("open_issues_count", 0) for repo in repos)

        language_counts = Counter(
            repo.get("language")
            for repo in repos
            if repo.get("language")
        )
        language_bytes = Counter()

        for repo in sorted(
            repos,
            key=lambda item: (
                item.get("stargazers_count", 0),
                item.get("forks_count", 0),
                item.get("size", 0)
            ),
            reverse=True
        )[:20]:
            languages_url = repo.get("languages_url")

            if not languages_url:
                continue

            try:
                language_bytes.update(_get_json(languages_url) or {})
            except requests.RequestException:
                continue

        top_repositories = [
            {
                "name": repo.get("name"),
                "fullName": repo.get("full_name"),
                "description": repo.get("description"),
                "url": repo.get("html_url"),
                "language": repo.get("language"),
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "watchers": repo.get("watchers_count", 0),
                "openIssues": repo.get("open_issues_count", 0),
                "isFork": repo.get("fork", False),
                "createdAt": repo.get("created_at"),
                "updatedAt": repo.get("updated_at"),
                "pushedAt": repo.get("pushed_at"),
                "topics": repo.get("topics", []),
                "homepage": repo.get("homepage")
            }
            for repo in sorted(
                repos,
                key=lambda item: (
                    item.get("stargazers_count", 0),
                    item.get("forks_count", 0),
                    item.get("updated_at") or ""
                ),
                reverse=True
            )[:8]
        ]

        recent_activity = [
            {
                "type": event.get("type"),
                "repo": event.get("repo", {}).get("name"),
                "createdAt": event.get("created_at")
            }
            for event in events[:8]
        ]

        return {
            "username": user.get("login"),
            "name": user.get("name"),
            "bio": user.get("bio"),
            "company": user.get("company"),
            "location": user.get("location"),
            "blog": user.get("blog"),
            "email": user.get("email"),
            "twitter": user.get("twitter_username"),
            "profileUrl": user.get("html_url"),
            "avatar": user.get("avatar_url"),
            "followers": user.get("followers", 0),
            "following": user.get("following", 0),
            "repos": user.get("public_repos", 0),
            "publicGists": user.get("public_gists", 0),
            "hireable": user.get("hireable"),
            "createdAt": user.get("created_at"),
            "updatedAt": user.get("updated_at"),
            "stars": total_stars,
            "forks": total_forks,
            "watchers": total_watchers,
            "openIssues": open_issues,
            "languages": dict(language_counts),
            "languageBytes": dict(language_bytes),
            "topRepositories": top_repositories,
            "recentActivity": recent_activity
        }

    except Exception as e:

        return {
            "error": str(e)
        }
