"""What both sites render: the public config, published content, and the GitHub summary.

Content is read with the anon key, so row-level security still decides what a stranger sees.
"""

import os
import re

import httpx
from fastapi import APIRouter, Response

from backend import db
from backend.config import ApiError, env, log
from backend.routes.content import check_type

router = APIRouter(prefix="/api")

GITHUB_USER = "rahfianugerah"
POST_COLUMNS = "slug,title,summary,cover_url,published_at"
NO_POST = ApiError(404, "There is no published post with that slug.")


def cache_for(response: Response, seconds: int) -> None:
    """Let the edge serve this for `seconds`, then a stale copy while it refetches."""
    response.headers["Cache-Control"] = (
        f"public, max-age=0, s-maxage={seconds}, stale-while-revalidate=300"
    )


@router.get("/public/config")
def public_config(response: Response) -> dict:
    cache_for(response, 60)
    # A reCAPTCHA site key is public by design: it is written into the page.
    return {"recaptchaSiteKey": os.environ.get("RECAPTCHA_SITE_KEY", "").strip() or None}


@router.get("/public/documents")
def public_documents(type: str, response: Response) -> list[dict]:
    types = [name.strip() for name in type.split(",") if name.strip()]
    if not types:
        raise ApiError(400, "That is not a type of document.")
    for name in types:
        check_type(name)
    rows = db.select(
        "documents",
        {
            "select": "id,type,data,sort_order",
            "type": f"in.({','.join(types)})",
            "order": "sort_order.asc,created_at.asc",
        },
        anon=True,
    )
    cache_for(response, 60)
    return rows


@router.get("/public/posts")
def public_posts(response: Response) -> list[dict]:
    # The policy already hides drafts from the anon key; the filter says so here as well.
    rows = db.select(
        "posts",
        {"select": POST_COLUMNS, "published": "eq.true", "order": "published_at.desc"},
        anon=True,
    )
    cache_for(response, 60)
    return rows


@router.get("/public/posts/{slug}")
def public_post(slug: str, response: Response) -> dict:
    # A post written here has a slug of lowercase letters, digits and hyphens, but one imported
    # from Sanity keeps the slug it was published under, so its links still work, and that can
    # hold other characters. Only the length is bounded; httpx encodes the value as a query
    # parameter, and eq. compares it literally.
    if not 1 <= len(slug) <= 200:
        raise NO_POST
    rows = db.select(
        "posts",
        {"select": f"{POST_COLUMNS},body_md", "slug": f"eq.{slug}", "published": "eq.true", "limit": 1},
        anon=True,
    )
    if not rows:
        raise NO_POST
    cache_for(response, 60)
    return rows[0]


@router.get("/github/stats")
def github_stats(response: Response) -> dict:
    headers = {"Authorization": f"token {env('GITHUB_TOKEN')}"}
    base = f"https://api.github.com/users/{GITHUB_USER}"
    try:
        user = httpx.get(base, headers=headers, timeout=10)
        repos = httpx.get(
            f"{base}/repos",
            params={"sort": "updated", "direction": "desc", "per_page": 5},
            headers=headers,
            timeout=10,
        )
    except httpx.HTTPError as error:
        log.error("GitHub could not be reached: %r", error)
        raise ApiError(502, "GitHub could not be reached.") from error
    if user.is_error or repos.is_error:
        log.error("GitHub answered %s and %s", user.status_code, repos.status_code)
        raise ApiError(502, "GitHub could not be reached.")

    profile = user.json()
    cache_for(response, 3600)
    # public_repos is repeated at the top level because the projects counter reads it there.
    return {"user": profile, "repos": repos.json(), "public_repos": profile.get("public_repos")}
