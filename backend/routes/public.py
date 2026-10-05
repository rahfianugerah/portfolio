"""What anyone may call: health, the two assistants, the contact form."""

import html
import json
import os
import re
import smtplib
from collections.abc import Iterator
from typing import Literal

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from backend import db, llm, mail, ratelimit
from backend.config import ApiError, log

router = APIRouter()

# A question is a sentence, not an essay.
MAX_MESSAGE_LENGTH = 1000
# An assistant's own answers come back as history and run longer, so a turn is trimmed, not refused.
MAX_TURN_LENGTH = 4000
MAX_TURNS = 12

RESUME_TYPES = (
    "profile", "organization", "role", "education", "achievement", "project", "certificate",
    "skillGroup",
)

ASHLEY_PROMPT = "\n".join(
    [
        "You are Ashley, the AI assistant on Naufal Rahfi Anugerah's portfolio.",
        "She/her. Warm, concise, professional. Never claim to be Rahfi himself.",
        "",
        "You answer questions about Rahfi and nothing else: his roles, his education, his",
        "projects, his certifications, his achievements and his skills. Anything outside",
        "that, including consulting engagements and pricing, you decline in one line and",
        "point at Rahfi Consulting, at consulting.rahfi.pro.",
        "",
        "Answer STRICTLY from the data below. If it is not there, say you do not know and",
        "suggest the contact page. Do not invent a date, a title, or a link.",
        "",
    ]
)

# Zoey's brief, by the key she is shown and the document type it is read from.
ZOEY_BRIEF = {
    "services": "consultingService",
    "principles": "principle",
    "process": "processStep",
    "pricing": "pricingTier",
    "engagements": "clientProject",
}
# An image URL or an icon name is nothing Zoey can use, and she would pay tokens to read it.
NOT_FOR_ZOEY = ("image", "icon")

# Word for word what the consulting site's own route used to send.
ZOEY_PROMPT = "\n".join(
    [
        "You are Zoey, the butler of Rahfi Consulting, which offers independent IT consulting.",
        "She/her. Courteous, precise, never pushy. Short answers unless asked for detail.",
        "",
        "You discuss two things only: the problem a visitor is trying to solve, and which",
        "engagement and price fits it. Anything else, including questions about Rahfi",
        "himself, his CV, or his personal projects, you decline in one line and point at",
        "the portfolio at rahfi.pro.",
        "",
        "How you work:",
        "1. If the problem is vague, ask one short question before recommending anything.",
        "2. Once you understand it, name the tier that fits and say in one sentence why.",
        "3. Recommend more than one tier when the work genuinely spans them, for example an",
        "   audit first and a sprint after, and say what each one buys.",
        "4. Quote a price only if it appears in the brief. Never invent or discount one.",
        "5. Never promise a timeline or an outcome on Rahfi's behalf. A brief through the",
        "   contact form is where anything becomes real.",
    ]
)


class Turn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class AssistantRequest(BaseModel):
    message: str
    history: list[Turn] = []


class ContactRequest(BaseModel):
    fullName: str
    email: str
    subject: str
    message: str
    honeypot: str | None = None
    captchaToken: str | None = None


@router.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


def build_resume(documents: list[dict]) -> dict:
    """The resume Ashley is told, with each role and course carrying its organization."""
    by_type: dict[str, list[dict]] = {name: [] for name in RESUME_TYPES}
    for document in documents:
        by_type[document["type"]].append({"id": document["id"], **document["data"]})
    organizations = {item["id"]: item for item in by_type["organization"]}

    def joined(item: dict, name_field: str) -> dict:
        organization = organizations.get(item.pop("organization", None), {})
        return {
            **item,
            name_field: organization.get("name"),
            "href": organization.get("website"),
            "logo": organization.get("logo"),
        }

    profile = by_type["profile"][0] if by_type["profile"] else None
    if profile:
        del profile["id"]
    return {
        "profile": profile,
        "roles": [joined(item, "company") for item in by_type["role"]],
        "education": [joined(item, "school") for item in by_type["education"]],
        "achievements": by_type["achievement"],
        "projects": by_type["project"],
        "certificates": by_type["certificate"],
        "skills": by_type["skillGroup"],
    }


def build_brief(documents: list[dict]) -> dict:
    """What Zoey is told: the consulting copy, the prices, and the engagements, in studio order."""
    key_for_type = {document_type: key for key, document_type in ZOEY_BRIEF.items()}
    brief: dict[str, list[dict]] = {key: [] for key in ZOEY_BRIEF}
    for document in documents:
        data = {field: value for field, value in document["data"].items() if field not in NOT_FOR_ZOEY}
        brief[key_for_type[document["type"]]].append(data)
    return brief


def question(body: AssistantRequest) -> str:
    """The visitor's message, or 400. Checked before the rate limit, so a bad request costs nothing."""
    message = body.message.strip()
    if not message:
        raise ApiError(400, "Nothing to answer.")
    if len(message) > MAX_MESSAGE_LENGTH:
        raise ApiError(400, f"Please keep a question under {MAX_MESSAGE_LENGTH} characters.")
    return message


def conversation(system: str, history: list[Turn], message: str) -> list[dict[str, str]]:
    """The prompt, the recent turns trimmed to size, and the new question."""
    turns = [turn for turn in history if turn.content.strip()][-MAX_TURNS:]
    return [
        {"role": "system", "content": system},
        *({"role": turn.role, "content": turn.content[:MAX_TURN_LENGTH]} for turn in turns),
        {"role": "user", "content": message},
    ]


def streamed_reply(messages: list[dict[str, str]]) -> StreamingResponse:
    """Answer with the model's text as it arrives, or with 502 if it never starts."""
    fragments = llm.stream_chat(messages)
    # The first fragment is pulled before answering, so a refusal is a status and a sentence
    # instead of an empty 200.
    try:
        first = next(fragments, None)
    except (httpx.HTTPError, RuntimeError, ValueError) as error:
        log.error("The model failed before answering: %r", error)
        first = None
    if first is None:
        raise ApiError(502, "The assistant could not answer just now. Try again in a moment.")

    def body() -> Iterator[str]:
        yield first
        try:
            yield from fragments
        except (httpx.HTTPError, RuntimeError, ValueError) as error:
            # The status line is long gone, so the text is the only place left to say so.
            log.error("The model stopped mid-answer: %r", error)
            yield "\n\n(The connection was lost. Please try again.)"

    return StreamingResponse(
        body(),
        media_type="text/plain; charset=utf-8",
        # Nothing downstream should buffer a stream whose point is arriving early.
        headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"},
    )


@router.post("/api/assistant/chat")
def assistant_chat(body: AssistantRequest, request: Request) -> StreamingResponse:
    message = question(body)
    ratelimit.enforce("assistant", ratelimit.client_ip(request), 20)

    documents = db.select(
        "documents",
        {"type": f"in.({','.join(RESUME_TYPES)})", "order": "sort_order.asc,data->>title.asc"},
    )
    system = f"{ASHLEY_PROMPT}Data: {json.dumps(build_resume(documents), ensure_ascii=False)}"
    return streamed_reply(conversation(system, body.history, message))


@router.post("/api/consulting/chat")
def consulting_chat(body: AssistantRequest, request: Request) -> StreamingResponse:
    message = question(body)
    ratelimit.enforce("consulting", ratelimit.client_ip(request), 20)

    documents = db.select(
        "documents",
        {"type": f"in.({','.join(ZOEY_BRIEF.values())})", "order": "sort_order.asc,created_at.asc"},
    )
    # Compact, as JSON.stringify wrote it when the prompt lived on the consulting site.
    brief = json.dumps(build_brief(documents), ensure_ascii=False, separators=(",", ":"))
    return streamed_reply(conversation(f"{ZOEY_PROMPT}\n\nBrief: {brief}", body.history, message))


def _contact_problem(body: ContactRequest) -> str | None:
    """The first rule the form breaks, in the words the form has always used."""
    if len(body.fullName) < 2:
        return "Name must be at least 2 characters"
    if len(body.fullName) > 100:
        return "Name must be less than 100 characters"
    if not re.fullmatch(r"[a-zA-Z\s'-]+", body.fullName):
        return "Name contains invalid characters"
    if len(body.email) > 100 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", body.email):
        return "Please enter a valid email address"
    if len(body.subject) < 5:
        return "Subject must be at least 5 characters"
    if len(body.subject) > 200:
        return "Subject must be less than 200 characters"
    if len(body.message) < 10:
        return "Message must be at least 10 characters"
    if len(body.message) > 2000:
        return "Message must be less than 2000 characters"
    return None


def _is_bot(captcha_token: str | None) -> bool:
    """reCAPTCHA v3's verdict. An unreachable Google does not block a real message."""
    secret = os.environ.get("RECAPTCHA_SECRET_KEY", "").strip()
    if not captcha_token or not secret:
        return False
    try:
        verdict = httpx.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": secret, "response": captcha_token},
            timeout=10,
        ).json()
    except (httpx.HTTPError, ValueError) as error:
        log.error("reCAPTCHA could not be reached: %r", error)
        return False
    score = verdict.get("score")
    return not verdict.get("success") or (score is not None and score < 0.5)


def _contact_html(body: ContactRequest, subject: str, ip: str) -> str:
    # Every value is a stranger's, and this is rendered by a mail client.
    values = (body.fullName, body.email, subject, body.message)
    name, email, subject, message = (html.escape(value) for value in values)
    return f"""
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333; border-bottom: 2px solid #0a0a0a; padding-bottom: 10px;">
    New Contact Form Submission
  </h2>
  <div style="margin: 20px 0;">
    <p style="margin: 10px 0;"><strong>From:</strong> {name}</p>
    <p style="margin: 10px 0;">
      <strong>Email:</strong>
      <a href="mailto:{email}" style="color: #0066cc;">{email}</a>
    </p>
    <p style="margin: 10px 0;"><strong>Subject:</strong> {subject}</p>
  </div>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #333;">Message:</h3>
    <p style="white-space: pre-wrap; line-height: 1.6; color: #555;">{message}</p>
  </div>
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px;">
    <p>Submitted from your portfolio contact form</p>
    <p>IP: {html.escape(ip)}</p>
  </div>
</div>
"""


@router.post("/api/contact")
def contact(body: ContactRequest, request: Request) -> dict:
    # A field no person can see was filled in.
    if body.honeypot:
        raise ApiError(400, "Invalid submission")
    problem = _contact_problem(body)
    if problem:
        raise ApiError(400, problem)
    ip = ratelimit.client_ip(request)
    ratelimit.enforce("contact", ip, 3)
    if _is_bot(body.captchaToken):
        raise ApiError(400, "Bot detection failed. Please try again.")

    # A header cannot hold a line break.
    subject = " ".join(body.subject.split())
    text = f"From: {body.fullName} <{body.email}>\nSubject: {subject}\n\n{body.message}\n\nIP: {ip}"
    try:
        mail.send(
            f"Portfolio Contact: {subject}",
            text,
            html=_contact_html(body, subject, ip),
            reply_to=body.email,
        )
    except (smtplib.SMTPException, OSError) as error:
        # The type only: an SMTP error message can carry the recipient's address.
        log.error("The contact message could not be sent: %s", type(error).__name__)
        raise ApiError(502, "The message could not be sent. Please try again later.") from error
    return {"success": "Message sent successfully! I'll get back to you soon."}
