"""One streamed call to any OpenAI-compatible /chat/completions endpoint."""

import json
from collections.abc import Iterator

import httpx

from backend import vault
from backend.config import ApiError


def chat_url(base_url: str) -> str:
    """Accepts the base with or without its trailing /v1."""
    base = base_url.rstrip("/")
    if not base.endswith("/v1"):
        base += "/v1"
    return f"{base}/chat/completions"


def parse_fragment(line: str) -> str | None:
    """The text carried by one server-sent line, if it carries any."""
    if not line.startswith("data:"):
        return None
    payload = line[5:].strip()
    if not payload or payload == "[DONE]":
        return None
    choices = json.loads(payload).get("choices") or [{}]
    return (choices[0].get("delta") or {}).get("content") or None


def stream_chat(messages: list[dict[str, str]]) -> Iterator[str]:
    """Yield the answer as it arrives. Raises before the first fragment if refused."""
    saved = vault.load()
    if not saved["LLM_API_KEY"]:
        raise ApiError(503, "The assistant is not configured yet.")

    url = chat_url(saved["LLM_BASE_URL"])
    body = {"model": saved["LLM_MODEL"], "messages": messages, "stream": True, "max_tokens": 1000}
    headers = {"Authorization": f"Bearer {saved['LLM_API_KEY']}"}
    timeout = httpx.Timeout(60, connect=10)
    with httpx.stream("POST", url, json=body, headers=headers, timeout=timeout) as response:
        if response.status_code != 200:
            detail = response.read().decode(errors="replace")[:300]
            raise RuntimeError(f"The model endpoint answered {response.status_code}: {detail}")
        for line in response.iter_lines():
            fragment = parse_fragment(line)
            if fragment:
                yield fragment
