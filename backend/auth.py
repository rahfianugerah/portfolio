"""The one owner account: sign-in, lockout, sessions, reset codes."""

import hmac
import secrets
import smtplib
from datetime import datetime, timedelta, timezone

from fastapi import Request, Response

from backend import db, mail
from backend.config import ApiError, allowed_origins, is_deployed, log
from backend.crypto import hash_password, sha256_hex, verify_password

COOKIE = "studio_session"
SESSION_LIFETIME = timedelta(hours=12)
OTP_LIFETIME = timedelta(minutes=10)
MAX_OTP_ATTEMPTS = 5
MAX_FAILED_LOGINS = 5
LOCK_DURATION = timedelta(minutes=15)
MIN_PASSWORD_LENGTH = 12

INVALID_LOGIN = ApiError(401, "Invalid email or password.")
INVALID_CODE = ApiError(400, "That code is not valid.")
SIGNED_OUT = ApiError(401, "Sign in to continue.")


def now() -> datetime:
    return datetime.now(timezone.utc)


def _is_past(timestamp: str | None) -> bool:
    return timestamp is None or datetime.fromisoformat(timestamp) <= now()


def _owner() -> dict | None:
    rows = db.select("studio_owner", {"limit": 1})
    return rows[0] if rows else None


def check_new_password(password: str) -> None:
    if len(password) < MIN_PASSWORD_LENGTH:
        raise ApiError(400, f"A password needs at least {MIN_PASSWORD_LENGTH} characters.")


def login(email: str, password: str) -> str:
    """A new session token, or the one reply every failure shares."""
    owner = _owner() or {}
    owner_id = owner.get("id", "")
    # The digest is verified whatever else is wrong, so timing does not name the cause.
    is_password_right = verify_password(
        owner.get("password_blob"), owner.get("password_nonce"), owner_id, password
    )
    is_email_right = hmac.compare_digest(
        email.strip().lower().encode(), owner.get("email", "").lower().encode()
    )
    is_locked = not _is_past(owner.get("locked_until"))

    if not owner or is_locked:
        raise INVALID_LOGIN
    if not (is_email_right and is_password_right):
        # Counted whichever half was wrong: a write only for the right address would time
        # differently from none. A reset code lifts the lock if a stranger trips it.
        _record_failure(owner)
        raise INVALID_LOGIN

    db.update(
        "studio_owner",
        {"id": f"eq.{owner_id}"},
        {"failed_attempts": 0, "locked_until": None, "last_login_at": now().isoformat()},
    )
    return _create_session(owner_id)


def _record_failure(owner: dict) -> None:
    # ponytail: read-then-write, so two simultaneous failures can count as one. The
    # per-visitor limit bounds it; move to an SQL function if that ever matters.
    failures = owner["failed_attempts"] + 1
    values: dict = {"failed_attempts": failures}
    if failures >= MAX_FAILED_LOGINS:
        values = {"failed_attempts": 0, "locked_until": (now() + LOCK_DURATION).isoformat()}
    db.update("studio_owner", {"id": f"eq.{owner['id']}"}, values)


def _create_session(owner_id: str) -> str:
    token = secrets.token_urlsafe(32)
    db.insert(
        "studio_sessions",
        {
            "owner_id": owner_id,
            "token_hash": sha256_hex(token),
            "expires_at": (now() + SESSION_LIFETIME).isoformat(),
        },
    )
    return token


def set_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        COOKIE,
        token,
        max_age=int(SESSION_LIFETIME.total_seconds()),
        path="/",
        httponly=True,
        samesite="lax",
        secure=is_deployed(),
    )


def clear_cookie(response: Response) -> None:
    response.delete_cookie(COOKIE, path="/", httponly=True, samesite="lax", secure=is_deployed())


def require_owner(request: Request) -> dict:
    """The live session behind this request's cookie, or 401."""
    token = request.cookies.get(COOKIE)
    rows = db.select("studio_sessions", {"token_hash": f"eq.{sha256_hex(token)}"}) if token else []
    if not rows or rows[0]["revoked_at"] or _is_past(rows[0]["expires_at"]):
        raise SIGNED_OUT
    # A SameSite=Lax cookie still rides a cross-site form post; the Origin is the CSRF check.
    is_write = request.method not in ("GET", "HEAD", "OPTIONS")
    if is_write and request.headers.get("origin", "").rstrip("/") not in allowed_origins():
        raise ApiError(403, "That request did not come from the studio.")
    return rows[0]


def logout(session: dict) -> None:
    db.update("studio_sessions", {"id": f"eq.{session['id']}"}, {"revoked_at": now().isoformat()})


def send_otp() -> None:
    """Mail a reset code to the owner. Says nothing about whether there was one to mail."""
    owner = _owner()
    if not owner:
        return
    code = f"{secrets.randbelow(10**6):06d}"
    # Only the newest code is live.
    db.update(
        "studio_otps",
        {"owner_id": f"eq.{owner['id']}", "used_at": "is.null"},
        {"used_at": now().isoformat()},
    )
    db.insert(
        "studio_otps",
        {
            "owner_id": owner["id"],
            "code_hash": sha256_hex(code),
            "expires_at": (now() + OTP_LIFETIME).isoformat(),
        },
    )
    body = f"{code}\n\nThis code is valid for 10 minutes."
    try:
        mail.send("Your studio code", body, to=owner["email"])
    except (ApiError, smtplib.SMTPException, OSError) as error:
        # The exception type only: an SMTP error message can carry the recipient.
        log.error("The reset code could not be mailed: %s", type(error).__name__)


def reset_password(code: str, new_password: str) -> None:
    check_new_password(new_password)
    owner = _owner()
    if not owner:
        raise INVALID_CODE
    otps = db.select(
        "studio_otps",
        {
            "owner_id": f"eq.{owner['id']}",
            "used_at": "is.null",
            "order": "created_at.desc",
            "limit": 1,
        },
    )
    if not otps:
        raise INVALID_CODE
    otp = otps[0]
    if _is_past(otp["expires_at"]) or otp["attempts"] >= MAX_OTP_ATTEMPTS:
        raise INVALID_CODE

    still_unused = {"id": f"eq.{otp['id']}", "used_at": "is.null"}
    if not hmac.compare_digest(sha256_hex(code), otp["code_hash"]):
        # ponytail: read-then-write counter, same ceiling as _record_failure.
        db.update("studio_otps", still_unused, {"attempts": otp["attempts"] + 1})
        raise INVALID_CODE
    # Conditional on still being unused, so two requests cannot both spend one code.
    if not db.update("studio_otps", still_unused, {"used_at": now().isoformat()}):
        raise INVALID_CODE
    _set_password(owner["id"], new_password)


def change_password(session: dict, current_password: str, new_password: str) -> None:
    check_new_password(new_password)
    owner = _owner()
    if not owner or owner["id"] != session["owner_id"]:
        raise SIGNED_OUT
    is_current_right = verify_password(
        owner["password_blob"], owner["password_nonce"], owner["id"], current_password
    )
    if not is_current_right:
        raise ApiError(400, "The current password is not correct.")
    _set_password(owner["id"], new_password)


def _set_password(owner_id: str, password: str) -> None:
    """Store the new digest, then sign out everywhere and lift any lock."""
    sealed = hash_password(password, owner_id)
    timestamp = now().isoformat()
    db.update(
        "studio_owner",
        {"id": f"eq.{owner_id}"},
        {
            "password_blob": sealed["blob"],
            "password_nonce": sealed["nonce"],
            "key_version": sealed["key_version"],
            "password_changed_at": timestamp,
            "failed_attempts": 0,
            "locked_until": None,
        },
    )
    db.update(
        "studio_sessions",
        {"owner_id": f"eq.{owner_id}", "revoked_at": "is.null"},
        {"revoked_at": timestamp},
    )


def has_password(session: dict) -> bool:
    owner = _owner()
    return bool(owner and owner["id"] == session["owner_id"] and owner["password_blob"])
