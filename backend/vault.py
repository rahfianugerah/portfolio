"""The credentials the owner edits in the studio, each sealed under its own name."""

import json

from backend import db
from backend.config import ApiError
from backend.crypto import seal, unseal

# name: (is_secret, default). The order is the order the studio lists them in.
KNOWN: dict[str, tuple[bool, str | None]] = {
    "LLM_API_KEY": (True, None),
    "LLM_MODEL": (False, "gpt-oss:120b"),
    "LLM_BASE_URL": (False, "https://ollama.com/v1"),
    "SMTP_HOST": (False, "smtp.gmail.com"),
    "SMTP_PORT": (False, "587"),
    "SMTP_USER": (False, None),
    "SMTP_PASSWORD": (True, None),
    "CONTACT_TO": (False, None),
    "GCS_BUCKET": (False, None),
    "GCS_SERVICE_ACCOUNT": (True, None),
}

UNKNOWN_NAME = ApiError(404, "There is no credential with that name.")


def _rows() -> dict[str, dict]:
    return {row["name"]: row for row in db.select("credentials")}


def _values(rows: dict[str, dict]) -> dict[str, str | None]:
    values = {name: default for name, (_, default) in KNOWN.items()}
    for name, row in rows.items():
        if name in KNOWN:
            values[name] = unseal(row["blob"], row["nonce"], name).decode()
    values["CONTACT_TO"] = values["CONTACT_TO"] or values["SMTP_USER"]
    return values


def load() -> dict[str, str | None]:
    """Every credential in the clear, defaults applied. For the server's own use only."""
    return _values(_rows())


def describe() -> list[dict]:
    """What the studio may see: a secret says whether it is set and never what it is."""
    rows = _rows()
    values = _values(rows)
    return [
        {
            "name": name,
            "secret": is_secret,
            "set": name in rows,
            "value": None if is_secret else values[name],
            "updatedAt": rows[name]["updated_at"] if name in rows else None,
        }
        for name, (is_secret, _) in KNOWN.items()
    ]


def _validate(name: str, value: str) -> None:
    if name not in KNOWN:
        raise UNKNOWN_NAME
    if not value:
        raise ApiError(400, "A value is required. Delete the credential to clear it.")
    if name == "SMTP_PORT" and not value.isdigit():
        raise ApiError(400, "SMTP_PORT must be a number.")
    if name == "GCS_SERVICE_ACCOUNT":
        try:
            account = json.loads(value)
        except json.JSONDecodeError:
            account = None
        is_account = isinstance(account, dict) and account.get("type") == "service_account"
        if not is_account or not account.get("client_email") or not account.get("private_key"):
            raise ApiError(400, "That is not a service-account JSON key.")


def put(name: str, value: str, updated_at: str) -> None:
    value = value.strip()
    _validate(name, value)
    row = {"name": name, **seal(value.encode(), name), "updated_at": updated_at}
    db.insert("credentials", row, upsert=True)


def delete(name: str) -> None:
    if name not in KNOWN:
        raise UNKNOWN_NAME
    db.delete("credentials", {"name": f"eq.{name}"})
