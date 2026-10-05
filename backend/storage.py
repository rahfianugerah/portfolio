"""Google Cloud Storage presented as a drive: folders are prefixes, bytes go direct."""

import json
from datetime import timedelta
from urllib.parse import quote

from google.api_core.exceptions import GoogleAPIError, NotFound
from google.cloud import storage

from backend import vault
from backend.config import ApiError, allowed_origins, log

MAX_BYTES = 25 * 1024 * 1024
ALLOWED_TYPES = {
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/avif",
    "application/pdf",
    "text/markdown",
}
# Signed into the upload URL, so the bucket itself refuses a body past the limit.
SIZE_RANGE_HEADER = "x-goog-content-length-range"
NOT_FOUND = ApiError(404, "There is no file at that path.")


def matches_type(content_type: str, data: bytes) -> bool:
    """Whether the bytes are what the declared type says. Markdown needs the whole file."""
    if content_type == "image/png":
        return data.startswith(b"\x89PNG\r\n\x1a\n")
    if content_type == "image/jpeg":
        return data.startswith(b"\xff\xd8\xff")
    if content_type == "image/gif":
        return data.startswith((b"GIF87a", b"GIF89a"))
    if content_type == "image/webp":
        return data[:4] == b"RIFF" and data[8:12] == b"WEBP"
    if content_type == "image/avif":
        return data[4:8] == b"ftyp" and data[8:12] in (b"avif", b"avis")
    if content_type == "application/pdf":
        return data.startswith(b"%PDF-")
    if content_type == "text/markdown":
        try:
            data.decode("utf-8")
        except UnicodeDecodeError:
            return False
        return b"\x00" not in data
    return False


def clean_path(path: str, *, folder: bool | None = None) -> str:
    """Reject anything that is not a plain relative path. folder=None accepts either kind."""
    segments = path.split("/")
    if path.endswith("/"):
        segments = segments[:-1]
    is_plain = (
        0 < len(path) <= 1024
        and "\\" not in path
        and path.isprintable()
        and all(segment and segment not in (".", "..") for segment in segments)
    )
    if not is_plain or (folder is not None and path.endswith("/") != folder):
        raise ApiError(400, "That is not a valid path.")
    return path


def _bucket() -> storage.Bucket:
    saved = vault.load()
    if not saved["GCS_BUCKET"] or not saved["GCS_SERVICE_ACCOUNT"]:
        raise ApiError(503, "Storage is not configured.")
    client = storage.Client.from_service_account_info(json.loads(saved["GCS_SERVICE_ACCOUNT"]))
    return client.bucket(saved["GCS_BUCKET"])


def public_url(bucket_name: str, path: str) -> str:
    return f"https://storage.googleapis.com/{bucket_name}/{quote(path)}"


def _describe(blob: storage.Blob) -> dict:
    return {
        "path": blob.name,
        "name": blob.name.rsplit("/", 1)[-1],
        "size": blob.size,
        "contentType": blob.content_type,
        "updatedAt": blob.updated.isoformat() if blob.updated else None,
        "url": public_url(blob.bucket.name, blob.name),
    }


def list_files(prefix: str) -> dict:
    if prefix:
        clean_path(prefix, folder=True)
    listing = _bucket().list_blobs(prefix=prefix, delimiter="/")
    # A folder's own placeholder object is not one of its files.
    files = [_describe(blob) for blob in listing if not blob.name.endswith("/")]
    # The prefixes are only known once the listing has been walked.
    return {"prefix": prefix, "folders": sorted(listing.prefixes), "files": files}


def upload_url(path: str, content_type: str, size: int) -> dict:
    clean_path(path, folder=False)
    if content_type not in ALLOWED_TYPES:
        raise ApiError(400, "That type of file cannot be uploaded.")
    if not 0 < size <= MAX_BYTES:
        raise ApiError(400, "A file must be between 1 byte and 25 MB.")
    headers = {"Content-Type": content_type, SIZE_RANGE_HEADER: f"0,{MAX_BYTES}"}
    url = _bucket().blob(path).generate_signed_url(
        version="v4",
        expiration=timedelta(minutes=15),
        method="PUT",
        content_type=content_type,
        headers={SIZE_RANGE_HEADER: headers[SIZE_RANGE_HEADER]},
    )
    return {"url": url, "method": "PUT", "headers": headers}


def finalize(path: str) -> dict:
    """Check an uploaded object against its declared type, and delete it if it lies."""
    clean_path(path, folder=False)
    blob = _bucket().get_blob(path)
    if blob is None:
        raise NOT_FOUND
    content_type = blob.content_type or ""
    is_valid = content_type in ALLOWED_TYPES and 0 < blob.size <= MAX_BYTES
    if is_valid:
        whole_file = content_type == "text/markdown"
        data = blob.download_as_bytes(end=None if whole_file else 31)
        is_valid = matches_type(content_type, data)
    if not is_valid:
        blob.delete()
        raise ApiError(400, "That file is not what its type says, so it was removed.")
    return _describe(blob)


def create_folder(path: str) -> None:
    clean_path(path, folder=True)
    _bucket().blob(path).upload_from_string(b"")


def move(source: str, target: str) -> None:
    """Copy then delete, since a bucket has no rename. A folder takes its contents along."""
    is_folder = source.endswith("/")
    clean_path(source)
    clean_path(target, folder=is_folder)
    if target.startswith(source) and is_folder:
        raise ApiError(400, "A folder cannot be moved into itself.")
    bucket = _bucket()
    blobs = list(bucket.list_blobs(prefix=source)) if is_folder else [bucket.get_blob(source)]
    if not blobs or blobs[0] is None:
        raise NOT_FOUND
    for blob in blobs:
        bucket.copy_blob(blob, bucket, target + blob.name[len(source):])
        blob.delete()


def delete(path: str) -> None:
    clean_path(path)
    bucket = _bucket()
    if path.endswith("/"):
        for blob in bucket.list_blobs(prefix=path):
            blob.delete()
        return
    try:
        bucket.blob(path).delete()
    except NotFound as error:
        raise NOT_FOUND from error


def put_bytes(path: str, data: bytes, content_type: str) -> str:
    """Store bytes the server already holds, and return their public address."""
    bucket = _bucket()
    bucket.blob(path).upload_from_string(data, content_type=content_type)
    return public_url(bucket.name, path)


def allow_browser_uploads() -> None:
    """Let the allowed origins PUT to the bucket. Refusal is logged, never raised."""
    try:
        bucket = _bucket()
        bucket.cors = [
            {
                "origin": allowed_origins(),
                "method": ["PUT"],
                "responseHeader": ["Content-Type", SIZE_RANGE_HEADER],
                "maxAgeSeconds": 3600,
            }
        ]
        bucket.patch()
    except ApiError:
        # Half configured: the other credential has not been saved yet.
        return
    except (GoogleAPIError, ValueError) as error:
        log.warning("Bucket CORS could not be set, uploads may be refused: %r", error)
