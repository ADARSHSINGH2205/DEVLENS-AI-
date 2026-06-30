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


def _first_value(*values):
    for value in values:
        cleaned = _clean_text(value)
        if cleaned:
            return cleaned
    return None


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

            address = item.get("address")
            if isinstance(address, dict):
                location = address.get("addressLocality") or address.get("addressRegion") or address.get("addressCountry")
            else:
                location = address

            extracted.update({
                "name": item.get("name"),
                "headline": item.get("jobTitle") or item.get("headline") or item.get("description"),
                "image": item.get("image"),
                "location": location,
                "description": item.get("description"),
                "url": item.get("url"),
                "company": item.get("worksFor", {}).get("name") if isinstance(item.get("worksFor"), dict) else item.get("worksFor"),
                "school": item.get("alumniOf", {}).get("name") if isinstance(item.get("alumniOf"), dict) else item.get("alumniOf"),
                "occupation": item.get("occupation")
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
        _first_value(meta.get("og:title"), meta.get("twitter:title"), meta.get("title"))
    )
    description = _first_value(
        meta.get("og:description"),
        meta.get("twitter:description"),
        meta.get("description"),
        json_ld.get("description")
    )
    canonical_url = _first_value(
        meta.get("og:url"),
        meta.get("twitter:url"),
        json_ld.get("url"),
        profile_url
    )
    image = _first_value(
        json_ld.get("image"),
        meta.get("og:image:secure_url"),
        meta.get("og:image"),
        meta.get("twitter:image")
    )
    headline = _first_value(
        json_ld.get("headline"),
        title_headline,
        description
    )
    occupation = _first_value(
        json_ld.get("occupation"),
        headline
    )
    company = _first_value(json_ld.get("company"))
    school = _first_value(json_ld.get("school"))
    location = _first_value(json_ld.get("location"))
    site_name = _first_value(meta.get("og:site_name"), meta.get("application-name"))

    available_field_map = {
        "name": name or json_ld.get("name"),
        "headline": headline,
        "description": description,
        "profilePicture": image,
        "location": location,
        "publicUrl": canonical_url,
        "siteName": site_name,
        "occupation": occupation,
        "company": company,
        "school": school,
        "title": _first_value(meta.get("og:title"), meta.get("twitter:title"), meta.get("title")),
        "summary": _first_value(meta.get("og:description"), meta.get("twitter:description"), meta.get("description"))
    }

    return {
        "profile_url": profile_url,
        "statusCode": response.status_code,
        "name": available_field_map["name"],
        "headline": headline,
        "description": description,
        "profilePicture": image,
        "location": location,
        "publicUrl": canonical_url,
        "siteName": site_name,
        "occupation": occupation,
        "company": company,
        "school": school,
        "title": available_field_map["title"],
        "summary": available_field_map["summary"],
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
