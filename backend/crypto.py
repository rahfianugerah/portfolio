"""Argon2id for the password, AES-256-GCM for everything kept at rest."""

import base64
import binascii
import hashlib
import os

from argon2 import PasswordHasher
from argon2.exceptions import Argon2Error, InvalidHashError
from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from backend.config import ApiError, env, log

KEY_VERSION = 1

_hasher = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=4)

# The digest of a discarded random password, verified when there is no real one to check,
# so a wrong address costs the same time as a wrong password.
_DUMMY_DIGEST = "$argon2id$v=19$m=65536,t=3,p=4$14YtagEek7hOOHy5+7bC9w$7OZpiU5iu2pX2647sFAehraAvp85yUjOx6b/4Ura1iI"


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def _key() -> bytes:
    try:
        key = base64.b64decode(env("STUDIO_ENCRYPTION_KEY"), validate=True)
    except binascii.Error:
        key = b""
    # 16 bytes would silently give AES-128.
    if len(key) != 32:
        log.error("STUDIO_ENCRYPTION_KEY must be 32 bytes, base64 encoded")
        raise ApiError(503, "The server is not configured for this yet.")
    return key


def seal(plaintext: bytes, associated: str) -> dict[str, str | int]:
    """Encrypt under a fresh nonce, bound to the row named by associated."""
    nonce = os.urandom(12)
    blob = AESGCM(_key()).encrypt(nonce, plaintext, associated.encode())
    return {
        "blob": base64.b64encode(blob).decode(),
        "nonce": base64.b64encode(nonce).decode(),
        "key_version": KEY_VERSION,
    }


def unseal(blob: str, nonce: str, associated: str) -> bytes:
    """Raises cryptography's InvalidTag when the blob, nonce, key or row do not match."""
    return AESGCM(_key()).decrypt(
        base64.b64decode(nonce), base64.b64decode(blob), associated.encode()
    )


def hash_password(password: str, owner_id: str) -> dict[str, str | int]:
    return seal(_hasher.hash(password).encode(), owner_id)


def verify_password(blob: str | None, nonce: str | None, owner_id: str, password: str) -> bool:
    """Always runs one Argon2 verification, with or without a stored digest."""
    digest = _DUMMY_DIGEST
    is_real = False
    if blob and nonce:
        try:
            digest = unseal(blob, nonce, owner_id).decode()
            is_real = True
        except (InvalidTag, ValueError):
            log.error("The stored password digest could not be opened")
    try:
        _hasher.verify(digest, password)
    except (Argon2Error, InvalidHashError):
        return False
    return is_real
