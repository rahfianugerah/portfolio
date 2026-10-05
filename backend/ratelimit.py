"""Per-visitor allowances, counted in Postgres because a serverless instance forgets."""

import math

import httpx
from fastapi import Request

from backend import db
from backend.config import ApiError, log
from backend.crypto import sha256_hex

HOUR = 3600


def client_ip(request: Request) -> str:
    # Browsers connect to this deployment themselves, and Vercel overwrites x-forwarded-for
    # with whoever connected, so its first entry is the visitor and cannot be chosen by them.
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "anonymous"


def enforce(bucket: str, ip: str, limit: int) -> None:
    """Spend one request from the hourly allowance, or raise 429. Fails closed with 503."""
    try:
        # The address is hashed here so the database never holds a visitor's IP.
        row = db.rpc(
            "check_rate_limit",
            {"p_bucket": bucket, "p_key_hash": sha256_hex(ip), "p_limit": limit, "p_window_seconds": HOUR},
        )[0]
        is_allowed, reset_seconds = row["allowed"], row["reset_seconds"]
    except (httpx.HTTPError, ApiError, LookupError, TypeError) as error:
        log.error("Rate limit for %s could not be read: %r", bucket, error)
        raise ApiError(503, "This is unavailable just now. Please try again later.") from error
    if not is_allowed:
        minutes = math.ceil(reset_seconds / 60)
        raise ApiError(429, f"Too many requests. Please come back in {minutes} minute(s).")
