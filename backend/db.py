"""Supabase through PostgREST, with the service-role key. Filters are PostgREST's own."""

from typing import Any

import httpx

from backend.config import ApiError, env, log

_http = httpx.Client(timeout=10)


class Conflict(Exception):
    """A unique constraint refused the write."""


def _request(method: str, path: str, **kwargs: Any) -> Any:
    key = env("SUPABASE_SERVICE_ROLE_KEY")
    headers = {"apikey": key, "Authorization": f"Bearer {key}", **kwargs.pop("headers", {})}
    url = f"{env('SUPABASE_URL').rstrip('/')}/rest/v1/{path}"
    response = _http.request(method, url, headers=headers, **kwargs)
    if response.status_code == 409:
        raise Conflict(path)
    if response.is_error:
        log.error("Supabase %s %s answered %s: %s", method, path, response.status_code, response.text[:300])
        raise ApiError(502, "The database refused the request.")
    return response.json() if response.content else None


def select(table: str, params: dict[str, Any] | None = None) -> list[dict]:
    return _request("GET", table, params=params or {})


def insert(table: str, row: dict, upsert: bool = False) -> dict:
    prefer = "return=representation" + (",resolution=merge-duplicates" if upsert else "")
    return _request("POST", table, json=row, headers={"Prefer": prefer})[0]


def update(table: str, filters: dict[str, Any], values: dict) -> list[dict]:
    """The rows that were changed, so a caller can tell a conditional update that lost."""
    return _request(
        "PATCH", table, params=filters, json=values, headers={"Prefer": "return=representation"}
    )


def delete(table: str, filters: dict[str, Any]) -> None:
    _request("DELETE", table, params=filters)


def rpc(function: str, arguments: dict) -> Any:
    return _request("POST", f"rpc/{function}", json=arguments)
