import base64

import pytest
from cryptography.exceptions import InvalidTag

from backend import crypto
from backend.config import ApiError


def test_seal_round_trip(fake_db):
    sealed = crypto.seal(b"secret value", "row-1")
    assert crypto.unseal(sealed["blob"], sealed["nonce"], "row-1") == b"secret value"
    assert sealed["key_version"] == 1


def test_seal_uses_a_fresh_nonce_every_time(fake_db):
    assert crypto.seal(b"same", "row")["nonce"] != crypto.seal(b"same", "row")["nonce"]


def test_tampered_blob_fails(fake_db):
    sealed = crypto.seal(b"secret value", "row-1")
    raw = bytearray(base64.b64decode(sealed["blob"]))
    raw[0] ^= 1
    with pytest.raises(InvalidTag):
        crypto.unseal(base64.b64encode(bytes(raw)).decode(), sealed["nonce"], "row-1")


def test_wrong_associated_data_fails(fake_db):
    sealed = crypto.seal(b"secret value", "row-1")
    with pytest.raises(InvalidTag):
        crypto.unseal(sealed["blob"], sealed["nonce"], "row-2")


def test_key_that_is_not_32_bytes_is_rejected(fake_db, monkeypatch):
    monkeypatch.setenv("STUDIO_ENCRYPTION_KEY", base64.b64encode(b"k" * 16).decode())
    with pytest.raises(ApiError) as raised:
        crypto.seal(b"x", "row")
    assert raised.value.status == 503


def test_password_verifies_only_when_right(fake_db):
    sealed = crypto.hash_password("correct horse battery", "owner-1")
    assert crypto.verify_password(sealed["blob"], sealed["nonce"], "owner-1", "correct horse battery")
    assert not crypto.verify_password(sealed["blob"], sealed["nonce"], "owner-1", "wrong password!")


def test_password_digest_is_bound_to_its_owner(fake_db):
    sealed = crypto.hash_password("correct horse battery", "owner-1")
    assert not crypto.verify_password(sealed["blob"], sealed["nonce"], "owner-2", "correct horse battery")


def test_no_stored_digest_never_verifies(fake_db):
    assert not crypto.verify_password(None, None, "", "anything at all")
