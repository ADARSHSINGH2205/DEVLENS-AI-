def _cap_ratio(value, cap):
    if cap <= 0:
        return 0

    return min(max(value, 0), cap) / cap


def calculate_score(github, leetcode):
    """
    Build a balanced 0-100 readiness score.

    The previous formula was driven mostly by raw counts, which could heavily
    inflate or flatten the result. This version uses capped ratios so each
    signal contributes proportionally without letting a single metric dominate.
    """

    github_repos = github.get("repos", 0)
    github_stars = github.get("stars", 0)
    github_followers = github.get("followers", 0)
    github_forks = github.get("forks", 0)
    github_languages = len(github.get("languages", {}) or {})
    github_recent_activity = len(github.get("recentActivity", []) or [])

    total_solved = leetcode.get("totalSolved", 0)
    hard_solved = leetcode.get("hardSolved", 0)
    contest_rating = leetcode.get("contestRating", 0)
    contests_attended = leetcode.get("contestsAttended", 0)
    skill_tags = len(leetcode.get("skillTags", []) or [])

    github_score = (
        _cap_ratio(github_repos, 30) * 15 +
        _cap_ratio(github_stars, 120) * 15 +
        _cap_ratio(github_followers, 60) * 10 +
        _cap_ratio(github_forks, 80) * 5 +
        _cap_ratio(github_languages, 8) * 5 +
        _cap_ratio(github_recent_activity, 10) * 5
    )

    leetcode_score = (
        _cap_ratio(total_solved, 400) * 20 +
        _cap_ratio(hard_solved, 60) * 10 +
        _cap_ratio(contest_rating, 2500) * 10 +
        _cap_ratio(contests_attended, 30) * 3 +
        _cap_ratio(skill_tags, 10) * 2
    )

    final_score = github_score + leetcode_score

    return round(min(final_score, 100), 2)
