# Studio Backend

One FastAPI application behind `rahfi.pro` and `consulting.rahfi.pro`: the owner's studio, both assistants, the content and visitor counts both sites render, and the contact form. Browsers call it directly.

@README.md
@PRD.md
@../docs/memory/memory.rules.md

## Rules Come From the Vault, Not From Here

`../docs/rules/` and `../docs/memory/` are the human-authored control plane, and they win on conflict with anything inferred from this code. Read the memory for decisions already made before re-deriving them.

Never read the whole vault to answer a question about this code. Read this file, then `PRD.md` for intent, then `README.md`, then the specific rule you need.

## Rules That Bind

**Never read an environment file.** Not `.env`, not `.env.local`, not any `.env*` but `.env.example`. Do not print one, copy one, or pass one to a tool. A variable name comes from `.env.example`; a value is never needed.

**Never return or log a secret, or the owner's address.** A saved credential leaves `backend/vault.py` in the clear only for the server's own use, and `describe()` is the only shape a response may carry. A log line names a variable, an exception type, or a status, never a value. An SMTP error message can carry the recipient, which is why `backend/auth.py` and `backend/routes/public.py` log the exception's type only. A validation error names the field and never echoes the input.

**A Python file under `api/` becomes its own Vercel function.** Vercel turns every file in that directory into an endpoint, so a helper there is deployed as a second function with its own URL. `api/index.py` is one line that imports the application. All code goes in `backend/`.

**Neither site holds a secret.** Each holds `BACKEND_URL` and nothing else, per the 2026-10-05 amendment in `PRD.md`. When a site needs something a key would unlock, it becomes an endpoint here; the key never goes to the site.

**Migrations are forward-only and additive.** A schema change is a new file in `supabase/migrations/` with the next number, never an edit to one that exists. Add a column, backfill it, and drop the old one in a later migration. The deployment and the migration job start from the same push and neither waits for the other, so old code must run on the new schema and new code on the old.

**`backend/sanity_import.py` cannot be deleted after the import has run.** Its docstring says to delete it, and that is not yet safe: `backend/routes/content.py` builds `DOCUMENT_TYPES` from `sanity_import.SHAPES`, so removing the module breaks the application at import. Move `SHAPES` out first, then remove the module and its two routes in the same change, and update `API.md`.

**This branch is never merged with `main` or `dev`.** `backend-dev` and `backend-main` are one history, the Next.js site on `main` and `dev` is another, and they share no commit. Do not merge, rebase, or cherry-pick across them, and never pass `--allow-unrelated-histories`. A pull request from here targets `backend-main` by name, because the repository's default branch is the site's.

**Do not push to `backend-main`.** Work lands on `backend-dev` and is promoted by pull request. `backend-dev` is not deployed, so nothing here is rehearsed before production.

## Where Things Live

- **`backend/main.py` is the application.** It mounts the routers, sets CORS from `ALLOWED_ORIGINS`, and turns every failure into `{"error": "<sentence>"}`. Raise `ApiError(status, message)` from `backend/config.py`; do not build a response by hand.
- **`backend/routes/` holds every endpoint**, in six files: `public.py` (health, Ashley and Zoey, the contact form), `reads.py` (the public config, published documents and posts, the GitHub summary), `analytics.py` (the portfolio's visitor counts), `account.py` (sign-in, password, credentials), `files.py`, and `content.py` (the studio's posts, documents, the import).
- **`backend/auth.py` is the lock.** `require_owner` checks the session cookie against the database on every studio request and checks `Origin` on every write. A studio route that is not on a router carrying that dependency is open to anyone.
- **`backend/ratelimit.py` decides who a request is counted as**: the first `x-forwarded-for` entry, else the connection. No header a caller chooses is believed. Do not read a client address anywhere else, and call `enforce` on any new route a stranger can reach.
- **`backend/crypto.py` and `backend/vault.py` are the only places a secret is sealed or opened.** The list of credential names is `KNOWN` in `vault.py`.
- **`backend/db.py` is the only thing that talks to Supabase**, through its REST interface, with the service role key by default. Pass `anon=True` for what a stranger may already read or write, the public reads and the visitor counts, so row-level security still applies. Filters are PostgREST's own syntax.
- **`backend/storage.py` is the only thing that talks to the bucket.** Bytes never pass through a route: the browser uploads through a signed URL, because a Vercel function body stops at 4.5 MB.
- **`API.md` and `supabase/migrations/` are the contract.** An endpoint that changes is changed in `API.md` in the same commit.
- **`.env.example` lists every variable the code reads.** A new one is added there in the same commit that introduces it. The model, mail, and storage settings are not variables: they are saved in the studio and sealed in the `credentials` table.
- **`vercel.json` routes every path to `api/index`** and carries the `IS_BACKEND` test that keeps the site's Vercel project from building these branches. `DEPLOY.md` explains it.
- **The studio's pages are not here.** They are part of the site, on `main` and `dev`. A content type is described there as a form and here as a name in `DOCUMENT_TYPES` in `backend/routes/content.py`, which is `SHAPES` plus any type added since the import. The two must agree, or the backend answers `That is not a type of document.`

## How to Verify a Change

```powershell
.venv\Scripts\python -m pytest backend/tests -q
```

159 tests pass before a change, and every one passes after it. They use an in-memory stand-in for the database from `backend/tests/conftest.py`, so they need no credential and no network, and `backend/config.py` loads no environment file under `pytest`. On macOS or Linux the interpreter is `.venv/bin/python`.

A change to behavior comes with a test. A change to an endpoint comes with its line in `API.md`.

Do not start a second server to check something by hand: port 8000 is usually held by the owner's own, and the tests cover the same routes through the application directly.
