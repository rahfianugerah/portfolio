"""Posts, documents, and the one-time import. Every route here is the owner's."""

import re
import unicodedata
import uuid

import yaml
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from backend import auth, db, sanity_import
from backend.config import ApiError

router = APIRouter(prefix="/api/studio", dependencies=[Depends(auth.require_owner)])

# Every type the old dataset had, plus the ones the studio has gained since, which have
# nothing to import and so no shape to map. The public read accepts exactly these too.
DOCUMENT_TYPES = frozenset(sanity_import.SHAPES) | {
    "pricingTier", "consultingService", "principle", "processStep",
}
POST_LIST_COLUMNS = "id,slug,title,summary,cover_url,tags,published,published_at,created_at,updated_at"
SLUG_TAKEN = ApiError(409, "Another post already uses that slug.")
NO_POST = ApiError(404, "There is no post with that id.")
NO_DOCUMENT = ApiError(404, "There is no document with that id.")


class PostBody(BaseModel):
    title: str | None = None
    slug: str | None = None
    summary: str | None = None
    coverUrl: str | None = None
    tags: list[str] | None = None
    bodyMd: str | None = None
    published: bool | None = None


class MarkdownBody(BaseModel):
    markdown: str


class DocumentCreate(BaseModel):
    type: str
    data: dict
    sortOrder: int | None = None


class DocumentUpdate(BaseModel):
    data: dict
    sortOrder: int | None = None


class ImportRequest(BaseModel):
    projectId: str
    dataset: str
    id: str


def slugify(text: str) -> str:
    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")


def parse_front_matter(markdown: str) -> dict:
    """Split a Markdown file into the fields of the post form."""
    meta: dict = {}
    body = markdown.lstrip("﻿")
    match = re.match(r"---\r?\n(.*?)\r?\n---[ \t]*(\r?\n|$)", body, re.DOTALL)
    if match:
        try:
            loaded = yaml.safe_load(match.group(1))
        except yaml.YAMLError as error:
            raise ApiError(400, "The front matter is not valid YAML.") from error
        meta = loaded if isinstance(loaded, dict) else {}
        body = body[match.end():]
    tags = meta.get("tags") or []
    if isinstance(tags, str):
        tags = tags.split(",")
    title = str(meta.get("title") or "")
    return {
        "title": title,
        "summary": str(meta.get("summary") or meta.get("description") or ""),
        "tags": [str(tag).strip() for tag in tags if str(tag).strip()],
        "slug": slugify(str(meta.get("slug") or title)),
        "bodyMd": body.lstrip("\r\n"),
    }


def _post_out(row: dict) -> dict:
    out = {
        "id": row["id"],
        "slug": row["slug"],
        "title": row["title"],
        "summary": row["summary"],
        "coverUrl": row["cover_url"],
        "tags": row["tags"],
        "published": row["published"],
        "publishedAt": row["published_at"],
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }
    if "body_md" in row:
        out["bodyMd"] = row["body_md"]
    return out


def _post_values(body: PostBody) -> dict:
    """The columns a request sets. A field the request left out is left alone."""
    columns = {"coverUrl": "cover_url", "bodyMd": "body_md"}
    given = body.model_dump(exclude_unset=True)
    values = {columns.get(name, name): value for name, value in given.items()}
    if "slug" in values:
        values["slug"] = slugify(values["slug"] or "")
    return values


@router.get("/posts")
def list_posts() -> list[dict]:
    rows = db.select("posts", {"select": POST_LIST_COLUMNS, "order": "created_at.desc"})
    return [_post_out(row) for row in rows]


@router.post("/posts/parse")
def parse_post(body: MarkdownBody) -> dict:
    return parse_front_matter(body.markdown)


@router.post("/posts", status_code=201)
def create_post(body: PostBody) -> dict:
    values = _post_values(body)
    if not (values.get("title") or "").strip():
        raise ApiError(400, "A post needs a title.")
    values["slug"] = slugify(values.get("slug") or values["title"])
    if not values["slug"]:
        raise ApiError(400, "A post needs a slug made of letters or numbers.")
    if values.get("published"):
        values["published_at"] = auth.now().isoformat()
    try:
        return _post_out(db.insert("posts", values))
    except db.Conflict as error:
        raise SLUG_TAKEN from error


@router.get("/posts/{post_id}")
def get_post(post_id: uuid.UUID) -> dict:
    rows = db.select("posts", {"id": f"eq.{post_id}"})
    if not rows:
        raise NO_POST
    return _post_out(rows[0])


@router.put("/posts/{post_id}")
def update_post(post_id: uuid.UUID, body: PostBody) -> dict:
    current = get_post(post_id)
    values = _post_values(body)
    if "title" in values and not (values["title"] or "").strip():
        raise ApiError(400, "A post needs a title.")
    if "slug" in values and not values["slug"]:
        raise ApiError(400, "A post needs a slug made of letters or numbers.")
    # The date a post first went public survives being unpublished and published again.
    if values.get("published") and not current["publishedAt"]:
        values["published_at"] = auth.now().isoformat()
    values["updated_at"] = auth.now().isoformat()
    try:
        return _post_out(db.update("posts", {"id": f"eq.{post_id}"}, values)[0])
    except db.Conflict as error:
        raise SLUG_TAKEN from error


@router.delete("/posts/{post_id}", status_code=204)
def delete_post(post_id: uuid.UUID) -> None:
    db.delete("posts", {"id": f"eq.{post_id}"})


def _document_out(row: dict) -> dict:
    return {
        "id": row["id"],
        "type": row["type"],
        "data": row["data"],
        "sortOrder": row["sort_order"],
        "updatedAt": row["updated_at"],
    }


def check_type(document_type: str) -> None:
    if document_type not in DOCUMENT_TYPES:
        raise ApiError(400, "That is not a type of document.")


@router.get("/documents")
def list_documents(type: str | None = None) -> list[dict]:
    params = {"order": "type.asc,sort_order.asc"}
    if type is not None:
        check_type(type)
        params["type"] = f"eq.{type}"
    return [_document_out(row) for row in db.select("documents", params)]


@router.post("/documents", status_code=201)
def create_document(body: DocumentCreate) -> dict:
    check_type(body.type)
    if body.type == "profile" and db.select("documents", {"type": "eq.profile", "limit": 1}):
        raise ApiError(409, "There is already a profile. Edit that one.")
    row = {"type": body.type, "data": body.data}
    if body.sortOrder is not None:
        row["sort_order"] = body.sortOrder
    return _document_out(db.insert("documents", row))


@router.put("/documents/{document_id}")
def update_document(document_id: uuid.UUID, body: DocumentUpdate) -> dict:
    values = {"data": body.data, "updated_at": auth.now().isoformat()}
    if body.sortOrder is not None:
        values["sort_order"] = body.sortOrder
    rows = db.update("documents", {"id": f"eq.{document_id}"}, values)
    if not rows:
        raise NO_DOCUMENT
    return _document_out(rows[0])


@router.delete("/documents/{document_id}", status_code=204)
def delete_document(document_id: uuid.UUID) -> None:
    db.delete("documents", {"id": f"eq.{document_id}"})


@router.get("/import/sanity/plan")
def import_plan(projectId: str, dataset: str) -> list[dict]:
    return sanity_import.plan(projectId, dataset)


@router.post("/import/sanity/document")
def import_document(body: ImportRequest) -> dict:
    return sanity_import.import_document(body.projectId, body.dataset, body.id)
