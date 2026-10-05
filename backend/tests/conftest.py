"""An in-memory stand-in for PostgREST, so no test needs a database or a credential."""

import base64
import uuid
from collections import defaultdict
from datetime import datetime, timezone

import pytest

from backend import db

ORIGIN = "https://studio.test"
TABLE_DEFAULTS = {
    "studio_otps": {"attempts": 0, "used_at": None},
    "studio_sessions": {"revoked_at": None},
    "documents": {"sort_order": 100},
    "posts": {"summary": "", "cover_url": None, "tags": [], "body_md": "", "published": False, "published_at": None},
}
# The columns a unique constraint covers, so a duplicate insert raises as PostgREST's 409 does.
UNIQUE = {"sessions": "session_id"}


def _text(value: object) -> str:
    """A value as PostgREST compares it in a filter: booleans are lowercase."""
    return str(value).lower() if isinstance(value, bool) else str(value)


class FakeDb:
    def __init__(self) -> None:
        self.tables: dict[str, list[dict]] = defaultdict(list)
        self.is_allowed = True
        self.rate_limit_calls: list[dict] = []
        # Every table reached with the anon key, in call order.
        self.anon_tables: list[str] = []

    def _note(self, table: str, anon: bool) -> None:
        if anon:
            self.anon_tables.append(table)

    def _matching(self, table: str, filters: dict) -> list[dict]:
        rows = self.tables[table]
        for column, condition in filters.items():
            if column in ("order", "limit", "select"):
                continue
            operator, _, operand = str(condition).partition(".")
            if operator == "eq":
                rows = [row for row in rows if _text(row.get(column)) == operand]
            elif operator == "is":
                rows = [row for row in rows if row.get(column) is None]
            elif operator == "in":
                rows = [row for row in rows if row.get(column) in operand.strip("()").split(",")]
        return rows

    def select(self, table: str, params: dict | None = None, anon: bool = False) -> list[dict]:
        self._note(table, anon)
        params = params or {}
        rows = [dict(row) for row in self._matching(table, params)]
        if str(params.get("order", "")).endswith(".desc"):
            rows.reverse()
        if "select" in params:
            columns = params["select"].split(",")
            rows = [{column: row.get(column) for column in columns} for row in rows]
        return rows[: params["limit"]] if "limit" in params else rows

    def insert(self, table: str, row: dict, upsert: bool = False, anon: bool = False) -> dict:
        self._note(table, anon)
        unique = UNIQUE.get(table)
        if unique and any(existing.get(unique) == row.get(unique) for existing in self.tables[table]):
            raise db.Conflict(table)
        key = "name" if table == "credentials" else "id"
        stamp = datetime.now(timezone.utc).isoformat()
        new = {"id": str(uuid.uuid4()), "created_at": stamp, "updated_at": stamp}
        new.update(TABLE_DEFAULTS.get(table, {}))
        new.update(row)
        if upsert:
            self.tables[table] = [r for r in self.tables[table] if r.get(key) != new.get(key)]
        self.tables[table].append(new)
        return dict(new)

    def update(self, table: str, filters: dict, values: dict, anon: bool = False) -> list[dict]:
        self._note(table, anon)
        rows = self._matching(table, filters)
        for row in rows:
            row.update(values)
        return [dict(row) for row in rows]

    def delete(self, table: str, filters: dict) -> None:
        doomed = self._matching(table, filters)
        self.tables[table] = [row for row in self.tables[table] if row not in doomed]

    def rpc(self, function: str, arguments: dict) -> list[dict]:
        self.rate_limit_calls.append(arguments)
        return [{"allowed": self.is_allowed, "remaining": 1, "reset_seconds": 120}]


@pytest.fixture
def fake_db(monkeypatch: pytest.MonkeyPatch) -> FakeDb:
    fake = FakeDb()
    for name in ("select", "insert", "update", "delete", "rpc"):
        monkeypatch.setattr(db, name, getattr(fake, name))
    monkeypatch.setenv("STUDIO_ENCRYPTION_KEY", base64.b64encode(b"k" * 32).decode())
    monkeypatch.setenv("ALLOWED_ORIGINS", ORIGIN)
    monkeypatch.delenv("VERCEL_ENV", raising=False)
    return fake
