# API

The backend is one FastAPI application, `backend/`, deployed as a Vercel Python function through `api/index.py`, in a Vercel project of its own. It serves two sites, `rahfi.pro` and `consulting.rahfi.pro`, and belongs to neither.

| Item | Value |
| :- | :- |
| Base URL, production | `https://api.rahfi.pro`, deployed from `backend-main` |
| Base URL, development | `http://localhost:8000`, started with `.venv\Scripts\python -m uvicorn api.index:app --reload --port 8000` |
| Base path | `/api`. Every route is under it, and any other path is `404 {"error": "Not Found"}` |

**Browsers call it directly.** Each site holds one setting, `BACKEND_URL`, and nothing secret. A page on `rahfi.pro` or `consulting.rahfi.pro` sends its requests straight to the base URL, the studio's with `credentials: "include"`. The two sites' servers call the public reads at the same address when they render a page. Nothing forwards `/api` and nothing adds a header on the way.

**Locally it is always `localhost`, never `127.0.0.1`.** The two are different sites to a browser, so a studio on `http://localhost:3000` would not send the cookie to `http://127.0.0.1:8000`.

## Table of Contents

1. [What Every Reply Has in Common](#what-every-reply-has-in-common)
2. [Who May Call What](#who-may-call-what)
3. [Session](#session)
4. [Public](#public)
5. [Public Reads](#public-reads)
6. [Visitor Counts](#visitor-counts)
7. [Removed](#removed)
8. [Studio: Authentication](#studio-authentication)
9. [Studio: Credentials](#studio-credentials)
10. [Studio: Files](#studio-files)
11. [Studio: Posts](#studio-posts)
12. [Studio: Documents](#studio-documents)
13. [Studio: One-Time Import From Sanity](#studio-one-time-import-from-sanity)
14. [Environment](#environment)
15. [Known Limitations](#known-limitations)

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

Every rate limit is per hour and per visitor, counted in Postgres by `check_rate_limit`. Which address counts as the visitor is decided by the rule under "Who Counts as the Visitor". It is stored only as a SHA-256.

On Vercel every reply also carries `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Strict-Transport-Security`, and `X-Robots-Tag: noindex, nofollow, noai, noimageai`, set by `vercel.json`.

## Who May Call What

| Prefix | Caller | Check |
| :- | :- | :- |
| `/api/health`, `/api/assistant/chat`, `/api/consulting/chat`, `/api/contact` | Anyone | Rate limited per visitor, except `/api/health` |
| `/api/public/**`, `/api/github/stats` | Anyone, and the sites' servers | Read only. Content is read with the anon key, so row-level security applies |
| `/api/analytics` | Anyone | Writes rate limited per visitor |
| `/api/studio/login`, `/api/studio/password/otp`, `/api/studio/password/reset` | Anyone | Rate limited, identical failure replies |
| `/api/studio/**` (everything else) | The owner | `studio_session` cookie, checked on every request |

A studio request without a live session is `401 {"error": "Sign in to continue."}`.

A state-changing studio request (anything but `GET`, so signing out and changing the password included) must also carry an `Origin` the backend allows (`ALLOWED_ORIGINS`, comma separated), which is what stands in for a CSRF token on a `SameSite=Lax` cookie. Otherwise it is `403 {"error": "That request did not come from the studio."}`. The open studio routes in the fourth row carry no session and are not subject to that check. The same list is the CORS allowlist, with credentials, for `GET`, `POST`, `PUT` and `DELETE`, with the `Content-Type` request header only. It is never `*`.

### Who Counts as the Visitor

For every rate limit, the visitor is the first address in `X-Forwarded-For`, or the address of the connection when there is none. Browsers connect to this deployment themselves, and Vercel overwrites `X-Forwarded-For` with whoever connected, so a caller cannot choose the address it is counted as. No other header is read for it: `x-client-ip` and `x-service-key` are ignored.

## Session

`studio_session` is an opaque random token: `HttpOnly`, `Secure` on Vercel, `SameSite=Lax`, `Path=/`, 12 hours. The database holds its SHA-256 only. Signing out revokes it server side. Setting or changing the password revokes every session.

The cookie carries no `Domain`, so it belongs to this backend's own host, `api.rahfi.pro`, and no other. The studio's pages are on `rahfi.pro`, which is the same site to a browser, so a `SameSite=Lax` cookie rides the studio's credentialed `fetch`. Locally the same holds for `localhost:3000` and `localhost:8000`, and does not for `127.0.0.1`.

## Public

### `GET /api/health`

`200 {"status": "ok"}`

### `POST /api/assistant/chat`

Ashley, the portfolio's assistant. She is told the `profile`, `organization`, `role`, `education`, `achievement`, `project`, `certificate` and `skillGroup` documents and answers from nothing else.

Request `{"message": string (1..1000), "history": [{"role": "user"|"assistant", "content": string}]}`. History is cut to the last 12 turns and each turn to 4000 characters.

`200` is `text/plain; charset=utf-8`, streamed: the answer and nothing else. `400` an empty or too long message, `429` allowance spent (20 an hour per visitor), `503` no model key is saved, `502` the model refused before the first word.

A failure after the first word cannot change the status, so the text ends with `(The connection was lost. Please try again.)`.

### `POST /api/consulting/chat`

Zoey, the consulting site's assistant. Request and replies exactly as `/api/assistant/chat`, with its own allowance of 20 an hour per visitor.

She is told the `consultingService`, `principle`, `processStep`, `pricingTier` and `clientProject` documents, in studio order, as a brief with the keys `services`, `principles`, `process`, `pricing` and `engagements`. Each document's `data` goes in as stored, without `image` or `icon`. She reads only the database: with no documents of a type, that part of her brief is empty.

### `POST /api/contact`

Request `{"fullName", "email", "subject", "message", "honeypot"?, "captchaToken"?}`. Same validation the form has always had: name 2..100 of letters, spaces, apostrophes and hyphens, email at most 100, subject 5..200, message 10..2000.

`200 {"success": "..."}`, `400` with the rule that was broken, `429` (3 an hour per visitor), `503` mail not configured, `502` the mail server refused.

A `captchaToken` is verified with reCAPTCHA v3 and a score under 0.5 is `400`. An unreachable Google does not block a message, and neither does a missing token. A filled `honeypot` is `400`.

The message goes to `CONTACT_TO` with the visitor's address as `Reply-To`.

## Public Reads

What both sites render. Every reply here carries `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=300`, except `/api/github/stats`, which carries `s-maxage=3600`. An error reply carries none of it, so a failure is not cached.

### `GET /api/public/config`

`200 {"recaptchaSiteKey": string|null}`, from `RECAPTCHA_SITE_KEY`. The site key is public by design; the contact form needs it to ask for a token.

### `GET /api/public/documents?type=a,b,c`

`200 [{"id", "type", "data", "sort_order"}]`, ordered by `sort_order` and then by creation. `type` is required, comma separated, and each one must be a type listed under "Studio: Documents", or the reply is `400 {"error": "That is not a type of document."}`.

Read with the anon key, so row-level security limits it as it limits any stranger.

### `GET /api/public/posts`

`200 [{"slug", "title", "summary", "cover_url", "published_at"}]`, published posts only, newest first. Read with the anon key.

### `GET /api/public/posts/{slug}`

`200 {"slug", "title", "summary", "cover_url", "published_at", "body_md"}`, or `404 {"error": "There is no published post with that slug."}` for a draft, a missing post, or a slug that is not lowercase letters, digits and hyphens. Read with the anon key.

### `GET /api/github/stats`

`200 {"user", "repos", "public_repos"}`: GitHub's own replies for the user `rahfianugerah` and his five most recently updated repositories, passed through, with `public_repos` repeated at the top level. `502 {"error": "GitHub could not be reached."}` when GitHub refuses or cannot be reached, `503` when `GITHUB_TOKEN` is not set.

## Visitor Counts

The portfolio's visit and project-click counts, in the `counters`, `daily_stats` and `sessions` tables from `0001_analytics_baseline.sql`. Read and written with the anon key, which those tables' policies were written for. Days are UTC dates. Every reply carries `Cache-Control: no-store`.

### `GET /api/analytics` and `GET /api/analytics?action=visit&session=<id>`

`200 {"success": true, "data": {"visitors", "projects", "delta24h", "delta7d", "sparkline": [7 numbers]}}`.

| Field | Is |
| :- | :- |
| `visitors` | The sum of every day's visits, or the running total in `counters` on the request that counted a visit |
| `projects` | The sum of every day's project clicks |
| `delta24h` | Today's visits |
| `delta7d` | Project clicks over the last seven days, today included |
| `sparkline` | Visits per day, six days ago first and today last |

With `action=visit` and a `session` of at most 200 characters, the session is recorded and, the first time it is seen, one visit is counted. A session is counted once however often it returns. A visit without a session counts nothing. A request with a session spends one of 60 writes an hour per visitor.

Any database failure is `500 {"success": false, "error": "Failed to fetch analytics", "fallbackMessage": "Data Unavailable"}`.

### `POST /api/analytics`

`{"type": "project-click"}` counts one click and answers `200 {"success": true, "data": {"visitors": 0, "projects": <running total>}}`. It spends from the same 60 writes an hour. Any other `type` is `200 {"success": true}` and changes nothing. A database failure is `500 {"success": false, "error": "Failed to update analytics"}`.

## Removed

| Path | Since | Instead |
| :- | :- | :- |
| `POST /api/llm/chat` | 2026-10-05 | `POST /api/consulting/chat`. The consulting site no longer writes a prompt or holds a key |

The `x-client-ip` and `x-service-key` headers are no longer read, and `STUDIO_SERVICE_KEY` is gone. A request that still sends them is treated like any other.

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

`type` is one of the eighteen below, and anything else is `400`. A second `profile` is `409 {"error": "There is already a profile. Edit that one."}`. `data` is stored as given: its shape belongs to the page. Every image is a URL string.

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
| `consultingService` | `title, body, icon: "code"\|"zap"\|"brain"\|"chart"\|"database"\|"cloud"` |
| `principle` | `title, body` |
| `processStep` | `step` (text, for example `01`), `title, body` |

The first fourteen come from `SHAPES` in `backend/sanity_import.py`, which is also what the import maps. The last four are newer than the old dataset, so they have nothing to import and are added to `DOCUMENT_TYPES` in `backend/routes/content.py`, the one list both the studio and the public read check against. Their `data` is whatever the studio form on the site sends. `0004_consulting_copy.sql` seeds the consulting site's copy into them once, per type, only while that type has no document.

## Studio: One-Time Import From Sanity

The dataset is public, so this needs a project id and no token. Storage must be configured first, because every image is copied into the bucket. Delete `backend/sanity_import.py` and these two routes once it has run, after moving `SHAPES` out of it: `backend/routes/content.py` reads that table for the list of document types.

- `GET /api/studio/import/sanity/plan?projectId=&dataset=` gives `200 [{"id", "type", "title"}]` for every importable document, posts included and drafts left out. `400` when the two are not a project id and a dataset, `502` when Sanity does not answer.
- `POST /api/studio/import/sanity/document` with `{"projectId", "dataset", "id"}` imports one: copies its images and files into the bucket under `imported/`, rewrites them to URLs, converts a post's Portable Text to Markdown, and upserts on a UUID derived from the Sanity id, so a second run changes nothing. A post arrives published. `200 {"id", "type"}`, where `id` is the new UUID. `404` when Sanity has no such document, `400` for a type or an asset that is not imported, `409` for a post whose slug is already taken, `502` when an asset could not be fetched.

The studio calls the second once per document, so one failure does not stop the rest.

## Environment

| Deployment | Variables |
| :- | :- |
| Portfolio frontend | `BACKEND_URL` |
| Consulting frontend | `BACKEND_URL` |
| This backend | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STUDIO_ENCRYPTION_KEY`, `ALLOWED_ORIGINS`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `RECAPTCHA_SECRET_KEY`, `RECAPTCHA_SITE_KEY`, `GITHUB_TOKEN`, `IS_BACKEND` |
| GitHub environment `supabase` | Secret `SUPABASE_DB_URL`, for the migrations only |

`BACKEND_URL` is this API's base URL and is not a secret. Neither site holds a key of any kind. What this deployment reads:

| Name | Read by | Holds |
| :- | :- | :- |
| `SUPABASE_URL` | The code | The Supabase project |
| `SUPABASE_ANON_KEY` | The code | The public key. Used for the public reads and the visitor counts, so row-level security still applies to them |
| `SUPABASE_SERVICE_ROLE_KEY` | The code | The backend's own database access, for the studio and the rate limits. Bypasses row-level security, and exists in this deployment only |
| `STUDIO_ENCRYPTION_KEY` | The code | 32 random bytes, base64. Seals the password digest and every credential |
| `ALLOWED_ORIGINS` | The code | `https://rahfi.pro,https://consulting.rahfi.pro`. Locally `http://localhost:3000,http://localhost:3001` |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | The code | Mail fallback until SMTP is set in the studio, so the first reset code can be sent |
| `RECAPTCHA_SECRET_KEY` | The code | Verifies the contact form's captcha token |
| `RECAPTCHA_SITE_KEY` | The code | The matching public site key, handed to the sites by `/api/public/config` |
| `GITHUB_TOKEN` | The code | Read access to GitHub's API for `/api/github/stats` |
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
- **The base URL answers anyone.** CORS decides which pages a browser lets read a reply; a direct caller is held only by the checks in this document.
- **A backend outage now reaches the pages.** Both sites read their content here. The consulting site falls back to the copy it shipped with; the portfolio has no such fallback.
- **The visitor counts are read and then written.** Two simultaneous visits can count as one, exactly as before the move.
- **The visitor totals come from at most 1000 days of rows per counter**, PostgREST's default page size, as before the move.
- **There is no version in the path.** The only callers are the two sites, and they change with it.
