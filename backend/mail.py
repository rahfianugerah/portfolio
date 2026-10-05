"""Outgoing mail over SMTP with STARTTLS."""

import os
import smtplib
import ssl
from email.message import EmailMessage

from backend import vault
from backend.config import ApiError


def _settings() -> dict[str, str]:
    """The studio's SMTP settings, or the environment's Gmail pair until those exist."""
    saved = vault.load()
    if saved["SMTP_USER"] and saved["SMTP_PASSWORD"]:
        return {
            "host": saved["SMTP_HOST"],
            "port": saved["SMTP_PORT"],
            "user": saved["SMTP_USER"],
            "password": saved["SMTP_PASSWORD"],
            "contact_to": saved["CONTACT_TO"],
        }
    user = os.environ.get("GMAIL_USER", "").strip()
    password = os.environ.get("GMAIL_APP_PASSWORD", "").strip()
    if not user or not password:
        raise ApiError(503, "Mail is not configured.")
    return {
        "host": "smtp.gmail.com",
        "port": "587",
        "user": user,
        "password": password,
        "contact_to": saved["CONTACT_TO"] or user,
    }


def send(
    subject: str,
    text: str,
    *,
    to: str | None = None,
    html: str | None = None,
    reply_to: str | None = None,
) -> None:
    """Send one message. Without a recipient it goes to the contact address."""
    settings = _settings()
    message = EmailMessage()
    message["From"] = settings["user"]
    message["To"] = to or settings["contact_to"]
    message["Subject"] = subject
    if reply_to:
        message["Reply-To"] = reply_to
    message.set_content(text)
    if html:
        message.add_alternative(html, subtype="html")

    with smtplib.SMTP(settings["host"], int(settings["port"]), timeout=15) as smtp:
        smtp.starttls(context=ssl.create_default_context())
        smtp.login(settings["user"], settings["password"])
        smtp.send_message(message)
