# API

The backend is one FastAPI application, `backend/`, deployed as a Vercel Python function through `api/index.py`, in a Vercel project of its own. It serves two sites, `rahfi.pro` and `consulting.rahfi.pro`, and belongs to neither.

| Item | Value |
| :- | :- |
| Base URL, production | `https://api.rahfi.pro`, deployed from `backend-main` |
| Base URL, development | `http://127.0.0.1:8000`, started with `.venv\Scripts\python -m uvicorn api.index:app --reload --port 8000` |
| Base path | `/api`. Every route is under it, and any other path is `404 {"error": "Not Found"}` |

**A browser reaches it through the portfolio, not directly.** The portfolio forwards its own `/api/*` paths to the same path here, so a page on `rahfi.pro` calls `/api/studio/me` on its own origin and this backend answers. The studio cookie is therefore first-party on `rahfi.pro`, and the `Origin` this backend sees is the site's. The consulting site's server calls `/api/llm/chat` at the base URL directly.

The portfolio answers a few `/api` paths itself and does not forward them. Those are the site's, are documented with the site, and are not part of this API. **A new path here must not reuse one of them**, because the site answers first and this backend never sees the request.

## Table of Contents

1. [What Every Reply Has in Common](#what-every-reply-has-in-common)
2. [Who May Call What](#who-may-call-what)
3. [Session](#session)
4. [Public](#public)
5. [Studio: Authentication](#studio-authentication)
6. [Studio: Credentials](#studio-credentials)
7. [Studio: Files](#studio-files)
8. [Studio: Posts](#studio-posts)
9. [Studio: Documents](#studio-documents)
10. [Studio: One-Time Import From Sanity](#studio-one-time-import-from-sanity)
11. [Reading Published Content](#reading-published-content)
12. [Environment](#environment)
13. [Known Limitations](#known-limitations)

## What Every Reply Has in Common

Every body is JSON unless stated. Every error is `{"error": "<sentence a person can read>"}` with a meaningful status. Nothing ever returns a stored secret. The interactive documentation and the OpenAPI document are switched off, because they would publish the studio's whole surface to anyone who asked.

These statuses can come from any endpoint, so the sections below do not repeat them:

| Status | When | `error` |
| :- | :- | :- |
| `400` | The body or a parameter is malformed: a missing field, a wrong type, an id that is not a UUID | `<field>: <reason>.` The field is named and the input is never echoed, because it may be a password |
| `429` | A rate limit is spent | `Too many requests. Please come back in N minute(s).` |
| `502` | Supabase refused a read or a write | `The database refused the request.` |
| `502` | Google Cloud Storage refused, or rejected the service account | `Storage refused the request.` |
| `503` | A required environment variable is missing or malformed | `The server is not configured for this yet.` |
| `503` | A rate limit could not be read. The limit fails closed | `This is unavailable just now. Please try again later.` |
| `500` | Anything unexpected | `Something went wrong. Please try again.` |

Every rate limit is per hour and per visitor, counted in Postgres by `check_rate_limit`. Which address counts as the visitor is decided by the rule under "Who May Call What". It is stored only as a SHA-256.

On Vercel every reply also carries `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Strict-Transport-Security`, and `X-Robots-Tag: noindex, nofollow, noai, noimageai`, set by `vercel.json`.

## Who May Call What

| Prefix | Caller | Check |
| :- | :- | :- |
| `/api/health`, `/api/assistant/chat`, `/api/contact` | Anyone | Rate limited per visitor, except `/api/health` |
| `/api/studio/login`, `/api/studio/password/otp`, `/api/studio/password/reset` | Anyone | Rate limited, identical failure replies |
| `/api/studio/**` (everything else) | The owner | `studio_session` cookie, checked on every request |
| `/api/llm/chat` | The consulting site's server | `x-service-key` header equal to `STUDIO_SERVICE_KEY` |

A studio request without a live session is `401 {"error": "Sign in to continue."}`.

A state-changing studio request (anything but `GET`, so signing out and changing the password included) must also carry an `Origin` the backend allows (`ALLOWED_ORIGINS`, comma separated), which is what stands in for a CSRF token on a `SameSite=Lax` cookie. Otherwise it is `403 {"error": "That request did not come from the studio."}`. The three open studio routes in the second row carry no session and are not subject to that check. The same list is the CORS allowlist, with credentials, for `GET`, `POST`, `PUT` and `DELETE`, with the `Content-Type` and `X-Service-Key` request headers.

### Two Headers the Sites Add

The portfolio's server adds two headers to every request it forwards, and overwrites whatever the browser sent under the same names:

| Header | Holds |
| :- | :- |
| `x-client-ip` | The visitor's address, as the site saw it |
| `x-service-key` | The site's copy of `STUDIO_SERVICE_KEY` |

**`x-client-ip` is believed only when `x-service-key` matches.** This backend is a deployment of its own, so the address that connects to it is the site's server and not the visitor. The site states the visitor's address, and the key is what makes the statement worth believing: accepted from anyone, the header would let a caller name a fresh address on every request and never be limited. The comparison is constant-time.

The visitor, for every rate limit, is the first of these that applies:

1. `x-client-ip`, when the request carries a matching `x-service-key`.
2. The first address in `X-Forwarded-For`.
3. The address of the connection.

A request with a wrong key, or with no key configured on the backend, is not refused for it. It falls to the second rule. So a site whose key does not match keeps working, and all of its visitors share one allowance.

**The service key is trusted for exactly two things**: stating the visitor's address, and calling `/api/llm/chat`. It does not open the studio. A request with the key and no session cookie is still `401` on every owner route.

`/api/llm/chat` is the one route that does not use the header. The consulting site's server states the visitor in the body, as `client_ip`, and the route requires the key outright.

## Session

`studio_session` is an opaque random token: `HttpOnly`, `Secure` on Vercel, `SameSite=Lax`, `Path=/`, 12 hours. The database holds its SHA-256 only. Signing out revokes it server side. Setting or changing the password revokes every session.

The cookie carries no `Domain`, so it belongs to whichever host the browser asked. Through the portfolio's forward that host is `rahfi.pro`, which is where the studio's pages are.

## Public

### `GET /api/health`

`200 {"status": "ok"}`

### `POST /api/assistant/chat`

Ashley, the portfolio's assistant. She is told the `profile`, `organization`, `role`, `education`, `achievement`, `project`, `certificate` and `skillGroup` documents and answers from nothing else.

Request `{"message": string (1..1000), "history": [{"role": "user"|"assistant", "content": string}]}`. History is cut to the last 12 turns and each turn to 4000 characters.

`200` is `text/plain; charset=utf-8`, streamed: the answer and nothing else. `400` an empty or too long message, `429` allowance spent (20 an hour per visitor), `503` no model key is saved, `502` the model refused before the first word.

A failure after the first word cannot change the status, so the text ends with `(The connection was lost. Please try again.)`.

### `POST /api/llm/chat`

The same model call for the consulting site, which writes its own system prompt.

Header `x-service-key`. Request `{"messages": [{"role": "system"|"user"|"assistant", "content": string}], "client_ip": string}`. The messages are forwarded whole: the caller bounds its own prompt.

Rate limited at 20 an hour per `client_ip`, in its own bucket. Same replies as above, plus `401` for a wrong or missing key and `400` for no messages or a blank `client_ip`.

### `POST /api/contact`

Request `{"fullName", "email", "subject", "message", "honeypot"?, "captchaToken"?}`. Same validation the form has always had: name 2..100 of letters, spaces, apostrophes and hyphens, email at most 100, subject 5..200, message 10..2000.

`200 {"success": "..."}`, `400` with the rule that was broken, `429` (3 an hour per visitor), `503` mail not configured, `502` the mail server refused.

A `captchaToken` is verified with reCAPTCHA v3 and a score under 0.5 is `400`. An unreachable Google does not block a message, and neither does a missing token. A filled `honeypot` is `400`.

The message goes to `CONTACT_TO` with the visitor's address as `Reply-To`.

## Studio: Authentication

### `POST /api/studio/login`

`{"email", "password"}` gives `204` and the cookie. Any failure is `401 {"error": "Invalid email or password."}`, identical whether the address, the password, or the lock is the cause. 10 attempts an hour per visitor.

**Every failed sign-in counts toward the lock, a wrong address included.** Five failures lock the account for 15 minutes, and during the lock the right password is refused too. A reset code lifts the lock, so a stranger who trips it cannot keep the owner out.

### `POST /api/studio/logout`

`204`, cookie cleared, session revoked.

### `GET /api/studio/me`

`200 {"authenticated": true, "passwordSet": true}` or `401`.

### `POST /api/studio/password/otp`

No body. Sends a six-digit code to the address in `studio_owner`, which a request can neither choose nor learn. Always `202 {"message": "If an owner account exists, a code was sent to its email."}`, whether or not the mail left. 3 an hour.

The code lives 10 minutes, is single use, and dies after 5 wrong attempts. Sending a new one retires the one before it.

### `POST /api/studio/password/reset`

`{"code": "123456", "newPassword": string (min 12)}` gives `204`, revokes every session, and lifts a lock. It does not sign in. 10 an hour.

A `newPassword` under 12 characters is `400 {"error": "A password needs at least 12 characters."}`, checked before the code is looked at, so it does not spend an attempt. Every other failure is `400 {"error": "That code is not valid."}`.

This is also how the first password is set.

### `POST /api/studio/password/change`

Owner only. `{"currentPassword", "newPassword"}` gives `204`, revokes every session including this one, and clears the cookie.

`400 {"error": "The current password is not correct."}` for a wrong `currentPassword`, and the same `400` as a reset for a `newPassword` under 12 characters.

## Studio: Credentials

Known names, in this order:

| Name | Secret | Default |
| :- | :- | :- |
| `LLM_API_KEY` | yes | |
| `LLM_MODEL` | no | `gpt-oss:120b` |
| `LLM_BASE_URL` | no | `https://ollama.com/v1` |
| `SMTP_HOST` | no | `smtp.gmail.com` |
| `SMTP_PORT` | no | `587` |
| `SMTP_USER` | no | |
| `SMTP_PASSWORD` | yes | |
| `CONTACT_TO` | no | the value of `SMTP_USER` |
| `GCS_BUCKET` | no | |
| `GCS_SERVICE_ACCOUNT` | yes | |

The model endpoint is any OpenAI-compatible `/chat/completions`. `LLM_BASE_URL` is accepted with or without its trailing `/v1`.

Each value is sealed with AES-256-GCM under `STUDIO_ENCRYPTION_KEY`, with its name bound in, before it reaches the database.

### `GET /api/studio/credentials`

`200 [{"name", "secret": bool, "set": bool, "value": string|null, "updatedAt": string|null}]`.

`value` is always `null` for a secret. For a name that is not a secret it is the saved value, or the default when nothing is saved, so **`set: false` with a `value` means the default is in use**. `set` is `true` only when a row is stored.

### `PUT /api/studio/credentials/{name}`

`{"value": string}` gives `204`. An unknown name is `404`. The value is trimmed, and `400` when it is empty, when `SMTP_PORT` is not a number, or when `GCS_SERVICE_ACCOUNT` does not parse as a service-account JSON key.

Saving `GCS_BUCKET` or `GCS_SERVICE_ACCOUNT` also tries to set the bucket's CORS so the allowed origins may `PUT` to it. **That attempt is best effort.** A refusal is logged and the reply is still `204`, because a service account that may write objects often may not update the bucket. Set the CORS by hand in that case, per `DEPLOY.md`. If Google rejects the key itself the reply is `502`, and the value is already saved.

### `DELETE /api/studio/credentials/{name}`

`204`. An unknown name is `404`.

## Studio: Files

Google Cloud Storage, presented as a drive. A path never starts with a slash; a folder path ends with one. A path holds no backslash, no empty segment, no `.` or `..`, and at most 1024 characters, or it is `400`. Bytes go from the browser straight to the bucket through a signed URL, because a Vercel function body stops at 4.5 MB.

Every endpoint here is `503 {"error": "Storage is not configured."}` until both storage credentials are saved.

### `GET /api/studio/files?prefix=photos/`

`200 {"prefix", "folders": ["photos/2026/"], "files": [{"path", "name", "size", "contentType", "updatedAt", "url"}]}`. `url` is the public address. An empty `prefix` lists the root.

### `POST /api/studio/files/upload-url`

`{"path", "contentType", "size"}` gives `200 {"url", "method": "PUT", "headers": {"Content-Type": "...", "x-goog-content-length-range": "0,26214400"}}`.

**The browser must send every header in `headers` with the `PUT`.** Both are part of what was signed, so the bucket refuses an upload that changes the type or leaves the range out, and the range is what makes the bucket itself refuse a body past the limit. The URL is good for 15 minutes.

Allowed: `image/png`, `image/jpeg`, `image/webp`, `image/gif`, `image/avif`, `application/pdf`, `text/markdown`. 25 MB at most. Otherwise `400`.

### `POST /api/studio/files/finalize`

`{"path"}`. Reads the first bytes of the object, or all of it for Markdown, and deletes it if they do not match its declared type. `200 {file}`, `400` when it was removed, `404` when nothing is at that path.

### `POST /api/studio/files/folder`

`{"path": "photos/2026/"}` gives `204`.

### `POST /api/studio/files/move`

`{"from", "to"}` gives `204`. Renaming is moving. A folder moves with its contents, and both paths must then end with a slash. `404` when nothing is at `from`, `400` for a folder moved into itself.

### `DELETE /api/studio/files?path=`

`204`. A folder path deletes what is under it. `404` for a file that does not exist.

## Studio: Posts

A post is `{"id", "slug", "title", "summary", "coverUrl", "tags": [], "bodyMd", "published", "publishedAt", "createdAt", "updatedAt"}`.

- `GET /api/studio/posts` lists every post, newest first, without `bodyMd`.
- `POST /api/studio/posts` creates one. `title` is required. `slug` is derived from `title` when omitted, and is always reduced to lowercase letters, digits and hyphens. `201 {post}`.
- `GET /api/studio/posts/{id}` gives `200 {post}` or `404`.
- `PUT /api/studio/posts/{id}` is partial: a field left out of the body is left alone. `200 {post}`, the post as it now stands, or `404`.
- `DELETE /api/studio/posts/{id}` gives `204`.
- `POST /api/studio/posts/parse` takes `{"markdown"}` and returns `{"title", "summary", "tags", "slug", "bodyMd"}` read from YAML front matter, so a dropped `.md` file fills the form. Front matter that is not valid YAML is `400`. It saves nothing.

Publishing sets `publishedAt` once: the date survives being unpublished and published again. A duplicate slug is `409`. An empty `title`, or a `slug` with no letter or digit in it, is `400`.

## Studio: Documents

A document is `{"id", "type", "data", "sortOrder", "updatedAt"}`.

- `GET /api/studio/documents?type=role` lists one type by `sortOrder`. Without `type` it returns every document, by type and then `sortOrder`.
- `POST /api/studio/documents` with `{"type", "data", "sortOrder"?}`, `201 {document}`. `sortOrder` is 100 when omitted.
- `PUT /api/studio/documents/{id}` with `{"data", "sortOrder"?}` replaces `data` whole. `200 {document}` or `404`.
- `DELETE /api/studio/documents/{id}` gives `204`.

`type` is one of the fifteen below, and anything else is `400`. A second `profile` is `409 {"error": "There is already a profile. Edit that one."}`. `data` is stored as given: its shape belongs to the page. Every image is a URL string.

| Type | `data` |
| :- | :- |
| `profile` (one row) | `name, initials, role, summary, location, locationLink, avatar, logo, social: [{name, url, icon, inNavbar}]` |
| `organization` | `name, website, logo` |
| `role` | `kind: "work"\|"leadership", organization: <document id>, title, location, start, end, badges: [], description: []` |
| `education` | `organization: <document id>, degree, start, end, description: []` |
| `achievement` | `title, issuer, dates, location, description, image, links: [{title, href}]` |
| `certificate` | `title, issuer, kind: "professional"\|"learning", categories: [], fileUrl, externalUrl` |
| `project` | `slug, title, status, description, technologies: [], image, video, gallery: [], readmeRepo, links: [{label, icon: "github"\|"globe", href}]` |
| `skillGroup` | `title, items: []` |
| `service` | `title, description` |
| `moment` | `image, alt, caption` |
| `quote` | `text, author, role, image` |
| `pageMeta` | `site: "portfolio"\|"consulting", route, title, description, heading, subtitle` |
| `clientProject` | `client, sector, year, summary, services: [], outcome, image` |
| `counter` | `label, value: number, suffix` |
| `pricingTier` | `name, price, cycle, description, features: [], recommended: boolean` |

The first fourteen come from `SHAPES` in `backend/sanity_import.py`, which is also what the import maps. `pricingTier` is newer than the old dataset, so it has nothing to import and is added to the list in `backend/routes/content.py`. Its `data` is whatever the studio form on the site sends.

## Studio: One-Time Import From Sanity

The dataset is public, so this needs a project id and no token. Storage must be configured first, because every image is copied into the bucket. Delete `backend/sanity_import.py` and these two routes once it has run, after moving `SHAPES` out of it: `backend/routes/content.py` reads that table for the list of document types.

- `GET /api/studio/import/sanity/plan?projectId=&dataset=` gives `200 [{"id", "type", "title"}]` for every importable document, posts included and drafts left out. `400` when the two are not a project id and a dataset, `502` when Sanity does not answer.
- `POST /api/studio/import/sanity/document` with `{"projectId", "dataset", "id"}` imports one: copies its images and files into the bucket under `imported/`, rewrites them to URLs, converts a post's Portable Text to Markdown, and upserts on a UUID derived from the Sanity id, so a second run changes nothing. A post arrives published. `200 {"id", "type"}`, where `id` is the new UUID. `404` when Sanity has no such document, `400` for a type or an asset that is not imported, `409` for a post whose slug is already taken, `502` when an asset could not be fetched.

The studio calls the second once per document, so one failure does not stop the rest.

## Reading Published Content

**No endpoint here serves published content.** The pages of both sites read `documents` and `posts` from Supabase's REST endpoint themselves, with the anon key, so a page renders whether or not this backend is up. What that key may read is fixed by row-level security in `supabase/migrations/0003_studio.sql`: every document, and a post only once it is published. The reading code lives with each site.

This backend is the only writer. It reaches the same tables with the service role key, which bypasses those policies.

## Environment

What this deployment reads, and nothing else. The variables the two sites read are documented with the sites.

| Name | Read by | Holds |
| :- | :- | :- |
| `SUPABASE_URL` | The code | The Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | The code | The backend's database access. Bypasses row-level security, and exists in this deployment only |
| `STUDIO_ENCRYPTION_KEY` | The code | 32 random bytes, base64. Seals the password digest and every credential |
| `STUDIO_SERVICE_KEY` | The code | The same value the two sites hold. Makes `x-client-ip` believable and opens `/api/llm/chat` |
| `ALLOWED_ORIGINS` | The code | `https://rahfi.pro,https://consulting.rahfi.pro`, plus `http://localhost:3000` for local work |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | The code | Mail fallback until SMTP is set in the studio, so the first reset code can be sent |
| `RECAPTCHA_SECRET_KEY` | The code | Verifies the contact form's captcha token. The matching site key is the portfolio's |
| `IS_BACKEND` | `vercel.json` only, on Vercel only | `1` in this Vercel project. It is how the repository's two projects ignore each other's branches. The code never reads it |

`VERCEL_ENV`, which Vercel sets, is what turns `Secure` on for the cookie and stops the backend looking for an environment file. Locally the backend loads `.env.local` and then `.env` from the working directory, through `python-dotenv`, which is a development requirement only. Under `pytest` it loads neither.

The model, mail, and storage settings are not in the environment. They are the credentials above, saved through this API.

## Known Limitations

- **A stranger can lock the owner out for 15 minutes.** Five wrong sign-ins from anywhere trip the lock, because counting only the right address would reveal it. A reset code lifts it.
- **The failure counters are read and then written.** Two simultaneous wrong sign-ins, or two wrong codes, can count as one. The per-visitor rate limit bounds what that is worth.
- **A move is a copy and then a delete.** A bucket has no rename, so a folder move that fails part way leaves some objects at both paths.
- **A failure in the middle of an answer is text, not a status.** The stream has already started with `200`.
- **Uploads are served at the size they were uploaded.** Nothing resizes an image between the bucket and the page.
- **The service account key is stored, sealed, in the database.** There is no keyless path to the bucket.
- **The service key is one shared value.** Whoever holds it can state any visitor address, which defeats the per-visitor limits, and can spend the model key through `/api/llm/chat`.
- **A mismatched service key fails quietly.** The site keeps working and every one of its visitors is counted as one, so the first sign is `429` for people who have asked nothing.
- **The base URL answers anyone.** Forwarding through the portfolio is how a browser is meant to arrive, not a wall, and a direct caller is held only by the checks in this document.
- **There is no version in the path.** The only callers are the two sites, and they change with it.
