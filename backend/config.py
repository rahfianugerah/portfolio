"""Environment access and the one error type every route raises."""

import logging
import os

log = logging.getLogger("backend")


class ApiError(Exception):
    """A failure the caller is told about, as a status and one readable sentence."""

    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status = status
        self.message = message


def env(name: str) -> str:
    """A required environment variable, read when it is used."""
    value = os.environ.get(name, "").strip()
    if not value:
        # The name goes to the log, never to the caller.
        log.error("%s is not set", name)
        raise ApiError(503, "The server is not configured for this yet.")
    return value


def allowed_origins() -> list[str]:
    raw = os.environ.get("ALLOWED_ORIGINS", "")
    return [origin.strip().rstrip("/") for origin in raw.split(",") if origin.strip()]


def is_deployed() -> bool:
    return bool(os.environ.get("VERCEL_ENV"))
