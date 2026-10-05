from datetime import timedelta

import pytest

from backend import auth, crypto, mail
from backend.config import ApiError

EMAIL = "owner@example.test"
PASSWORD = "a long enough password"


def add_owner(fake_db, password: str | None = PASSWORD) -> dict:
    owner = fake_db.insert(
        "studio_owner",
        {
            "id": "owner-1",
            "email": EMAIL,
            "password_blob": None,
            "password_nonce": None,
            "failed_attempts": 0,
            "locked_until": None,
        },
    )
    if password:
        sealed = crypto.hash_password(password, owner["id"])
        fake_db.update(
            "studio_owner", {}, {"password_blob": sealed["blob"], "password_nonce": sealed["nonce"]}
        )
    return owner


def request_code(fake_db, monkeypatch) -> str:
    sent = {}
    monkeypatch.setattr(mail, "send", lambda subject, text, **kwargs: sent.update(text=text, **kwargs))
    auth.send_otp()
    return sent["text"].split("\n")[0]


def failure(action) -> ApiError:
    with pytest.raises(ApiError) as raised:
        action()
    return raised.value


def test_login_stores_only_the_hash_of_the_token(fake_db):
    add_owner(fake_db)
    token = auth.login(EMAIL, PASSWORD)
    [session] = fake_db.tables["studio_sessions"]
    assert session["token_hash"] == crypto.sha256_hex(token)
    assert token not in str(session)


def test_wrong_email_and_wrong_password_fail_identically(fake_db):
    add_owner(fake_db)
    wrong_password = failure(lambda: auth.login(EMAIL, "not the password"))
    wrong_email = failure(lambda: auth.login("someone@else.test", PASSWORD))
    assert (wrong_password.status, wrong_password.message) == (wrong_email.status, wrong_email.message)
    assert wrong_password.status == 401


def test_five_failures_lock_out_even_the_right_password(fake_db):
    add_owner(fake_db)
    for _ in range(5):
        failure(lambda: auth.login(EMAIL, "not the password"))
    assert failure(lambda: auth.login(EMAIL, PASSWORD)).message == "Invalid email or password."
    assert not fake_db.tables["studio_sessions"]


def test_lock_ends_when_its_time_has_passed(fake_db):
    add_owner(fake_db)
    past = (auth.now() - timedelta(seconds=1)).isoformat()
    fake_db.update("studio_owner", {}, {"locked_until": past})
    assert auth.login(EMAIL, PASSWORD)


def test_otp_mail_holds_the_code_and_its_lifetime_only(fake_db, monkeypatch):
    add_owner(fake_db)
    sent = {}
    monkeypatch.setattr(mail, "send", lambda subject, text, **kw: sent.update(subject=subject, text=text, **kw))
    auth.send_otp()
    code = sent["text"].split("\n")[0]
    assert code.isdigit() and len(code) == 6
    assert sent["text"] == f"{code}\n\nThis code is valid for 10 minutes."
    assert EMAIL not in sent["subject"] + sent["text"]
    assert sent["to"] == EMAIL


def test_otp_is_stored_as_a_hash(fake_db, monkeypatch):
    add_owner(fake_db)
    code = request_code(fake_db, monkeypatch)
    [otp] = fake_db.tables["studio_otps"]
    assert otp["code_hash"] == crypto.sha256_hex(code)
    assert code not in str(otp)


def test_otp_sets_the_first_password_and_revokes_sessions(fake_db, monkeypatch):
    add_owner(fake_db)
    auth.login(EMAIL, PASSWORD)
    code = request_code(fake_db, monkeypatch)
    auth.reset_password(code, "a brand new password")
    assert all(session["revoked_at"] for session in fake_db.tables["studio_sessions"])
    assert auth.login(EMAIL, "a brand new password")


def test_otp_is_single_use(fake_db, monkeypatch):
    add_owner(fake_db)
    code = request_code(fake_db, monkeypatch)
    auth.reset_password(code, "a brand new password")
    assert failure(lambda: auth.reset_password(code, "yet another password")).status == 400


def test_expired_otp_is_refused(fake_db, monkeypatch):
    add_owner(fake_db)
    code = request_code(fake_db, monkeypatch)
    past = (auth.now() - timedelta(seconds=1)).isoformat()
    fake_db.update("studio_otps", {}, {"expires_at": past})
    assert failure(lambda: auth.reset_password(code, "a brand new password")).message == "That code is not valid."


def test_otp_dies_after_five_wrong_attempts(fake_db, monkeypatch):
    add_owner(fake_db)
    code = request_code(fake_db, monkeypatch)
    wrong = "000000" if code != "000000" else "111111"
    for _ in range(5):
        failure(lambda: auth.reset_password(wrong, "a brand new password"))
    assert failure(lambda: auth.reset_password(code, "a brand new password")).status == 400


def test_a_new_otp_retires_the_old_one(fake_db, monkeypatch):
    add_owner(fake_db)
    old_code = request_code(fake_db, monkeypatch)
    new_code = request_code(fake_db, monkeypatch)
    if old_code != new_code:
        failure(lambda: auth.reset_password(old_code, "a brand new password"))
    auth.reset_password(new_code, "a brand new password")


def test_short_password_is_refused(fake_db, monkeypatch):
    add_owner(fake_db)
    code = request_code(fake_db, monkeypatch)
    assert failure(lambda: auth.reset_password(code, "too short")).status == 400
    assert fake_db.tables["studio_otps"][0]["used_at"] is None


def test_reset_lifts_a_lock(fake_db, monkeypatch):
    add_owner(fake_db)
    for _ in range(5):
        failure(lambda: auth.login(EMAIL, "not the password"))
    auth.reset_password(request_code(fake_db, monkeypatch), "a brand new password")
    assert auth.login(EMAIL, "a brand new password")


def test_no_owner_sends_nothing(fake_db, monkeypatch):
    monkeypatch.setattr(mail, "send", lambda *args, **kwargs: pytest.fail("mail was sent"))
    auth.send_otp()
    assert not fake_db.tables["studio_otps"]
