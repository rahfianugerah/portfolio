"""Whose address a request is counted against."""

from types import SimpleNamespace

from backend.ratelimit import client_ip


def _request(**headers: str) -> SimpleNamespace:
    return SimpleNamespace(headers=headers, client=SimpleNamespace(host="10.0.0.9"))


def test_stated_address_is_believed_with_the_service_key(monkeypatch):
    monkeypatch.setenv("STUDIO_SERVICE_KEY", "the-key")
    request = _request(**{"x-client-ip": "203.0.113.7", "x-service-key": "the-key", "x-forwarded-for": "198.51.100.1"})
    assert client_ip(request) == "203.0.113.7"


def test_stated_address_is_ignored_without_the_service_key(monkeypatch):
    # Otherwise a caller could name a fresh address per request and never be limited.
    monkeypatch.setenv("STUDIO_SERVICE_KEY", "the-key")
    for key in ("", "wrong"):
        request = _request(**{"x-client-ip": "203.0.113.7", "x-service-key": key, "x-forwarded-for": "198.51.100.1, 10.1.1.1"})
        assert client_ip(request) == "198.51.100.1"


def test_an_unset_service_key_trusts_nobody(monkeypatch):
    monkeypatch.delenv("STUDIO_SERVICE_KEY", raising=False)
    request = _request(**{"x-client-ip": "203.0.113.7", "x-service-key": ""})
    assert client_ip(request) == "10.0.0.9"
