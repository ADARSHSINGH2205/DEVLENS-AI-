import json
import os
import re
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)

    model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )

else:
    model = None


def analyze_profile(github, leetcode, linkedin=None):

    if not model:
        return {
            "summary": "Gemini API key missing.",
            "strengths": [],
            "weakAreas": [],
            "questionAbility": "Not available",
            "platformRead": [],
            "nextActions": []
        }

    prompt = f"""
You are analyzing a developer for internships and early career roles.
Use only the evidence in the data below. Keep the response short, practical,
and easy for a beginner to understand.

GitHub:
{github}

LeetCode:
{leetcode}

LinkedIn:
{linkedin if linkedin else "Not provided"}

Return ONLY valid JSON with this exact shape:
{{
  "summary": "2 short sentences with the overall profile signal.",
  "strengths": ["3 concise points"],
  "weakAreas": ["3 concise points"],
  "questionAbility": "1 short paragraph about LeetCode/problem-solving ability.",
  "platformRead": [
    {{"platform": "GitHub", "insight": "1 concise evidence-based insight"}},
    {{"platform": "LeetCode", "insight": "1 concise evidence-based insight"}},
    {{"platform": "LinkedIn", "insight": "1 concise evidence-based insight"}}
  ],
  "nextActions": ["3 specific improvement actions"]
}}
"""

    try:

        response = model.generate_content(
            prompt
        )

        text = response.text.strip()
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text).strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {
                "summary": text,
                "strengths": [],
                "weakAreas": [],
                "questionAbility": "Not available",
                "platformRead": [],
                "nextActions": []
            }

    except Exception as e:

        return {
            "summary": f"Gemini Error: {str(e)}",
            "strengths": [],
            "weakAreas": [],
            "questionAbility": "Not available",
            "platformRead": [],
            "nextActions": []
        }
