from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Mapping, Sequence

from django.conf import settings
from django.core.mail import EmailMultiAlternatives


DEFAULT_ADMIN_EMAIL = "contact@revival-business.com"


@dataclass(frozen=True)
class OutboundEmail:
    subject: str
    body_text: str
    body_html: str | None = None
    to: Sequence[str] = (DEFAULT_ADMIN_EMAIL,)
    reply_to: Sequence[str] = ()
    attachments: Sequence[tuple[str, bytes, str]] = ()


def get_recipients() -> Sequence[str]:
    recipients = getattr(settings, "REVIVAL_CONTACT_RECIPIENTS", None)
    if recipients:
        if isinstance(recipients, str):
            return [r.strip() for r in recipients.split(",") if r.strip()]
        return list(recipients)
    return [DEFAULT_ADMIN_EMAIL]


def build_kv_body(title: str, kv: Mapping[str, object]) -> str:
    lines: list[str] = [title, "=" * len(title)]
    for k, v in kv.items():
        if v is None:
            continue
        lines.append(f"{k}: {v}")
    return "\n".join(lines).strip()


def send_to_contact_email(*, email: OutboundEmail) -> None:
    to_emails = get_recipients() if not email.to else email.to

    msg = EmailMultiAlternatives(
        subject=email.subject,
        body=email.body_text,
        to=list(to_emails),
        reply_to=list(email.reply_to) if email.reply_to else None,
    )

    if email.body_html:
        msg.attach_alternative(email.body_html, "text/html")

    for filename, content, mimetype in email.attachments:
        msg.attach(filename, content, mimetype)

    # Let exceptions bubble up so callers can return explicit errors.
    msg.send(fail_silently=False)

