def calculate_score(github, leetcode):

    total_solved = leetcode.get(
        "totalSolved",
        0
    )

    contest_rating = leetcode.get(
        "contestRating",
        0
    )

    github_score = (
        github.get("followers", 0) * 0.3 +
        github.get("repos", 0) * 0.4 +
        github.get("stars", 0) * 0.3
    )

    leetcode_score = (
        total_solved * 0.5 +
        contest_rating * 0.5
    )

    final_score = (
        github_score * 0.6 +
        leetcode_score * 0.4
    )

    return round(min(final_score / 20, 100), 2)
