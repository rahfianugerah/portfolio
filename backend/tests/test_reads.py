"""The public reads both sites render from, the visitor counts, and the consulting seed."""

import re
from datetime import timedelta
from pathlib import Path

import httpx
import pytest
from fastapi.testclient import TestClient

from backend import db
from backend.config import ApiError
from backend.main import app
from backend.routes.analytics import utc_today

client = TestClient(app)

PUBLIC_CACHE = "public, max-age=0, s-maxage=60, stale-while-revalidate=300"
SEED = Path(__file__).resolve().parents[2] / "supabase" / "migrations" / "0004_consulting_copy.sql"


def test_config_gives_the_site_key(fake_db, monkeypatch):
    monkeypatch.setenv("RECAPTCHA_SITE_KEY", "site-key")
    response = client.get("/api/public/config")
    assert response.json() == {"recaptchaSiteKey": "site-key"}
    assert response.headers["cache-control"] == PUBLIC_CACHE
    monkeypatch.delenv("RECAPTCHA_SITE_KEY")
    assert client.get("/api/public/config").json() == {"recaptchaSiteKey": None}


def test_documents_are_read_with_the_anon_key(fake_db):
    fake_db.insert("documents", {"type": "principle", "data": {"title": "P"}, "sort_order": 10})
    fake_db.insert("documents", {"type": "processStep", "data": {"step": "01"}, "sort_order": 10})
    fake_db.insert("documents", {"type": "profile", "data": {"name": "not asked for"}})
    response = client.get("/api/public/documents?type=principle,processStep")
    assert response.status_code == 200
    assert [(row["type"], row["data"], row["sort_order"]) for row in response.json()] == [
        ("principle", {"title": "P"}, 10),
        ("processStep", {"step": "01"}, 10),
    ]
    assert set(response.json()[0]) == {"id", "type", "data", "sort_order"}
    assert response.headers["cache-control"] == PUBLIC_CACHE
    assert fake_db.anon_tables == ["documents"]


@pytest.mark.parametrize("query", ["?type=principle,nope", "?type=,", ""])
def test_documents_need_known_types(fake_db, query):
    response = client.get(f"/api/public/documents{query}")
    assert response.status_code == 400
    assert set(response.json()) == {"error"}
    assert "cache-control" not in response.headers


def add_post(fake_db, slug: str, published: bool, published_at: str | None) -> None:
    fake_db.insert(
        "posts",
        {"slug": slug, "title": slug.title(), "body_md": f"# {slug}", "published": published, "published_at": published_at},
    )


def test_posts_list_only_published_newest_first(fake_db):
    add_post(fake_db, "older", True, "2026-01-01T00:00:00+00:00")
    add_post(fake_db, "draft", False, None)
    add_post(fake_db, "newer", True, "2026-02-01T00:00:00+00:00")
    response = client.get("/api/public/posts")
    assert [post["slug"] for post in response.json()] == ["newer", "older"]
    assert set(response.json()[0]) == {"slug", "title", "summary", "cover_url", "published_at"}
    assert response.headers["cache-control"] == PUBLIC_CACHE
    assert fake_db.anon_tables == ["posts"]


def test_one_post_carries_its_body(fake_db):
    add_post(fake_db, "hello", True, "2026-01-01T00:00:00+00:00")
    response = client.get("/api/public/posts/hello")
    assert response.json()["body_md"] == "# hello"
    assert set(response.json()) == {"slug", "title", "summary", "cover_url", "published_at", "body_md"}
    assert response.headers["cache-control"] == PUBLIC_CACHE
    assert fake_db.anon_tables == ["posts"]


@pytest.mark.parametrize("slug", ["draft", "missing", "Not%20A%20Slug"])
def test_a_draft_or_missing_post_is_404(fake_db, slug):
    add_post(fake_db, "draft", False, None)
    response = client.get(f"/api/public/posts/{slug}")
    assert (response.status_code, response.json()) == (404, {"error": "There is no published post with that slug."})


def fake_github(monkeypatch, status: int = 200) -> list[str]:
    asked = []

    def get(url, **kwargs):
        asked.append(url)
        body = {"login": "rahfianugerah", "public_repos": 30} if url.endswith("rahfianugerah") else [{"name": "r"}]
        return httpx.Response(status, json=body)

    monkeypatch.setenv("GITHUB_TOKEN", "token-for-tests")
    monkeypatch.setattr(httpx, "get", get)
    return asked


def test_github_stats_keep_their_shape(fake_db, monkeypatch):
    asked = fake_github(monkeypatch)
    response = client.get("/api/github/stats")
    assert response.json() == {
        "user": {"login": "rahfianugerah", "public_repos": 30},
        "repos": [{"name": "r"}],
        "public_repos": 30,
    }
    assert response.headers["cache-control"] == "public, max-age=0, s-maxage=3600, stale-while-revalidate=300"
    assert asked == ["https://api.github.com/users/rahfianugerah", "https://api.github.com/users/rahfianugerah/repos"]


def test_github_failure_is_502(fake_db, monkeypatch):
    fake_github(monkeypatch, status=500)
    response = client.get("/api/github/stats")
    assert (response.status_code, response.json()) == (502, {"error": "GitHub could not be reached."})


def test_unreachable_github_is_502(fake_db, monkeypatch):
    monkeypatch.setenv("GITHUB_TOKEN", "token-for-tests")

    def down(url, **kwargs):
        raise httpx.ConnectError("down")

    monkeypatch.setattr(httpx, "get", down)
    assert client.get("/api/github/stats").status_code == 502


def day(offset: int) -> str:
    return (utc_today() - timedelta(days=offset)).isoformat()


def seed_counts(fake_db) -> None:
    fake_db.insert("counters", {"name": "visitors", "value": 500})
    fake_db.insert("counters", {"name": "project_views", "value": 90})
    for offset, visits in [(30, 100), (6, 1), (1, 2), (0, 3)]:
        fake_db.insert("daily_stats", {"date": day(offset), "counter_type": "visits", "visits": visits})
    for offset, views in [(30, 50), (2, 4)]:
        fake_db.insert("daily_stats", {"date": day(offset), "counter_type": "project_views", "visits": views})


def test_analytics_summary(fake_db):
    seed_counts(fake_db)
    response = client.get("/api/analytics")
    assert response.json() == {
        "success": True,
        "data": {"visitors": 106, "projects": 54, "delta24h": 3, "delta7d": 4, "sparkline": [1, 0, 0, 0, 0, 2, 3]},
    }
    assert response.headers["cache-control"] == "no-store"
    assert set(fake_db.anon_tables) == {"daily_stats"}
    assert not fake_db.rate_limit_calls


def test_a_session_is_counted_once(fake_db):
    seed_counts(fake_db)
    first = client.get("/api/analytics?action=visit&session=tab-1").json()["data"]
    assert (first["visitors"], first["delta24h"], first["sparkline"][-1]) == (501, 4, 4)
    again = client.get("/api/analytics?action=visit&session=tab-1").json()["data"]
    assert (again["delta24h"], again["sparkline"][-1]) == (4, 4)
    assert [call["p_bucket"] for call in fake_db.rate_limit_calls] == ["analytics", "analytics"]
    assert fake_db.rate_limit_calls[0]["p_limit"] == 60
    assert set(fake_db.anon_tables) == {"sessions", "counters", "daily_stats"}


def test_a_first_visit_of_the_day_starts_a_row(fake_db):
    fake_db.insert("counters", {"name": "visitors", "value": 0})
    data = client.get("/api/analytics?action=visit&session=tab-1").json()["data"]
    assert (data["visitors"], data["delta24h"]) == (1, 1)


def test_a_visit_without_a_session_counts_nothing(fake_db):
    seed_counts(fake_db)
    assert client.get("/api/analytics?action=visit").json()["data"]["delta24h"] == 3
    assert not fake_db.rate_limit_calls


def test_analytics_failure_shape(fake_db, monkeypatch):
    def refused(*args, **kwargs):
        raise ApiError(502, "The database refused the request.")

    monkeypatch.setattr(db, "select", refused)
    response = client.get("/api/analytics")
    assert response.status_code == 500
    assert response.json() == {"success": False, "error": "Failed to fetch analytics", "fallbackMessage": "Data Unavailable"}
    assert response.headers["cache-control"] == "no-store"


def test_a_project_click_is_counted(fake_db):
    seed_counts(fake_db)
    response = client.post("/api/analytics", json={"type": "project-click"})
    assert response.json() == {"success": True, "data": {"visitors": 0, "projects": 91}}
    assert client.get("/api/analytics").json()["data"]["delta7d"] == 4 + 1
    assert fake_db.rate_limit_calls[0]["p_bucket"] == "analytics"


def test_another_event_is_acknowledged_and_ignored(fake_db):
    assert client.post("/api/analytics", json={"type": "other"}).json() == {"success": True}
    assert not fake_db.anon_tables and not fake_db.rate_limit_calls


def test_a_failed_click_has_the_old_failure_shape(fake_db, monkeypatch):
    def refused(*args, **kwargs):
        raise httpx.ConnectError("down")

    monkeypatch.setattr(db, "select", refused)
    response = client.post("/api/analytics", json={"type": "project-click"})
    assert (response.status_code, response.json()) == (500, {"success": False, "error": "Failed to update analytics"})


def seed_statements() -> list[str]:
    without_comments = re.sub(r"--[^\n]*", "", SEED.read_text(encoding="utf-8"))
    return [statement.strip() for statement in without_comments.split(";") if statement.strip()]


def test_the_consulting_seed_never_overwrites():
    statements = seed_statements()
    assert len(statements) == 4
    for statement in statements:
        assert statement.startswith("insert into public.documents (type, data, sort_order)")
        inserted = re.search(r"^select '(\w+)'", statement, re.MULTILINE).group(1)
        guard = re.search(r"where not exists \(select 1 from public\.documents where type = '(\w+)'\)$", statement)
        assert guard and guard.group(1) == inserted


def test_the_consulting_seed_holds_the_current_copy():
    rows = {re.search(r"^select '(\w+)'", s, re.MULTILINE).group(1): s.count("jsonb_build_object(") for s in seed_statements()}
    assert rows == {"consultingService": 6, "principle": 4, "processStep": 4, "pricingTier": 9}
    text = SEED.read_text(encoding="utf-8")
    assert text.count("'recommended', true") == 1 and text.count("'recommended', false") == 8
    assert set(re.findall(r"'icon', '(\w+)'", text)) == {"code", "zap", "brain", "chart", "database", "cloud"}


def test_an_imported_slug_outside_the_new_alphabet_still_resolves(fake_db):
    # Sanity published this post under its own slug, and its old links must keep working.
    add_post(fake_db, "whats_new.v2", True, "2026-01-01T00:00:00+00:00")
    response = client.get("/api/public/posts/whats_new.v2")
    assert (response.status_code, response.json()["body_md"]) == (200, "# whats_new.v2")
