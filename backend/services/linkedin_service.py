import json
import re
from html import unescape
from html.parser import HTMLParser
from urllib.parse import urlparse

import requests


class LinkedInMetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.json_ld = []
        self._in_json_ld = False
        self._json_buffer = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)

        if tag == "meta":
            key = attrs.get("property") or attrs.get("name")
            content = attrs.get("content")

            if key and content:
                self.meta[key] = unescape(content.strip())

        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._in_json_ld = True
            self._json_buffer = []

    def handle_data(self, data):
        if self._in_json_ld:
            self._json_buffer.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._in_json_ld:
            self._in_json_ld = False
            raw_json = "".join(self._json_buffer).strip()

            if raw_json:
                self.json_ld.append(raw_json)


def _clean_text(value):
    if not value:
        return None

    return re.sub(r"\s+", " ", unescape(str(value))).strip() or None


def _split_title(title):
    title = _clean_text(title)

    if not title:
        return None, None

    title = re.sub(r"\s*\|\s*LinkedIn\s*$", "", title, flags=re.I)
    parts = [part.strip() for part in title.split(" - ", 1)]

    if len(parts) == 2:
        return parts[0], parts[1]

    return title, None


def _extract_json_ld(parser):
    extracted = {}

    for raw_json in parser.json_ld:
        try:
            payload = json.loads(raw_json)
        except json.JSONDecodeError:
            continue

        items = payload if isinstance(payload, list) else [payload]

        for item in items:
            if not isinstance(item, dict):
                continue

            extracted.update({
                "name": item.get("name"),
                "headline": item.get("jobTitle") or item.get("description"),
                "image": item.get("image"),
                "location": item.get("address", {}).get("addressLocality")
                if isinstance(item.get("address"), dict)
                else item.get("address")
            })

    return {
        key: _clean_text(value)
        for key, value in extracted.items()
        if _clean_text(value)
    }


def get_linkedin_data(profile_url):
    parsed = urlparse(profile_url)

    if "linkedin.com" not in parsed.netloc.lower():
        return {
            "profile_url": profile_url,
            "error": "Enter a valid LinkedIn profile URL"
        }

    try:
        response = requests.get(
            profile_url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/126.0 Safari/537.36"
                )
            },
            timeout=12
        )
    except Exception as e:
        return {
            "profile_url": profile_url,
            "error": str(e)
        }

    parser = LinkedInMetaParser()
    parser.feed(response.text)

    meta = parser.meta
    json_ld = _extract_json_ld(parser)
    name, title_headline = _split_title(
        meta.get("og:title") or meta.get("title")
    )
    description = _clean_text(
        meta.get("og:description") or meta.get("description")
    )

    headline = (
        json_ld.get("headline")
        or title_headline
        or description
    )
    image = (
        json_ld.get("image")
        or meta.get("og:image")
        or meta.get("twitter:image")
    )
    available_field_map = {
        "name": json_ld.get("name") or name,
        "headline": headline,
        "description": description,
        "profilePicture": image,
        "location": json_ld.get("location"),
        "publicUrl": meta.get("og:url") or profile_url
    }

    return {
        "profile_url": profile_url,
        "statusCode": response.status_code,
        "name": available_field_map["name"],
        "headline": headline,
        "description": description,
        "profilePicture": image,
        "location": available_field_map["location"],
        "publicUrl": available_field_map["publicUrl"],
        "availableFields": [
            key
            for key, value in available_field_map.items()
            if value
        ],
        "visibilityNote": (
            "LinkedIn usually hides experience, education, skills, and posts "
            "unless the viewer is authenticated or an official API integration is used."
        )
    }
