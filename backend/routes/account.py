"""Signing in and out, the password, and the credentials vault."""

from fastapi import APIRouter, Depends, Request, Response
from pydantic import BaseModel

from backend import auth, ratelimit, storage, vault

open_router = APIRouter(prefix="/api/studio")
router = APIRouter(prefix="/api/studio", dependencies=[Depends(auth.require_owner)])


class LoginRequest(BaseModel):
    email: str
    password: str


class ResetRequest(BaseModel):
    code: str
    newPassword: str


class ChangeRequest(BaseModel):
    currentPassword: str
    newPassword: str


class CredentialValue(BaseModel):
    value: str


@open_router.post("/login", status_code=204)
def login(body: LoginRequest, request: Request, response: Response) -> None:
    ratelimit.enforce("login", ratelimit.client_ip(request), 10)
    auth.set_cookie(response, auth.login(body.email, body.password))


@open_router.post("/password/otp", status_code=202)
def send_otp(request: Request) -> dict:
    ratelimit.enforce("otp", ratelimit.client_ip(request), 3)
    auth.send_otp()
    return {"message": "If an owner account exists, a code was sent to its email."}


@open_router.post("/password/reset", status_code=204)
def reset_password(body: ResetRequest, request: Request) -> None:
    ratelimit.enforce("reset", ratelimit.client_ip(request), 10)
    auth.reset_password(body.code, body.newPassword)


@router.post("/logout", status_code=204)
def logout(response: Response, session: dict = Depends(auth.require_owner)) -> None:
    auth.logout(session)
    auth.clear_cookie(response)


@router.get("/me")
def me(session: dict = Depends(auth.require_owner)) -> dict:
    return {"authenticated": True, "passwordSet": auth.has_password(session)}


@router.post("/password/change", status_code=204)
def change_password(
    body: ChangeRequest, response: Response, session: dict = Depends(auth.require_owner)
) -> None:
    auth.change_password(session, body.currentPassword, body.newPassword)
    # Every session was just revoked, this one included.
    auth.clear_cookie(response)


@router.get("/credentials")
def list_credentials() -> list[dict]:
    return vault.describe()


@router.put("/credentials/{name}", status_code=204)
def put_credential(name: str, body: CredentialValue) -> None:
    vault.put(name, body.value, auth.now().isoformat())
    if name.startswith("GCS_"):
        storage.allow_browser_uploads()


@router.delete("/credentials/{name}", status_code=204)
def delete_credential(name: str) -> None:
    vault.delete(name)
