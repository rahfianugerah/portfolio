# Studio Backend

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.142-009688?logo=fastapi&logoColor=white)
![pytest](https://img.shields.io/badge/pytest-9-0A9EDC?logo=pytest&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Functions-000000?logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-2EA043)

One FastAPI application behind two sites, `rahfi.pro` and `consulting.rahfi.pro`. It serves the owner's studio (sign-in, a credential vault, a file manager on Google Cloud Storage, Markdown posts, content documents, a one-time import from Sanity), the portfolio assistant's chat, a model proxy for the consulting site, and the contact form. **It is the only deployment that holds the key which can write to the database**, and neither site does.

It exists as its own deployable because it used to ship inside the portfolio site: every site change redeployed it, and the consulting site reached its model through another site's deployment. Split out, it releases on its own branch, with its own environment, and a change to a page no longer restarts the thing that holds the secrets.

## Table of Contents

1. [Who Calls It, and How](#who-calls-it-and-how)
2. [Two Histories in One Repository](#two-histories-in-one-repository)
3. [Setup](#setup)
4. [Usage](#usage)
5. [Configuration](#configuration)
6. [Tests](#tests)
7. [Project Structure](#project-structure)
8. [What Is Sealed, and Who Is Believed](#what-is-sealed-and-who-is-believed)
9. [The First Run, in Order](#the-first-run-in-order)
10. [Known Limitations](#known-limitations)

## Who Calls It, and How

**A browser is never pointed at this backend.** The portfolio forwards its own `/api/*` paths here, so the browser only ever sees `rahfi.pro`.

```text
Browser > rahfi.pro (Next) > rewrite of /api/* > this backend > Supabase, with the service role key
                                                              > Google Cloud Storage
                                                              > the model endpoint
                                                              > the mail server

Browser > Google Cloud Storage                  file bytes, through a signed URL this backend issued
consulting.rahfi.pro (server) > this backend    the model proxy, with the service key
Pages of both sites > Supabase                  published content, with the anon key, not through here
```

| Caller | How it reaches the backend | What that buys |
| :- | :- | :- |
| A visitor's browser on `rahfi.pro` | The site rewrites `/api/*` to `${BACKEND_URL}/api/*` | The studio cookie is first-party on `rahfi.pro`, and the `Origin` the backend sees is the site's own. No cross-site cookie |
| The portfolio's server | Adds two headers to every request it forwards: the visitor's address and the service key | Rate limits count the visitor, not the site's server |
| The consulting site's server | Calls the model proxy directly, with the service key | One model key, saved once, serves both assistants |
| Pages rendering content | They do not call it. They read published rows from Supabase with the anon key | A page renders even when this backend is down |

The backend reaches four things: Supabase through its REST interface, Google Cloud Storage with a service account, any OpenAI-compatible model endpoint, and an SMTP server. The model key, the mail password, and the service account are not in its environment. The owner saves them in the studio, and they are sealed in the database.

Every endpoint is in [API.md](API.md). Deployment is in [DEPLOY.md](DEPLOY.md). The intent is in [PRD.md](PRD.md).

## Two Histories in One Repository

The repository `rahfianugerah/portfolio` holds two unrelated histories. They share a remote and nothing else.

| Branch | Holds | Deployed |
| :- | :- | :- |
| `main` | The Next.js site | Production, by the site's Vercel project |
| `dev` | The Next.js site | No |
| `backend-main` | This backend | Production, by the backend's Vercel project |
| `backend-dev` | This backend | No |

A change moves one way: local work, then `backend-dev`, then `backend-main` by pull request.

**`backend-dev` and `backend-main` are never merged with `main` or `dev`, in either direction.** The backend branches started as an orphan, so they share no commit with the site. Git refuses the merge with `fatal: refusing to merge unrelated histories`, and that refusal is the guard. Forcing it with `--allow-unrelated-histories` would put a Python application and a Next application in one tree again, and each Vercel project would start building the other's code.

The histories are separate because the two halves have nothing in common to merge: different runtimes, different dependency manifests, different reasons to release. Kept apart, a push to a site branch cannot change what the backend runs, and a push here cannot touch a page.

## Setup

Nothing is done for you. A fresh clone starts at step 1. Commands are written for PowerShell on Windows; on macOS or Linux the interpreter is `.venv/bin/python`.

**1. The code.** Clone the repository and switch to the backend's working branch.

```powershell
git clone https://github.com/rahfianugerah/portfolio.git portfolio-backend
cd portfolio-backend
git switch backend-dev
```

**The default branch is the site.** A plain clone lands on `main`, which has no `backend/` directory at all. If `backend/` is missing, you are on the wrong history.

**2. Environment.** A virtual environment in `.venv`, with the development requirements.

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements-dev.txt
```

**Install `requirements-dev.txt`, not `requirements.txt`.** The second is what Vercel installs, and it leaves out `uvicorn`, `pytest`, and `python-dotenv`. Without `python-dotenv` the backend starts and loads no environment file, with no warning, because the import is optional on purpose: the package is absent from the deployed function. The symptom is every request that needs a variable answering `503 {"error": "The server is not configured for this yet."}`.

**Call the interpreter by its path inside `.venv`.** A bare `python` or `pip` resolves to whatever is first on `PATH`, and an install lands somewhere the server cannot import it from.

**3. Configuration.** Copy the template and fill it in by hand.

```powershell
Copy-Item .env.example .env
```

**The file must sit in the directory the server is started from.** `backend/config.py` loads `.env.local` and then `.env` relative to the working directory, not relative to the code. Started from anywhere else, the server finds neither and answers `503` as above, while the log names the variable: `SUPABASE_URL is not set`. A value already set is never overridden, so `.env.local` wins over `.env`, and a real environment variable wins over both.

Two values have a trap of their own:

- **`ALLOWED_ORIGINS` needs `http://localhost:3000` for local work.** Signing in works without it, and then every save, upload, and sign-out fails with `403 {"error": "That request did not come from the studio."}`, because a state-changing studio request must carry an `Origin` on the list. No trailing slash.
- **`STUDIO_ENCRYPTION_KEY` must be exactly 32 bytes, base64 encoded.** Any other length is refused with the same `503`, and the log says `STUDIO_ENCRYPTION_KEY must be 32 bytes, base64 encoded`. That is deliberate: 16 bytes would be accepted by the cipher and silently give AES-128. Generate one with:

```powershell
.venv\Scripts\python -c "import os,base64;print(base64.b64encode(os.urandom(32)).decode())"
```

**The key must be the one that sealed the database you point at.** A different key cannot open the stored password digest or any saved credential, so sign-in fails with `Invalid email or password.` however correct the password is.

`IS_BACKEND` is for Vercel only. Leave it out of a local file.

**4. Run it.** One process, on port 8000.

```powershell
.venv\Scripts\python -m uvicorn api.index:app --reload --port 8000
```

**Port 8000 is the one the site expects.** The site's development server forwards `/api` to `http://127.0.0.1:8000` when its own `BACKEND_URL` is unset. If the port is taken, usually by a copy of this server already running, `uvicorn` exits with `[Errno 10048] error while attempting to bind on address ('127.0.0.1', 8000)`.

## Usage

With the server running, the health check answers without a database or a credential:

```powershell
curl.exe -s http://127.0.0.1:8000/api/health
```

```json
{"status":"ok"}
```

Everything past that is used through the studio, which is part of the site. Start the site's development server from a checkout of `dev`, open `http://localhost:3000/studio`, and it reaches this process through the forward described above.

## Configuration

Every variable the backend reads, by name. What each one is for, and where its value comes from, is in `.env.example`.

| Variable | Required | Description |
| :- | :- | :- |
| `SUPABASE_URL` | Yes | The Supabase project the backend reads and writes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | The backend's database access. It bypasses every row-level policy, and it exists in this deployment only |
| `STUDIO_ENCRYPTION_KEY` | Yes | 32 random bytes, base64. Seals the owner's password digest and every saved credential |
| `STUDIO_SERVICE_KEY` | Yes | Shared with the two sites. A request carrying it is believed about which visitor it acts for, and may call the model proxy |
| `ALLOWED_ORIGINS` | Yes | The origins whose pages may make a state-changing studio request. Comma separated, no trailing slash |
| `GMAIL_USER` | Until mail is set in the studio | Mail fallback, so the code that sets the first password can be sent |
| `GMAIL_APP_PASSWORD` | Until mail is set in the studio | The app password for that account, not the account password |
| `RECAPTCHA_SECRET_KEY` | No | Verifies the contact form's token. Without it the check is skipped |
| `IS_BACKEND` | On Vercel only | Read by `vercel.json`, never by the code. It tells the repository's two Vercel projects apart |

`VERCEL_ENV` is set by Vercel, not by you. The backend reads it for two things: to skip the environment files, and to mark the session cookie `Secure`.

**The model, mail, and storage settings are not environment variables.** `LLM_API_KEY`, `LLM_MODEL`, `LLM_BASE_URL`, the `SMTP_*` values, `CONTACT_TO`, `GCS_BUCKET`, and `GCS_SERVICE_ACCOUNT` are saved in the studio under Settings and take effect on the next request with no redeploy. What stays in the environment is what the backend needs in order to open the database at all.

## Tests

```powershell
.venv\Scripts\python -m pytest backend/tests -q
```

127 tests, a few seconds. **They need no database, no network, and no credential**: `backend/tests/conftest.py` replaces the database module with an in-memory stand-in, and `backend/config.py` refuses to load an environment file when `pytest` is running, so a real key on disk cannot turn a test into a write to production.

## Project Structure

```text
api/
  index.py             # the Vercel entry: one line that imports the application
backend/
  main.py              # the application, CORS, and the one shape every error takes
  config.py            # environment access and the error type every route raises
  auth.py              # the owner account: sign-in, lockout, sessions, reset codes
  crypto.py            # Argon2id for the password, AES-256-GCM for everything at rest
  vault.py             # the credentials saved in the studio
  ratelimit.py         # per-visitor allowances, and who is believed about the visitor
  db.py                # Supabase through its REST interface
  storage.py           # Google Cloud Storage as a drive
  llm.py               # one streamed call to an OpenAI-compatible endpoint
  mail.py              # outgoing mail
  sanity_import.py     # the one-time import, and the list of document types
  routes/              # public.py, account.py, files.py, content.py
  tests/
supabase/migrations/   # the schema, applied in filename order
.github/workflows/
  migrate.yml          # applies the migrations on a push to backend-main
vercel.json            # the function, the rewrite, per-branch deployment, headers
requirements.txt       # what Vercel installs
requirements-dev.txt   # the above plus uvicorn, pytest, python-dotenv
```

| Item | Location | Notes |
| :- | :- | :- |
| Variable names | `.env.example` | Committed. Placeholders only |
| Real values | `.env`, `.env.local` | Gitignored. Never committed, never pasted anywhere |
| Virtual environment | `.venv/` | Gitignored. Rebuilt by step 2 of the setup |
| Service account keys, certificates | Anything matching `*service-account*.json`, `*.pem`, `*.key` | Gitignored. The key belongs in the studio, not in a file here |
| Schema | `supabase/migrations/` | Committed. The only definition of the database |
| Content, posts, files, credentials | Supabase and the bucket | Not in the repository at all |

**`api/` holds one file and stays that way.** Vercel turns every Python file in that directory into a function of its own, so a helper placed there is deployed as a second endpoint. Code goes in `backend/`.

## What Is Sealed, and Who Is Believed

**What is sealed.** Two kinds of value are encrypted with AES-256-GCM under `STUDIO_ENCRYPTION_KEY` before they reach the database: the owner's password digest, and every credential saved in the studio. The password is first hashed with Argon2id, and the digest is what gets sealed, so a dump of the database is not even material for offline guessing. Each value is bound to its row: the password to the owner's id, a credential to its name. A blob lifted from one row does not open in another. The key is in the deployment's environment and never in the database.

**What is never returned.** A saved secret can be replaced or removed, not read back. The studio is told only whether one is set. The owner's address is never returned or logged either: a reset code goes to the address in the owner row, and a request can neither choose that address nor learn it.

**The session cookie.** Signing in sets `studio_session`, an opaque random token: `HttpOnly`, `SameSite=Lax`, `Secure` on Vercel, 12 hours. The database keeps only its SHA-256, so the table cannot be replayed as a set of cookies. The cookie is checked against the database on every studio request. Signing out revokes it, and setting or changing the password revokes every session.

**The Origin check.** A `SameSite=Lax` cookie still rides along on some cross-site requests, so a state-changing studio request must also carry an `Origin` listed in `ALLOWED_ORIGINS`. That check is what stands in for a CSRF token. It works because the browser's request passes through the site's rewrite with its `Origin` intact.

**Lockout.** Five failed sign-ins lock the account for 15 minutes, and during the lock the right password is refused too. Every failure gets the same reply at the same cost in time, whether the address, the password, or the lock was the cause, and a wrong address counts toward the lock, because counting only the right one would reveal it. A reset code lifts the lock.

**What the service key is trusted for.** `STUDIO_SERVICE_KEY` proves a request came from one of the two sites' servers and not straight from a browser. It buys two things and nothing else: the caller's statement of the visitor's address is believed, and the caller may use the model proxy. It does not open the studio. A request with the key and no session cookie is still signed out.

**Why the visitor's address is believed only with the key.** The backend is a deployment of its own, so the address it sees connecting is the site's server, and every visitor would share one allowance. The site therefore states the visitor's address in an `x-client-ip` header. Believed from anyone, that header would let a caller name a fresh address on every request and never be limited, so `backend/ratelimit.py` accepts it only when `x-service-key` matches, compared in constant time. Without a match it falls back to the first address in `x-forwarded-for`. An unset key trusts nobody.

**Rate limits fail closed.** Every allowance is counted in Postgres, because a serverless instance forgets. If the count cannot be read, the request is refused and not let through. A visitor's address is hashed before it is stored.

## The First Run, in Order

A database that has not been set up has no owner and no content, so the studio cannot be opened and both sites render empty. Steps 1 and 2 happen in Supabase. Steps 3 to 5 happen in the studio, against a backend that points at that database, local or deployed.

1. **Apply the migrations**, per "Applying Them by Hand" in [DEPLOY.md](DEPLOY.md). `0003_studio.sql` creates every table the studio needs.
2. **Create the one owner row by hand.** In the Supabase table editor, insert a single row into `studio_owner` with the `email` column filled and every other column left at its default. There is no sign-up. Do not set a password here: the stored value is a sealed digest only the backend can produce.
3. **Set the first password by emailed code.** On the studio's sign-in page choose **Forgot password**, send the code, and enter it with a password of at least 12 characters. The code goes to the address in the owner row, through `GMAIL_USER` and `GMAIL_APP_PASSWORD`, because mail is not set in the studio yet. It lives 10 minutes.
4. **Save the settings in the studio**, under Settings: `GCS_BUCKET` and `GCS_SERVICE_ACCOUNT` first, then `LLM_API_KEY` with `LLM_MODEL` and `LLM_BASE_URL` if the defaults are not wanted, then the `SMTP_*` values and `CONTACT_TO`. The bucket itself has requirements, listed in [DEPLOY.md](DEPLOY.md).
5. **Run the one-time import from Sanity**, also under Settings, with the project id and the dataset. Running it again changes nothing already imported.

**Step 4 has to come before step 5.** The import copies every image into the bucket, so without storage each document that has an image fails with `Storage is not configured.` Documents with no image still import, which makes a half-finished import look like a finished one.

**The code in step 3 never reports a failure to send.** The reply is the same whether or not the mail left, so that it says nothing about the account. If no code arrives, the log holds `The reset code could not be mailed`, and the usual cause is a missing or wrong mail fallback.

## Known Limitations

- **`backend-dev` is not deployed.** Nothing packages the function before production, so a fault in the bundle, the rewrite, or the environment first shows on `backend-main` unless a preview is made by hand. The tests prove the application, not the packaging.
- **There is one database and no staging copy.** A local backend filled with the production values reads and writes production, and `backend-main` is the first place a migration ever runs.
- **Losing `STUDIO_ENCRYPTION_KEY` loses every saved credential and the password.** Nothing can re-derive it. The way back is a new key, a password reset by emailed code, and entering each credential again.
- **A stranger can lock the owner out for 15 minutes.** Five wrong sign-ins from anywhere trip the lock. A reset code lifts it.
- **The failure counters are read and then written.** Two simultaneous wrong sign-ins, or two wrong codes, can count as one. The per-visitor rate limit bounds what that is worth.
- **The service key is one shared value in three deployments.** Whoever holds it can state any visitor address, which defeats the per-visitor limits, and can spend the model key through the proxy. Rotating it means changing all three at once.
- **The backend answers on its own domain too.** The forward through the site is how browsers are meant to reach it, not a wall. A direct caller skips whatever the site does in front of a request and is held only by the checks described above.
- **The service account key is stored, sealed, in the database.** There is no keyless path to the bucket.
- **The bucket's upload rule follows `ALLOWED_ORIGINS` only at the moment a storage credential is saved.** Changing the origins later does not update the bucket.
- **The import module cannot be deleted once it has run.** `backend/routes/content.py` takes its list of document types from `SHAPES` in `backend/sanity_import.py`, so removing the file breaks the application at import. `SHAPES` has to move out first.
- **The captcha fails open.** A missing token, a missing secret, or an unreachable verifier does not block a contact message. The rate limit and the hidden field still apply.
- **The Python version is not pinned.** Development uses 3.12, and Vercel picks its own default for the function.
- **No check runs before a merge.** The tests are run by hand. Nothing stops a failing change from reaching `backend-main`.
