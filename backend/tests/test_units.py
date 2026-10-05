"""The small pure functions: types, paths, front matter, model stream parsing, the vault."""

import json

import pytest

from backend import llm, storage, vault
from backend.config import ApiError
from backend.routes.content import parse_front_matter, slugify
from backend.routes.public import build_resume


@pytest.mark.parametrize(
    ("content_type", "data"),
    [
        ("image/png", b"\x89PNG\r\n\x1a\n" + b"\x00" * 8),
        ("image/jpeg", b"\xff\xd8\xff\xe0" + b"\x00" * 8),
        ("image/gif", b"GIF89a" + b"\x00" * 8),
        ("image/webp", b"RIFF\x24\x00\x00\x00WEBPVP8 "),
        ("image/avif", b"\x00\x00\x00\x20ftypavif\x00\x00\x00\x00"),
        ("application/pdf", b"%PDF-1.7\n"),
        ("text/markdown", "# Judul\n\nIsi, dengan é.".encode()),
    ],
)
def test_real_bytes_match_their_type(content_type, data):
    assert storage.matches_type(content_type, data)


@pytest.mark.parametrize(
    ("content_type", "data"),
    [
        ("image/png", b"<html><script>alert(1)</script>"),
        ("image/jpeg", b"\x89PNG\r\n\x1a\n"),
        ("image/webp", b"RIFF\x24\x00\x00\x00WAVEfmt "),
        ("application/pdf", b"MZ\x90\x00"),
        ("text/markdown", b"\xff\xfe\x00binary"),
        ("image/svg+xml", b"<svg></svg>"),
    ],
)
def test_lying_bytes_do_not_match(content_type, data):
    assert not storage.matches_type(content_type, data)


@pytest.mark.parametrize("path", ["/etc/passwd", "a/../b.png", "a//b.png", "", "a\\b.png", "a/\n.png"])
def test_unsafe_paths_are_refused(path):
    with pytest.raises(ApiError):
        storage.clean_path(path)


def test_folder_and_file_paths_are_told_apart():
    assert storage.clean_path("photos/2026/", folder=True) == "photos/2026/"
    with pytest.raises(ApiError):
        storage.clean_path("photos/2026/", folder=False)


def test_public_url_quotes_the_path():
    assert storage.public_url("bucket", "a b/c.png") == "https://storage.googleapis.com/bucket/a%20b/c.png"


def test_front_matter_fills_the_post_form():
    parsed = parse_front_matter(
        "---\ntitle: Hello, World\nsummary: A first post\ntags: [ai, cloud]\n---\n\n# Heading\n\nBody.\n"
    )
    assert parsed == {
        "title": "Hello, World",
        "summary": "A first post",
        "tags": ["ai", "cloud"],
        "slug": "hello-world",
        "bodyMd": "# Heading\n\nBody.\n",
    }


def test_markdown_without_front_matter_is_all_body():
    parsed = parse_front_matter("Just text.\n\n---\n\nMore.")
    assert parsed["bodyMd"] == "Just text.\n\n---\n\nMore."
    assert parsed["title"] == ""


def test_broken_front_matter_is_a_400():
    with pytest.raises(ApiError) as raised:
        parse_front_matter("---\ntitle: [unclosed\n---\nBody")
    assert raised.value.status == 400


def test_slugify_keeps_letters_and_numbers():
    assert slugify("  Déjà Vu: Part 2!  ") == "deja-vu-part-2"


@pytest.mark.parametrize("base", ["https://ollama.com", "https://ollama.com/v1", "https://ollama.com/v1/"])
def test_chat_url_accepts_either_base(base):
    assert llm.chat_url(base) == "https://ollama.com/v1/chat/completions"


def test_stream_lines_yield_only_text():
    line = "data: " + json.dumps({"choices": [{"delta": {"content": "Hi"}}]})
    assert llm.parse_fragment(line) == "Hi"
    assert llm.parse_fragment("data: [DONE]") is None
    assert llm.parse_fragment(": keep-alive") is None
    assert llm.parse_fragment('data: {"choices": []}') is None


def test_vault_describe_never_returns_a_secret(fake_db):
    vault.put("LLM_API_KEY", "sk-very-secret", "2026-01-01T00:00:00+00:00")
    vault.put("LLM_MODEL", "some-model", "2026-01-01T00:00:00+00:00")
    described = {item["name"]: item for item in vault.describe()}
    assert described["LLM_API_KEY"] == {
        "name": "LLM_API_KEY",
        "secret": True,
        "set": True,
        "value": None,
        "updatedAt": "2026-01-01T00:00:00+00:00",
    }
    assert described["LLM_MODEL"]["value"] == "some-model"
    assert "sk-very-secret" not in json.dumps(vault.describe())
    assert "sk-very-secret" not in json.dumps(fake_db.tables["credentials"])


def test_vault_defaults_apply_until_overridden(fake_db):
    vault.put("SMTP_USER", "me@example.test", "2026-01-01T00:00:00+00:00")
    loaded = vault.load()
    assert loaded["LLM_BASE_URL"] == "https://ollama.com/v1"
    assert loaded["SMTP_PORT"] == "587"
    assert loaded["CONTACT_TO"] == "me@example.test"
    assert list(loaded) == list(vault.KNOWN)


def test_vault_refuses_an_unknown_name(fake_db):
    with pytest.raises(ApiError) as raised:
        vault.put("AWS_SECRET", "x", "2026-01-01T00:00:00+00:00")
    assert raised.value.status == 404


def test_vault_refuses_a_service_account_that_is_not_one(fake_db):
    with pytest.raises(ApiError) as raised:
        vault.put("GCS_SERVICE_ACCOUNT", '{"type": "authorized_user"}', "2026-01-01T00:00:00+00:00")
    assert raised.value.status == 400


def test_resume_joins_each_role_to_its_organization():
    documents = [
        {"id": "org-1", "type": "organization", "data": {"name": "Acme", "website": "https://acme.test", "logo": None}},
        {"id": "role-1", "type": "role", "data": {"kind": "work", "organization": "org-1", "title": "Engineer"}},
        {"id": "edu-1", "type": "education", "data": {"organization": "org-1", "degree": "BSc"}},
        {"id": "p", "type": "profile", "data": {"name": "Rahfi"}},
    ]
    resume = build_resume(documents)
    assert resume["roles"] == [
        {"id": "role-1", "kind": "work", "title": "Engineer", "company": "Acme", "href": "https://acme.test", "logo": None}
    ]
    assert resume["education"][0]["school"] == "Acme"
    assert resume["profile"] == {"name": "Rahfi"}
    assert set(resume) == {"profile", "roles", "education", "achievements", "projects", "certificates", "skills"}
