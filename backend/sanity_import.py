"""The one-time move out of Sanity. Delete this module once it has run."""

import copy
import json
import re
import uuid
from collections.abc import Callable

import httpx

from backend import db, storage
from backend.config import ApiError

# Each type's data, as API.md lists it, with the value a missing field takes.
SHAPES: dict[str, dict] = {
    "profile": {
        "name": None, "initials": "", "role": None, "summary": "", "location": None,
        "locationLink": None, "avatar": None, "logo": None, "social": [],
    },
    "organization": {"name": None, "website": None, "logo": None},
    "role": {
        "kind": None, "organization": None, "title": None, "location": None, "start": None,
        "end": None, "badges": [], "description": [],
    },
    "education": {"organization": None, "degree": None, "start": None, "end": None, "description": []},
    "achievement": {
        "title": None, "issuer": None, "dates": None, "location": None, "description": "",
        "image": None, "links": [],
    },
    "certificate": {
        "title": None, "issuer": None, "kind": "professional", "categories": [],
        "fileUrl": None, "externalUrl": None,
    },
    "project": {
        "slug": None, "title": None, "status": "", "description": "", "technologies": [],
        "image": None, "video": None, "gallery": [], "readmeRepo": None, "links": [],
    },
    "skillGroup": {"title": None, "items": []},
    "service": {"title": None, "description": None},
    "moment": {"image": None, "alt": "", "caption": None},
    "quote": {"text": None, "author": None, "role": None, "image": None},
    "pageMeta": {
        "site": None, "route": None, "title": None, "description": None, "heading": None,
        "subtitle": None,
    },
    "clientProject": {
        "client": None, "sector": None, "year": None, "summary": None, "services": [],
        "outcome": None, "image": None,
    },
    "counter": {"label": None, "value": None, "suffix": None},
}

AssetUrl = Callable[[str], str]

_IMAGE_REF = re.compile(r"image-([0-9a-f]+-\d+x\d+)-([a-z0-9]+)")
_FILE_REF = re.compile(r"file-([0-9a-f]+)-([a-z0-9]+)")


def derived_id(sanity_id: str) -> str:
    """The same Sanity id always becomes the same UUID, so a second run upserts."""
    return str(uuid.uuid5(uuid.NAMESPACE_URL, "sanity:" + sanity_id))


def cdn_url(ref: str, project_id: str, dataset: str) -> str:
    """Where Sanity serves the asset a reference names."""
    for pattern, kind in ((_IMAGE_REF, "images"), (_FILE_REF, "files")):
        match = pattern.fullmatch(ref)
        if match:
            name = f"{match.group(1)}.{match.group(2)}"
            return f"https://cdn.sanity.io/{kind}/{project_id}/{dataset}/{name}"
    raise ApiError(400, "That document points at an asset this import cannot read.")


def _convert(value: object, asset_url: AssetUrl) -> object:
    """Sanity's wrappers become plain values: an asset a URL, a reference an id."""
    if isinstance(value, list):
        return [_convert(item, asset_url) for item in value]
    if not isinstance(value, dict):
        return value
    if value.get("_type") == "slug":
        return value.get("current")
    if value.get("_type") == "reference":
        return derived_id(value["_ref"])
    if value.get("_type") in ("image", "file"):
        ref = (value.get("asset") or {}).get("_ref")
        return asset_url(ref) if ref else None
    return {key: _convert(item, asset_url) for key, item in value.items() if not key.startswith("_")}


def map_document(doc: dict, asset_url: AssetUrl) -> tuple[str, dict]:
    """The table and the row one Sanity document becomes."""
    if doc["_type"] == "post":
        return "posts", _map_post(doc, asset_url)
    if doc["_type"] not in SHAPES:
        raise ApiError(400, "That type of document is not imported.")

    source = dict(doc)
    # Fields that were renamed on the way out of Sanity.
    source["image"] = source.get("image") or source.get("imageUrl")
    source["fileUrl"] = source.get("file")
    data = copy.deepcopy(SHAPES[doc["_type"]])
    for field in data:
        if source.get(field) is not None:
            data[field] = _convert(source[field], asset_url)
    if doc["_type"] == "profile":
        for link in data["social"]:
            link.setdefault("inNavbar", True)
    row = {"id": derived_id(doc["_id"]), "type": doc["_type"], "data": data}
    if doc.get("order") is not None:
        row["sort_order"] = doc["order"]
    return "documents", row


def _map_post(doc: dict, asset_url: AssetUrl) -> dict:
    return {
        "id": derived_id(doc["_id"]),
        "slug": (doc.get("slug") or {}).get("current"),
        "title": doc.get("title") or "",
        "summary": doc.get("summary") or "",
        "cover_url": _convert(doc.get("mainImage"), asset_url),
        "body_md": portable_text_to_markdown(doc.get("body") or [], asset_url),
        "published": True,
        "published_at": doc.get("publishedAt") or doc.get("_createdAt"),
    }


def _span_markdown(span: dict, links: dict[str, str]) -> str:
    text = span.get("text", "")
    stripped = text.strip()
    if not stripped:
        return text
    marks = span.get("marks") or []
    inner = stripped
    if "code" in marks:
        inner = f"`{inner}`"
    if "em" in marks:
        inner = f"*{inner}*"
    if "strong" in marks:
        inner = f"**{inner}**"
    for mark in marks:
        if mark in links:
            inner = f"[{inner}]({links[mark]})"
    # Emphasis that hugs a space does not render, so the padding stays outside the marks.
    lead = text[: len(text) - len(text.lstrip())]
    trail = text[len(text.rstrip()):]
    return lead + inner + trail


def _block_markdown(block: dict) -> str:
    links = {d["_key"]: d.get("href", "") for d in block.get("markDefs") or [] if d.get("_type") == "link"}
    text = "".join(_span_markdown(span, links) for span in block.get("children") or [])
    style = block.get("style", "normal")
    if block.get("listItem"):
        indent = "    " * (block.get("level", 1) - 1)
        return f"{indent}{'1.' if block['listItem'] == 'number' else '-'} {text}"
    if re.fullmatch(r"h[1-6]", style):
        return f"{'#' * int(style[1])} {text}"
    if style == "blockquote":
        return f"> {text}"
    return text


def portable_text_to_markdown(blocks: list[dict], asset_url: AssetUrl) -> str:
    parts: list[str] = []
    was_list_item = False
    for block in blocks:
        is_list_item = False
        if block.get("_type") == "image":
            ref = (block.get("asset") or {}).get("_ref")
            part = f"![{block.get('alt') or ''}]({asset_url(ref)})" if ref else ""
        elif block.get("_type") == "code":
            title = f' title="{block["filename"]}"' if block.get("filename") else ""
            part = f"```{block.get('language') or ''}{title}\n{block.get('code', '')}\n```"
        elif block.get("_type") == "block":
            part = _block_markdown(block)
            is_list_item = bool(block.get("listItem"))
        else:
            continue
        # Items of one list sit on adjacent lines; everything else is a paragraph apart.
        if parts and is_list_item and was_list_item:
            parts[-1] += "\n" + part
        elif part:
            parts.append(part)
        was_list_item = is_list_item
    return "\n\n".join(parts) + "\n"


def _query(project_id: str, dataset: str, groq: str, params: dict[str, str] | None = None) -> object:
    # Both end up in a hostname and a path, so neither may be more than an identifier.
    if not re.fullmatch(r"[a-z0-9]+", project_id) or not re.fullmatch(r"[a-z0-9_-]+", dataset):
        raise ApiError(400, "That is not a Sanity project id and dataset.")
    url = f"https://{project_id}.apicdn.sanity.io/v2025-12-01/data/query/{dataset}"
    response = httpx.get(url, params={"query": groq, **(params or {})}, timeout=30)
    if response.is_error:
        raise ApiError(502, "Sanity did not answer the query.")
    return response.json().get("result")


def plan(project_id: str, dataset: str) -> list[dict]:
    """Every document the import would bring over."""
    types = json.dumps([*SHAPES, "post"])
    groq = (
        f'*[_type in {types} && !(_id in path("drafts.**"))]|order(_type asc, _id asc)'
        '{"id": _id, "type": _type, "title": coalesce(title, name, text, alt, label, client, route)}'
    )
    return _query(project_id, dataset, groq) or []


def import_document(project_id: str, dataset: str, sanity_id: str) -> dict:
    doc = _query(project_id, dataset, "*[_id == $id][0]", {"$id": json.dumps(sanity_id)})
    if not doc:
        raise ApiError(404, "Sanity has no document with that id.")

    def copy_to_bucket(ref: str) -> str:
        url = cdn_url(ref, project_id, dataset)
        source = httpx.get(url, timeout=60, follow_redirects=True)
        if source.is_error:
            raise ApiError(502, "An asset could not be fetched from Sanity.")
        content_type = source.headers.get("content-type", "application/octet-stream")
        name = url.rsplit("/", 1)[-1]
        return storage.put_bytes(f"imported/{name}", source.content, content_type)

    table, row = map_document(doc, copy_to_bucket)
    try:
        db.insert(table, row, upsert=True)
    except db.Conflict as error:
        raise ApiError(409, "Another post already uses that slug.") from error
    return {"id": row["id"], "type": doc["_type"]}
