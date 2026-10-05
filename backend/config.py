"""Environment access and the one error type every route raises."""

import logging
import os
import sys

log = logging.getLogger("backend")

# Vercel injects the environment. Locally uvicorn does not, so the same two files Next reads
# are loaded here, .env.local first because a value already set is never overridden. The
# import is optional on purpose: python-dotenv is a development requirement and is absent
# from the deployed function.
#
# Never under pytest: a test that reached a real database because a real key happened to be
# on disk would be a test that writes to production.
if not os.environ.get("VERCEL_ENV") and "pytest" not in sys.modules:
    try:
        from dotenv import load_dotenv

        load_dotenv(".env.local")
        load_dotenv(".env")
    except ImportError:
        pass


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
