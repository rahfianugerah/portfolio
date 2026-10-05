"""Whose address a request is counted against."""

from types import SimpleNamespace

from backend.ratelimit import client_ip


def _request(**headers: str) -> SimpleNamespace:
    return SimpleNamespace(headers=headers, client=SimpleNamespace(host="10.0.0.9"))


def test_the_first_forwarded_address_is_the_visitor():
    assert client_ip(_request(**{"x-forwarded-for": "198.51.100.1, 10.1.1.1"})) == "198.51.100.1"


def test_without_a_forwarded_address_the_connection_counts():
    assert client_ip(_request()) == "10.0.0.9"


def test_a_stated_address_is_ignored_whatever_key_comes_with_it():
    # Otherwise a caller could name a fresh address per request and never be limited.
    request = _request(**{"x-client-ip": "203.0.113.7", "x-service-key": "any", "x-forwarded-for": "198.51.100.1"})
    assert client_ip(request) == "198.51.100.1"
    assert client_ip(_request(**{"x-client-ip": "203.0.113.7"})) == "10.0.0.9"
