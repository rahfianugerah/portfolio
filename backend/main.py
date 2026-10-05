"""The application: routers, CORS, and the one shape every error takes."""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google.api_core.exceptions import GoogleAPIError
from google.auth.exceptions import GoogleAuthError
from starlette.exceptions import HTTPException

from backend.config import ApiError, allowed_origins, log
from backend.routes import account, analytics, content, files, public, reads

# The interactive docs would publish the studio's whole surface to anyone who asked.
app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

ROUTERS = (
    public.router, reads.router, analytics.router, account.open_router, account.router, files.router,
    content.router,
)
for router in ROUTERS:
    app.include_router(router)


def _error(status: int, message: str) -> JSONResponse:
    return JSONResponse({"error": message}, status_code=status)


@app.exception_handler(ApiError)
def handle_api_error(request: Request, error: ApiError) -> JSONResponse:
    return _error(error.status, error.message)


@app.exception_handler(RequestValidationError)
def handle_validation_error(request: Request, error: RequestValidationError) -> JSONResponse:
    # Names the field and never echoes the input, which may be a password.
    first = error.errors()[0]
    field = ".".join(str(part) for part in first["loc"][1:]) or "body"
    return _error(400, f"{field}: {first['msg']}.")


@app.exception_handler(HTTPException)
def handle_http_error(request: Request, error: HTTPException) -> JSONResponse:
    return _error(error.status_code, str(error.detail))


@app.exception_handler(GoogleAPIError)
@app.exception_handler(GoogleAuthError)
def handle_storage_error(request: Request, error: Exception) -> JSONResponse:
    log.error("Storage failed on %s %s: %r", request.method, request.url.path, error)
    return _error(502, "Storage refused the request.")


@app.exception_handler(Exception)
def handle_unexpected_error(request: Request, error: Exception) -> JSONResponse:
    log.error("Unhandled failure on %s %s", request.method, request.url.path, exc_info=error)
    return _error(500, "Something went wrong. Please try again.")
