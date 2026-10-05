"""The portfolio's visitor counts, read and written with the anon key the tables' policies allow.

Ported from the portfolio's own route. Visits and project clicks are counted per day in
`daily_stats`, and each also bumps its running total in `counters`.
"""

from datetime import date, datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from backend import db, ratelimit
from backend.config import ApiError, log

router = APIRouter(prefix="/api")

NO_STORE = {"Cache-Control": "no-store"}
# Writes per visitor per hour, shared by visits and project clicks.
WRITE_LIMIT = 60
# A refusal, a missing key, or an unreachable database.
FAILURES = (ApiError, db.Conflict, httpx.HTTPError)


class AnalyticsEvent(BaseModel):
    type: str | None = None


def utc_today() -> date:
    """The day as the table stores it: the old route took the date from an ISO timestamp, in UTC."""
    return datetime.now(timezone.utc).date()


def last_seven_days() -> list[str]:
    """Six days ago through today, oldest first."""
    return [(utc_today() - timedelta(days=offset)).isoformat() for offset in range(6, -1, -1)]


def daily_counts(counter_type: str) -> dict[str, int]:
    # ponytail: PostgREST returns at most its max-rows (1000 by default), one row a day, as the
    # old route did. A SQL sum when the history outgrows it.
    rows = db.select(
        "daily_stats", {"select": "date,visits", "counter_type": f"eq.{counter_type}"}, anon=True
    )
    return {row["date"]: row["visits"] or 0 for row in rows}


def summary() -> dict:
    """Totals, today's visits, this week's project views, and the week's visits for the sparkline."""
    visits = daily_counts("visits")
    views = daily_counts("project_views")
    week = last_seven_days()
    return {
        "visitors": sum(visits.values()),
        "projects": sum(views.values()),
        "delta24h": visits.get(week[-1], 0),
        "delta7d": sum(views.get(day, 0) for day in week),
        "sparkline": [visits.get(day, 0) for day in week],
    }


def increment(counter_name: str, counter_type: str) -> tuple[int, int]:
    """Add one to a running total and to today's count. Returns both new values."""
    # ponytail: read-then-write, so two simultaneous visits can count as one, exactly as in the
    # old route. An SQL function if the numbers ever have to be exact.
    stamp = datetime.now(timezone.utc).isoformat()
    counter = db.select("counters", {"select": "value", "name": f"eq.{counter_name}"}, anon=True)
    total = (counter[0]["value"] or 0) + 1 if counter else 1
    db.update("counters", {"name": f"eq.{counter_name}"}, {"value": total, "updated_at": stamp}, anon=True)

    today = utc_today().isoformat()
    filters = {"date": f"eq.{today}", "counter_type": f"eq.{counter_type}"}
    daily = db.select("daily_stats", {"select": "id,visits", **filters}, anon=True)
    if not daily:
        db.insert("daily_stats", {"date": today, "counter_type": counter_type, "visits": 1}, anon=True)
        return total, 1
    count = (daily[0]["visits"] or 0) + 1
    db.update("daily_stats", {"id": f"eq.{daily[0]['id']}"}, {"visits": count, "updated_at": stamp}, anon=True)
    return total, count


def is_first_visit(session: str) -> bool:
    """Record the session, and say whether it was new. The unique column makes this atomic."""
    try:
        db.insert("sessions", {"session_id": session}, anon=True)
    except db.Conflict:
        return False
    return True


def failed(message: str, **extra: str) -> JSONResponse:
    return JSONResponse({"success": False, "error": message, **extra}, status_code=500, headers=NO_STORE)


@router.get("/analytics")
def read_analytics(
    request: Request,
    action: str | None = None,
    session: str | None = Query(None, max_length=200),
) -> JSONResponse:
    # A visit without a session id is not counted, as before; only a counted one spends allowance.
    is_visit = action == "visit" and bool(session)
    if is_visit:
        ratelimit.enforce("analytics", ratelimit.client_ip(request), WRITE_LIMIT)
    try:
        total = increment("visitors", "visits")[0] if is_visit and is_first_visit(session) else None
        data = summary()
    except FAILURES as error:
        log.error("Analytics could not be read: %r", error)
        return failed("Failed to fetch analytics", fallbackMessage="Data Unavailable")
    if total is not None:
        # As before: the visit that was just counted is answered with the running total.
        data["visitors"] = total
    return JSONResponse({"success": True, "data": data}, headers=NO_STORE)


@router.post("/analytics")
def record_event(body: AnalyticsEvent, request: Request) -> JSONResponse:
    if body.type != "project-click":
        return JSONResponse({"success": True}, headers=NO_STORE)
    ratelimit.enforce("analytics", ratelimit.client_ip(request), WRITE_LIMIT)
    try:
        total, _ = increment("project_views", "project_views")
    except FAILURES as error:
        log.error("A project click could not be counted: %r", error)
        return failed("Failed to update analytics")
    return JSONResponse({"success": True, "data": {"visitors": 0, "projects": total}}, headers=NO_STORE)
