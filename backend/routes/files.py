"""The drive. Every route here is the owner's."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from backend import auth, storage

router = APIRouter(prefix="/api/studio/files", dependencies=[Depends(auth.require_owner)])


class UploadRequest(BaseModel):
    path: str
    contentType: str
    size: int


class PathRequest(BaseModel):
    path: str


class MoveRequest(BaseModel):
    source: str = Field(alias="from")
    target: str = Field(alias="to")


@router.get("")
def list_files(prefix: str = "") -> dict:
    return storage.list_files(prefix)


@router.post("/upload-url")
def upload_url(body: UploadRequest) -> dict:
    return storage.upload_url(body.path, body.contentType, body.size)


@router.post("/finalize")
def finalize(body: PathRequest) -> dict:
    return storage.finalize(body.path)


@router.post("/folder", status_code=204)
def create_folder(body: PathRequest) -> None:
    storage.create_folder(body.path)


@router.post("/move", status_code=204)
def move(body: MoveRequest) -> None:
    storage.move(body.source, body.target)


@router.delete("", status_code=204)
def delete(path: str) -> None:
    storage.delete(path)
