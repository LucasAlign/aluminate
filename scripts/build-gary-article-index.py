"""Build a lightweight routing index for Gary Seibert's latest SBRA articles.

The generated file contains public PDF URLs plus a short normalized text sample
used only to choose which PDFs Gemini should read for a question. It does not
ship full article copies in the application bundle.
"""

from __future__ import annotations

import html
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen

import pdfplumber


PROFILE_URL = "https://www.422business.com/member/gary-seibert"
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "lib" / "gary-articles.generated.json"
USER_AGENT = "Aluminate Ask Gary article indexer/1.0"
ARTICLE_COUNT = 50

MONTHS = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}


def fetch(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=30) as response:
        return response.read()


def issue_date(url: str) -> tuple[int, int]:
    match = re.search(r"/(\w+)-(20\d{2})-small-business", url)
    if not match:
        return (0, 0)
    return (int(match.group(2)), MONTHS.get(match.group(1).lower(), 0))


def latest_issue_urls(profile_html: str) -> list[str]:
    hrefs = re.findall(r'href=["\']([^"\']+)["\']', profile_html, flags=re.IGNORECASE)
    issue_urls = {
        urljoin(PROFILE_URL, html.unescape(href))
        for href in hrefs
        if re.search(r"small-business-resource-association-(?:section|page)", href)
    }
    # Keep a small reserve because older publisher links occasionally go stale.
    return sorted(issue_urls, key=issue_date, reverse=True)[: ARTICLE_COUNT + 8]


def pdf_url_from_issue(issue_url: str) -> str:
    issue_html = fetch(issue_url).decode("utf-8", errors="ignore")
    hrefs = re.findall(r'href=["\']([^"\']+\.pdf(?:\?[^"\']*)?)["\']', issue_html, flags=re.IGNORECASE)
    if not hrefs:
        raise RuntimeError(f"No PDF found on {issue_url}")
    return urljoin(issue_url, html.unescape(hrefs[0]))


def article_sample(pdf_url: str) -> str:
    with pdfplumber.open(BytesIO(fetch(pdf_url))) as document:
        article_page = ""
        community_page = ""
        for page in document.pages:
            text = page.extract_text() or ""
            if not community_page and "THE SBRA COMMUNITY" in text.upper():
                community_page = text
            if re.search(r"By\s+Gary\s+Seibert", text, re.I):
                article_page = text
                break

    if not article_page:
        article_page = community_page
    normalized = re.sub(r"\s+", " ", article_page).strip()
    return normalized[:2400]


def build_record(issue_url: str) -> dict[str, str]:
    pdf_url = pdf_url_from_issue(issue_url)
    year, month = issue_date(issue_url)
    return {
        "date": f"{year:04d}-{month:02d}",
        "issueUrl": issue_url,
        "pdfUrl": pdf_url,
        "searchText": article_sample(pdf_url),
    }


def main() -> int:
    profile_html = fetch(PROFILE_URL).decode("utf-8", errors="ignore")
    issue_urls = latest_issue_urls(profile_html)
    if len(issue_urls) < ARTICLE_COUNT:
        raise RuntimeError(f"Expected {ARTICLE_COUNT} issue URLs, found {len(issue_urls)}")

    records: list[dict[str, str]] = []
    failures: list[str] = []
    with ThreadPoolExecutor(max_workers=6) as executor:
        future_to_url = {executor.submit(build_record, url): url for url in issue_urls}
        for future in as_completed(future_to_url):
            try:
                records.append(future.result())
                print(f"Indexed {len(records)} valid issues", flush=True)
            except Exception as error:  # noqa: BLE001 - report every failed public issue.
                failures.append(f"{future_to_url[future]}: {error}")

    if len(records) < ARTICLE_COUNT:
        raise RuntimeError(
            f"Only indexed {len(records)} valid issues; failures:\n" + "\n".join(failures)
        )

    records.sort(key=lambda record: record["date"], reverse=True)
    records = records[:ARTICLE_COUNT]
    OUTPUT_PATH.write_text(json.dumps(records, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(f"Indexed {len(records)} Gary/SBRA issues into {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
