import json
from pathlib import Path

from backend import sanity_import
from backend.sanity_import import derived_id, map_document, portable_text_to_markdown

FIXTURE = Path(__file__).parent / "fixtures" / "sanity_export.ndjson"


def fake_asset_url(ref: str) -> str:
    return sanity_import.cdn_url(ref, "proj", "production")


def fixture_documents() -> list[dict]:
    lines = FIXTURE.read_text(encoding="utf-8").splitlines()
    return [json.loads(line) for line in lines if line.strip()]


def test_every_exported_document_maps():
    documents = fixture_documents()
    assert documents
    for document in documents:
        table, row = map_document(document, fake_asset_url)
        assert table == "documents"
        assert row["id"] == derived_id(document["_id"])
        assert set(row["data"]) == set(sanity_import.SHAPES[document["_type"]])
        # Nothing of Sanity's own bookkeeping survives into the stored data.
        assert '"_' not in json.dumps(row["data"])


def test_a_role_points_at_its_imported_organization():
    documents = fixture_documents()
    organization_ids = {
        map_document(d, fake_asset_url)[1]["id"] for d in documents if d["_type"] == "organization"
    }
    roles = [map_document(d, fake_asset_url)[1] for d in documents if d["_type"] == "role"]
    assert roles
    assert all(role["data"]["organization"] in organization_ids for role in roles)


def test_order_becomes_sort_order_and_slug_becomes_text():
    document = next(d for d in fixture_documents() if d["_type"] == "project")
    _, row = map_document(document, fake_asset_url)
    assert row["sort_order"] == document["order"]
    assert row["data"]["slug"] == document["slug"]["current"]
    assert "order" not in row["data"]


def test_an_image_becomes_a_url():
    document = next(d for d in fixture_documents() if d.get("logo"))
    _, row = map_document(document, fake_asset_url)
    assert row["data"]["logo"].startswith("https://cdn.sanity.io/images/proj/production/")


def test_asset_references_become_cdn_urls():
    assert (
        sanity_import.cdn_url("image-abc123-300x200-png", "proj", "production")
        == "https://cdn.sanity.io/images/proj/production/abc123-300x200.png"
    )
    assert (
        sanity_import.cdn_url("file-abc123-pdf", "proj", "production")
        == "https://cdn.sanity.io/files/proj/production/abc123.pdf"
    )


def test_project_image_falls_back_and_certificate_file_is_renamed():
    _, project = map_document(
        {"_id": "p", "_type": "project", "imageUrl": "https://example.test/a.png"}, fake_asset_url
    )
    assert project["data"]["image"] == "https://example.test/a.png"
    _, certificate = map_document(
        {"_id": "c", "_type": "certificate", "file": {"_type": "file", "asset": {"_ref": "file-abc-pdf"}}},
        fake_asset_url,
    )
    assert certificate["data"]["fileUrl"] == "https://cdn.sanity.io/files/proj/production/abc.pdf"
    assert certificate["data"]["kind"] == "professional"


def span(text: str, *marks: str) -> dict:
    return {"_type": "span", "text": text, "marks": list(marks)}


def block(*children: dict, **extra) -> dict:
    return {"_type": "block", "style": "normal", "children": list(children), "markDefs": [], **extra}


def test_portable_text_becomes_markdown():
    blocks = [
        block(span("Title"), style="h2"),
        block(
            span("Plain, "),
            span("bold ", "strong"),
            span("and "),
            span("italic", "em"),
            span(" and "),
            span("code", "code"),
            span(" and "),
            span("a link", "k1"),
            span("."),
            markDefs=[{"_key": "k1", "_type": "link", "href": "https://example.test"}],
        ),
        block(span("Quoted"), style="blockquote"),
        block(span("one"), listItem="bullet", level=1),
        block(span("nested"), listItem="bullet", level=2),
        block(span("first"), listItem="number", level=1),
        {"_type": "image", "alt": "A chart", "asset": {"_ref": "image-abc-10x20-png"}},
        {"_type": "code", "language": "python", "filename": "main.py", "code": "print('hi')"},
    ]
    assert portable_text_to_markdown(blocks, fake_asset_url) == (
        "## Title\n\n"
        "Plain, **bold** and *italic* and `code` and [a link](https://example.test).\n\n"
        "> Quoted\n\n"
        "- one\n"
        "    - nested\n"
        "1. first\n\n"
        "![A chart](https://cdn.sanity.io/images/proj/production/abc-10x20.png)\n\n"
        '```python title="main.py"\nprint(\'hi\')\n```\n'
    )


def test_a_post_is_imported_published_with_its_body_as_markdown():
    post = {
        "_id": "post-1",
        "_type": "post",
        "title": "Hello",
        "slug": {"_type": "slug", "current": "hello"},
        "publishedAt": "2025-01-02T03:04:05Z",
        "summary": "First",
        "mainImage": {"_type": "image", "asset": {"_ref": "image-abc-10x20-jpg"}},
        "body": [block(span("Body text."))],
    }
    table, row = map_document(post, fake_asset_url)
    assert table == "posts"
    assert row == {
        "id": derived_id("post-1"),
        "slug": "hello",
        "title": "Hello",
        "summary": "First",
        "cover_url": "https://cdn.sanity.io/images/proj/production/abc-10x20.jpg",
        "body_md": "Body text.\n",
        "published": True,
        "published_at": "2025-01-02T03:04:05Z",
    }


def test_import_upserts_one_document_and_is_repeatable(fake_db, monkeypatch):
    document = next(d for d in fixture_documents() if d["_type"] == "skillGroup")
    monkeypatch.setattr(sanity_import, "_query", lambda *args, **kwargs: document)
    first = sanity_import.import_document("proj", "production", document["_id"])
    second = sanity_import.import_document("proj", "production", document["_id"])
    assert first == second == {"id": derived_id(document["_id"]), "type": "skillGroup"}
    assert len(fake_db.tables["documents"]) == 1
