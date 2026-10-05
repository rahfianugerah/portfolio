import json
import re

import pytest
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient

from backend import auth, crypto, llm, mail, vault
from backend.main import app
from backend.routes import account, content, files, public
from backend.tests.conftest import ORIGIN

client = TestClient(app)

OPEN_STUDIO_PATHS = {"/api/studio/login", "/api/studio/password/otp", "/api/studio/password/reset"}
SOME_ID = "00000000-0000-0000-0000-000000000000"


def protected_studio_routes() -> list[tuple[str, str]]:
    found = []
    for router in (public.router, account.open_router, account.router, files.router, content.router):
        for route in router.routes:
            if route.path.startswith("/api/studio") and route.path not in OPEN_STUDIO_PATHS:
                found += [(method, route.path) for method in route.methods - {"HEAD", "OPTIONS"}]
    return sorted(found)


def sign_in(fake_db) -> None:
    """Put a live session in the fake database and its cookie on the client."""
    fake_db.insert("studio_owner", {"id": "owner-1", "email": "owner@example.test", "password_blob": None})
    token = "a-session-token"
    fake_db.insert(
        "studio_sessions",
        {
            "owner_id": "owner-1",
            "token_hash": crypto.sha256_hex(token),
            "expires_at": "2999-01-01T00:00:00+00:00",
        },
    )
    client.cookies.set(auth.COOKIE, token)


@pytest.fixture(autouse=True)
def signed_out():
    client.cookies.clear()


def test_health():
    response = client.get("/api/health")
    assert (response.status_code, response.json()) == (200, {"status": "ok"})


def test_interactive_docs_are_off():
    assert client.get("/docs").status_code == 404
    assert client.get("/openapi.json").status_code == 404
    assert client.get("/openapi.json").json() == {"error": "Not Found"}


def test_there_are_protected_routes_to_check():
    assert len(protected_studio_routes()) == 24


@pytest.mark.parametrize(("method", "path"), protected_studio_routes())
def test_studio_route_needs_a_session(fake_db, method, path):
    url = re.sub(r"\{[^}]+\}", SOME_ID, path)
    response = client.request(method, url, headers={"Origin": ORIGIN})
    assert response.status_code == 401
    assert response.json() == {"error": "Sign in to continue."}


def test_a_revoked_session_is_signed_out(fake_db):
    sign_in(fake_db)
    fake_db.update("studio_sessions", {}, {"revoked_at": "2026-01-01T00:00:00+00:00"})
    assert client.get("/api/studio/me").status_code == 401


def test_an_expired_session_is_signed_out(fake_db):
    sign_in(fake_db)
    fake_db.update("studio_sessions", {}, {"expires_at": "2020-01-01T00:00:00+00:00"})
    assert client.get("/api/studio/me").status_code == 401


def test_me_reports_whether_a_password_is_set(fake_db):
    sign_in(fake_db)
    assert client.get("/api/studio/me").json() == {"authenticated": True, "passwordSet": False}


def test_a_write_from_another_origin_is_refused(fake_db):
    sign_in(fake_db)
    response = client.post("/api/studio/logout", headers={"Origin": "https://evil.test"})
    assert response.status_code == 403
    assert client.post("/api/studio/logout").status_code == 403


def test_logout_revokes_the_session_and_clears_the_cookie(fake_db):
    sign_in(fake_db)
    response = client.post("/api/studio/logout", headers={"Origin": ORIGIN})
    assert response.status_code == 204
    assert fake_db.tables["studio_sessions"][0]["revoked_at"]
    assert 'studio_session="";' in response.headers["set-cookie"]


def test_login_sets_a_hardened_cookie(fake_db, monkeypatch):
    monkeypatch.setattr(auth, "login", lambda email, password: "token-value")
    response = client.post("/api/studio/login", json={"email": "a@b.test", "password": "x"})
    cookie = response.headers["set-cookie"]
    assert response.status_code == 204
    assert "studio_session=token-value" in cookie
    assert "HttpOnly" in cookie and "SameSite=lax" in cookie and "Path=/" in cookie
    assert "Max-Age=43200" in cookie
    # Local development has no VERCEL_ENV and no TLS.
    assert "Secure" not in cookie


def test_cookie_is_secure_when_deployed(fake_db, monkeypatch):
    monkeypatch.setenv("VERCEL_ENV", "production")
    monkeypatch.setattr(auth, "login", lambda email, password: "token-value")
    response = client.post("/api/studio/login", json={"email": "a@b.test", "password": "x"})
    assert "Secure" in response.headers["set-cookie"]


def test_failed_login_is_one_fixed_reply(fake_db):
    response = client.post("/api/studio/login", json={"email": "a@b.test", "password": "x"})
    assert (response.status_code, response.json()) == (401, {"error": "Invalid email or password."})


def test_otp_reply_is_the_same_with_no_owner(fake_db):
    response = client.post("/api/studio/password/otp")
    assert response.status_code == 202
    assert response.json() == {"message": "If an owner account exists, a code was sent to its email."}


def test_rate_limit_spent_is_429_and_hashes_the_ip(fake_db):
    fake_db.is_allowed = False
    response = client.post("/api/studio/password/otp", headers={"x-forwarded-for": "203.0.113.9, 10.0.0.1"})
    assert response.status_code == 429
    [call] = fake_db.rate_limit_calls
    assert call["p_key_hash"] == crypto.sha256_hex("203.0.113.9")
    assert (call["p_bucket"], call["p_limit"]) == ("otp", 3)


def test_rate_limit_fails_closed(fake_db, monkeypatch):
    def broken(function, arguments):
        raise LookupError("no rows")

    monkeypatch.setattr("backend.db.rpc", broken)
    response = client.post("/api/assistant/chat", json={"message": "Hi"})
    assert response.status_code == 503


def test_credentials_api_never_returns_a_secret(fake_db):
    sign_in(fake_db)
    put = client.put(
        "/api/studio/credentials/LLM_API_KEY", json={"value": "sk-very-secret"}, headers={"Origin": ORIGIN}
    )
    assert put.status_code == 204
    listed = client.get("/api/studio/credentials")
    assert "sk-very-secret" not in listed.text
    assert [item["name"] for item in listed.json()] == list(vault.KNOWN)
    assert listed.json()[0] == {
        "name": "LLM_API_KEY",
        "secret": True,
        "set": True,
        "value": None,
        "updatedAt": listed.json()[0]["updatedAt"],
    }


def test_unknown_credential_is_404(fake_db):
    sign_in(fake_db)
    response = client.put("/api/studio/credentials/NOPE", json={"value": "x"}, headers={"Origin": ORIGIN})
    assert response.status_code == 404


def test_the_model_proxy_is_gone(fake_db):
    body = {"messages": [{"role": "user", "content": "Hi"}], "client_ip": "203.0.113.9"}
    response = client.post("/api/llm/chat", json=body, headers={"x-service-key": "anything"})
    assert (response.status_code, response.json()) == (404, {"error": "Not Found"})


def test_cors_allows_only_the_content_type_header():
    [cors] = [middleware for middleware in app.user_middleware if middleware.cls is CORSMiddleware]
    assert cors.kwargs["allow_headers"] == ["Content-Type"]
    assert cors.kwargs["allow_credentials"] is True
    assert cors.kwargs["allow_methods"] == ["GET", "POST", "PUT", "DELETE"]


def test_a_stated_client_ip_is_not_believed(fake_db):
    fake_db.is_allowed = False
    headers = {"x-client-ip": "203.0.113.7", "x-service-key": "anything", "x-forwarded-for": "198.51.100.1"}
    client.post("/api/assistant/chat", json={"message": "Hi"}, headers=headers)
    assert fake_db.rate_limit_calls[0]["p_key_hash"] == crypto.sha256_hex("198.51.100.1")


def test_zoey_is_told_the_brief_and_nothing_else(fake_db, monkeypatch):
    fake_db.insert("documents", {"type": "consultingService", "data": {"title": "Audit", "body": "B", "icon": "zap"}})
    fake_db.insert("documents", {"type": "pricingTier", "data": {"name": "Sprint", "price": "$8,000"}})
    fake_db.insert("documents", {"type": "clientProject", "data": {"client": "Acme", "image": "https://x.test/a.png"}})
    fake_db.insert("documents", {"type": "profile", "data": {"name": "not for Zoey"}})
    seen = {}

    def fake_stream(messages):
        seen["messages"] = messages
        return iter(["Good ", "evening"])

    monkeypatch.setattr(llm, "stream_chat", fake_stream)
    history = [{"role": "assistant", "content": "y" * 5000}] * 20
    response = client.post("/api/consulting/chat", json={"message": "I need an audit", "history": history})
    assert (response.status_code, response.text) == (200, "Good evening")
    assert response.headers["content-type"] == "text/plain; charset=utf-8"
    system, *turns, question = seen["messages"]
    prompt, brief = system["content"].split("\n\nBrief: ")
    assert prompt.startswith("You are Zoey, the butler of Rahfi Consulting")
    assert prompt.endswith("   contact form is where anything becomes real.")
    assert json.loads(brief) == {
        "services": [{"title": "Audit", "body": "B"}],
        "principles": [],
        "process": [],
        "pricing": [{"name": "Sprint", "price": "$8,000"}],
        "engagements": [{"client": "Acme"}],
    }
    assert len(turns) == 12 and len(turns[0]["content"]) == 4000
    assert question == {"role": "user", "content": "I need an audit"}
    [limit] = fake_db.rate_limit_calls
    assert (limit["p_bucket"], limit["p_limit"]) == ("consulting", 20)


@pytest.mark.parametrize("body", [{"message": "   "}, {"message": "x" * 1001}, {}])
def test_zoey_bad_input_is_400(fake_db, body):
    response = client.post("/api/consulting/chat", json=body)
    assert response.status_code == 400
    assert set(response.json()) == {"error"}
    assert not fake_db.rate_limit_calls


def test_assistant_streams_plain_text_built_from_documents(fake_db, monkeypatch):
    fake_db.insert("documents", {"type": "profile", "data": {"name": "Rahfi"}})
    fake_db.insert("documents", {"type": "quote", "data": {"text": "not for Ashley"}})
    seen = {}

    def fake_stream(messages):
        seen["messages"] = messages
        return iter(["Hel", "lo"])

    monkeypatch.setattr(llm, "stream_chat", fake_stream)
    history = [{"role": "user", "content": "x" * 5000}] * 20
    response = client.post("/api/assistant/chat", json={"message": " Who is he? ", "history": history})
    assert (response.status_code, response.text) == (200, "Hello")
    assert response.headers["content-type"] == "text/plain; charset=utf-8"
    assert response.headers["cache-control"] == "no-store"
    assert response.headers["x-accel-buffering"] == "no"
    system, *turns, question = seen["messages"]
    assert system["content"].startswith("You are Ashley")
    assert '"name": "Rahfi"' in system["content"] and "not for Ashley" not in system["content"]
    assert len(turns) == 12 and len(turns[0]["content"]) == 4000
    assert question == {"role": "user", "content": "Who is he?"}


def test_assistant_failure_before_the_first_word_is_502(fake_db, monkeypatch):
    def refused(messages):
        raise RuntimeError("The model endpoint answered 401")
        yield

    monkeypatch.setattr(llm, "stream_chat", refused)
    response = client.post("/api/assistant/chat", json={"message": "Hi"})
    assert response.status_code == 502
    assert "401" not in response.text


def test_assistant_without_a_key_is_503(fake_db):
    assert client.post("/api/assistant/chat", json={"message": "Hi"}).status_code == 503


@pytest.mark.parametrize("body", [{"message": "   "}, {"message": "x" * 1001}, {}, {"message": "Hi", "history": "no"}])
def test_assistant_bad_input_is_400(fake_db, body):
    response = client.post("/api/assistant/chat", json=body)
    assert response.status_code == 400
    assert set(response.json()) == {"error"}
    assert not fake_db.rate_limit_calls


CONTACT = {
    "fullName": "Ada Lovelace",
    "email": "ada@example.test",
    "subject": "A question",
    "message": "Hello there, <b>this</b> is long enough.",
}


def test_contact_sends_an_escaped_message(fake_db, monkeypatch):
    sent = {}
    monkeypatch.setattr(mail, "send", lambda subject, text, **kwargs: sent.update(subject=subject, **kwargs))
    response = client.post("/api/contact", json=CONTACT)
    assert response.status_code == 200
    assert response.json() == {"success": "Message sent successfully! I'll get back to you soon."}
    assert sent["subject"] == "Portfolio Contact: A question"
    assert sent["reply_to"] == "ada@example.test"
    assert "&lt;b&gt;this&lt;/b&gt;" in sent["html"] and "<b>this</b>" not in sent["html"]
    assert (fake_db.rate_limit_calls[0]["p_bucket"], fake_db.rate_limit_calls[0]["p_limit"]) == ("contact", 3)


@pytest.mark.parametrize(
    ("change", "message"),
    [
        ({"honeypot": "filled"}, "Invalid submission"),
        ({"fullName": "A"}, "Name must be at least 2 characters"),
        ({"fullName": "R2-D2 <x>"}, "Name contains invalid characters"),
        ({"email": "not-an-email"}, "Please enter a valid email address"),
        ({"subject": "Hey"}, "Subject must be at least 5 characters"),
        ({"message": "short"}, "Message must be at least 10 characters"),
    ],
)
def test_contact_validation(fake_db, monkeypatch, change, message):
    monkeypatch.setattr(mail, "send", lambda *args, **kwargs: pytest.fail("mail was sent"))
    response = client.post("/api/contact", json={**CONTACT, **change})
    assert (response.status_code, response.json()) == (400, {"error": message})


def test_contact_without_mail_settings_is_503(fake_db, monkeypatch):
    monkeypatch.delenv("GMAIL_USER", raising=False)
    monkeypatch.delenv("GMAIL_APP_PASSWORD", raising=False)
    assert client.post("/api/contact", json=CONTACT).status_code == 503


def test_post_lifecycle(fake_db):
    sign_in(fake_db)
    headers = {"Origin": ORIGIN}
    created = client.post("/api/studio/posts", json={"title": "Hello World", "bodyMd": "Text"}, headers=headers)
    post = created.json()
    assert created.status_code == 201
    assert (post["slug"], post["published"], post["publishedAt"]) == ("hello-world", False, None)

    published = client.put(f"/api/studio/posts/{post['id']}", json={"published": True}, headers=headers).json()
    assert published["publishedAt"] and published["bodyMd"] == "Text"

    client.put(f"/api/studio/posts/{post['id']}", json={"published": False}, headers=headers)
    again = client.put(f"/api/studio/posts/{post['id']}", json={"published": True}, headers=headers).json()
    assert again["publishedAt"] == published["publishedAt"]

    assert "bodyMd" not in client.get("/api/studio/posts").json()[0]


@pytest.mark.parametrize("document_type", ["consultingService", "principle", "processStep", "pricingTier"])
def test_consulting_document_types_are_accepted(fake_db, document_type):
    sign_in(fake_db)
    response = client.post(
        "/api/studio/documents", json={"type": document_type, "data": {"title": "T"}}, headers={"Origin": ORIGIN}
    )
    assert response.status_code == 201


def test_document_type_must_be_known(fake_db):
    sign_in(fake_db)
    response = client.post("/api/studio/documents", json={"type": "nope", "data": {}}, headers={"Origin": ORIGIN})
    assert response.status_code == 400
    created = client.post(
        "/api/studio/documents", json={"type": "quote", "data": {"text": "Hi"}, "sortOrder": 3}, headers={"Origin": ORIGIN}
    )
    assert created.status_code == 201
    assert created.json()["sortOrder"] == 3
