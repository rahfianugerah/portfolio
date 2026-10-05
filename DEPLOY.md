# Deployment Runbook: Studio Backend

> [!important]
> The backend is one Python function in a Vercel project of its own. The repository has two Vercel projects, one for the site and one for this, and each ignores the other's branches.

Target domain: **`api.rahfi.pro`**. Browsers on `rahfi.pro` and `consulting.rahfi.pro` call it directly, and so do both sites' servers when they render a page. Neither site holds a secret: each holds this address and nothing else.

## Table of Contents

1. [Branch to Environment](#branch-to-environment)
2. [What Is Already in the Repository](#what-is-already-in-the-repository)
3. [Why Each Project Shows Skipped Builds](#why-each-project-shows-skipped-builds)
4. [First-Time Setup](#first-time-setup)
5. [The Bucket Needs Three Things](#the-bucket-needs-three-things)
6. [Database Migrations](#database-migrations)
7. [Promotion](#promotion)
8. [Verification After a Deployment](#verification-after-a-deployment)
9. [Rollback](#rollback)
10. [Known Gaps](#known-gaps)

## Branch to Environment

| Branch | Vercel environment | URL |
| :- | :- | :- |
| `backend-main` | Production | `api.rahfi.pro` |
| `backend-dev` | None. It is not deployed | |

A change moves one way: `local work > backend-dev > backend-main`, through a pull request. Never push directly to `backend-main`.

> [!warning]
> **`backend-dev` is not deployed, so the function's first real run is production.** `vercel.json` sets `git.deploymentEnabled` to `false` for `backend-dev`, so a push there builds nothing. The tests and a local `uvicorn` prove the application; they prove nothing about how Vercel packages `api/index.py`, installs `requirements.txt`, applies the rewrite, or supplies the environment. The first time any of that happens is the deployment of `backend-main`. The only rehearsal is a preview made by hand, per "A Preview by Hand" below. Check the health endpoint the moment a deployment finishes, and be ready to promote the previous one.

## What Is Already in the Repository

| File | Purpose |
| :- | :- |
| `vercel.json` | Region, the function and its limit, the rewrite of every path to it, per-branch deployment, the ignore command, and response headers |
| `api/index.py` | The function. One line, importing the application from `backend/` |
| `requirements.txt` | What Vercel installs for the function. `requirements-dev.txt` is for a local machine only |
| `supabase/migrations/` | The schema, applied in filename order |
| `.github/workflows/migrate.yml` | Applies the migrations on a push to `backend-main` |
| `.env.example` | The variable names. Values are never committed |
| `.gitignore` | Already ignores `.vercel`, every `.env*` but the example, `.venv/`, and key files |

`vercel.json` pins the region to `sin1`, gives the function 60 seconds, and keeps `supabase/`, `.venv/`, and `backend/tests/` out of its bundle. It rewrites every path to `api/index`, so FastAPI answers everything, including the `404` for a path that does not exist. It sets `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Strict-Transport-Security`, and `X-Robots-Tag: noindex, nofollow, noai, noimageai` on every response.

**Keep `api/` to that one file.** Vercel turns every Python file in that directory into a function of its own, so a helper module placed there is deployed as a second endpoint. Backend code lives in `backend/`.

The function reads its environment from Vercel. It does not read a `.env` file there: `python-dotenv` is a development requirement and is absent from the deployed bundle.

## Why Each Project Shows Skipped Builds

Both Vercel projects are connected to the same repository, so both are told about every push. Two settings in each history's `vercel.json` decide what happens next.

- `git.deploymentEnabled` turns a branch off entirely. `backend-dev` here, and `dev` on the site, create no deployment in either project.
- `ignoreCommand` runs before a build and reads one variable, `IS_BACKEND`. **Only the backend project sets it, to `1`.** The command here is `[ "$IS_BACKEND" != "1" ]`: it succeeds when the variable is absent, and a command that succeeds tells Vercel to skip the build. The site's `vercel.json` carries the opposite test, so it skips when the variable is `1`.

| Push to | Site project, `IS_BACKEND` unset | Backend project, `IS_BACKEND=1` |
| :- | :- | :- |
| `main` | Builds, production | Skipped |
| `dev` | No deployment | No deployment |
| `backend-main` | Skipped | Builds, production |
| `backend-dev` | No deployment | No deployment |

A skipped build is listed in the project's Deployments as canceled by the Ignored Build Step. **That is the mechanism working, not a failure.** Each project lists one for every push to the other's production branch.

**`IS_BACKEND` must be set for Preview as well as Production in the backend project.** To that project `main` is not the production branch, so a push to `main` is a preview build and reads the Preview variables. If `IS_BACKEND` is missing there, the site's ignore command does not skip, and the backend project builds a copy of the site.

## First-Time Setup

> [!warning]
> Every step below needs an authenticated session. Run them yourself; they cannot be run on your behalf, and no secret should ever be pasted into a chat.

Steps 1 to 6 come before `backend-main` exists, on purpose: the push that creates it starts both the deployment and the migration workflow, and each needs its variables in place.

### 1. Authenticate

```bash
vercel login
```

### 2. Create the second project

In the Vercel dashboard choose **Add New > Project** and import `rahfianugerah/portfolio` again. The repository is already connected to the site's project; importing it a second time creates a separate one.

| Setting | Value |
| :- | :- |
| Project name | One that cannot be mistaken for the site's |
| Framework Preset | **Other** |
| Root Directory | The repository root |
| Build and Output settings | Left empty. There is nothing to build: Vercel installs `requirements.txt` and packages `api/index.py` |
| Environment Variables | Add `IS_BACKEND` with the value `1` before the first deploy |

**Add `IS_BACKEND` on this screen, not afterwards.** Importing deploys the repository's default branch at once, and that branch is `main`, the site. With the variable present the site's ignore command skips it. Without it the new project builds the site as its first production deployment; delete that deployment if it happens.

### 3. Set the production branch

In the project's settings, set the production branch to `backend-main`. Depending on the dashboard version this is under **Settings > Environments > Production** or **Settings > Git**.

Without this, the project treats `main` as production and `backend-main` as a preview, so the domain never receives the backend.

### 4. Link a checkout and add the variables

From a checkout of `backend-dev`:

```bash
vercel link
```

**Select the backend project, not the site's.** One repository now has two projects and `vercel link` offers both. Every `vercel env add` below writes to whichever project the checkout is linked to, so a wrong choice here puts the service role key into the site's project. `vercel link` writes `.vercel/`, which is gitignored; `.vercel/project.json` names the project it chose.

```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add STUDIO_ENCRYPTION_KEY production
vercel env add ALLOWED_ORIGINS production
vercel env add GMAIL_USER production
vercel env add GMAIL_APP_PASSWORD production
vercel env add RECAPTCHA_SECRET_KEY production
vercel env add RECAPTCHA_SITE_KEY production
vercel env add GITHUB_TOKEN production
vercel env add IS_BACKEND production
vercel env add IS_BACKEND preview
```

Each command prompts for the value. What each holds is in `.env.example`. Three of them have a condition attached:

- **`STUDIO_ENCRYPTION_KEY` must be the value that sealed the rows already in the database.** If the first run was done from a local machine, it is the key that machine used. A deployment with a different key cannot open the password digest or any saved credential, so sign-in fails with `Invalid email or password.` and every credential reads as broken. Keep a copy in a password manager.
- **`ALLOWED_ORIGINS` is `https://rahfi.pro,https://consulting.rahfi.pro`**, with no trailing slash and no space. It is also the CORS list, so a site missing from it cannot read a single reply in the browser, and a studio write from an origin not on it is refused with `That request did not come from the studio.`
- **`IS_BACKEND` goes in both environments**, per the section above.

The model key, the model name, the mail settings, the bucket name, and the service account key are not set here. They are saved in the studio under Settings, sealed, and take effect on the next request with no redeploy.

**A project set up before 2026-10-05 holds `STUDIO_SERVICE_KEY`.** Remove it with `vercel env rm STUDIO_SERVICE_KEY production`: nothing reads it any more. Add the three it lacks, `SUPABASE_ANON_KEY`, `RECAPTCHA_SITE_KEY` and `GITHUB_TOKEN`, which used to live in the sites.

### 5. Give the migration workflow its secret

Per "How They Are Applied" below: one secret, `SUPABASE_DB_URL`, on a GitHub environment named `supabase`, which only `backend-main` may deploy to.

### 6. Prepare the bucket

Per "The Bucket Needs Three Things" below.

### 7. Create `backend-main`

If `backend-main` does not exist on the remote yet, there is nothing to open a pull request against, so its first commit is a push:

```bash
git push -u origin backend-dev
git push origin backend-dev:backend-main
```

This is the only direct push `backend-main` ever receives. It starts the first production deployment and the first run of the migration workflow. From here on, a change arrives by pull request, per "Promotion".

### 8. Add the domain

In the backend project, under **Settings > Domains**, add `api.rahfi.pro` and assign it to **Production**. Add the DNS record Vercel shows at the registrar; a subdomain takes a `CNAME`.

### 9. Point the two sites at it

Both sites are configured in their own projects. Each needs exactly one variable:

| Site project | Variable | Value |
| :- | :- | :- |
| Portfolio | `BACKEND_URL` | `https://api.rahfi.pro`, the origin with no path and no trailing slash |
| Consulting | `BACKEND_URL` | The same |

**Why the sites need no secret.** Browsers call this backend directly, so it sees each visitor's own address and needs no site to vouch for it; that is what the shared service key was for. Every read a site used to make with its own key, published content, the visitor counts, the GitHub card, and the reCAPTCHA site key, is now an endpoint here, and the keys behind them live only in this project. A leaked site deployment now gives away an address that is public anyway.

**Remove what the sites no longer read**, in each site's project: `STUDIO_SERVICE_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GITHUB_TOKEN` and `RECAPTCHA_SITE_KEY` from the portfolio, and `STUDIO_SERVICE_KEY`, `STUDIO_API_URL`, `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the consulting site. A value left behind is a secret kept for no reason.

**Deploy the backend first, then redeploy both sites.** A site reads `BACKEND_URL` when it builds and renders, so a deployment built before the variable was set calls nothing.

### A Preview by Hand

The one way to exercise the function before production:

```bash
vercel
```

Run from a linked checkout, this builds a preview deployment of the working tree and prints its URL. Three things to know before relying on it:

- **A preview has none of the variables until they are added to the Preview environment**, with `vercel env add <NAME> preview`. Without them the health check answers and everything else is `503`.
- **With them, a preview reads and writes the production database.** There is no other database.
- A preview URL may sit behind Vercel's own sign-in, in which case `curl` receives Vercel's page and not the backend's reply. Open it in a browser signed in to Vercel.

## The Bucket Needs Three Things

One Google Cloud Storage bucket holds every image, PDF, and Markdown file.

| Requirement | Why | How |
| :- | :- | :- |
| Objects are publicly readable | A page shows a file by its `https://storage.googleapis.com/<bucket>/<path>` address, with no signature | Grant `allUsers` the Storage Object Viewer role on the bucket |
| The service account can create, read, list, and delete objects | The file manager does all four, a move is a copy and a delete, and the import writes under `imported/` | Grant it the Storage Object Admin role on the bucket |
| CORS allows `PUT` from the two site origins with the `Content-Type` and `x-goog-content-length-range` headers | The browser uploads straight to the bucket through a signed URL, and both headers are part of what was signed | Set automatically or by hand, as below |

```bash
gcloud storage buckets add-iam-policy-binding gs://your-bucket --member=allUsers --role=roles/storage.objectViewer
gcloud storage buckets add-iam-policy-binding gs://your-bucket --member=serviceAccount:your-account@your-project.iam.gserviceaccount.com --role=roles/storage.objectAdmin
```

**The CORS rule is set automatically only when the service account may update the bucket.** Saving `GCS_BUCKET` or `GCS_SERVICE_ACCOUNT` in the studio tries to write the rule, using the origins in `ALLOWED_ORIGINS` at that moment. Storage Object Admin covers objects and does not include permission to update the bucket itself, so with the roles above the attempt is refused. The studio still reports the credential as saved, and the only trace is a `Bucket CORS could not be set, uploads may be refused` line in the function log. The symptom is an upload that fails in the browser with a CORS error. Set the rule by hand. Save this as `cors.json`:

```json
[
  {
    "origin": ["https://rahfi.pro", "https://consulting.rahfi.pro"],
    "method": ["PUT"],
    "responseHeader": ["Content-Type", "x-goog-content-length-range"],
    "maxAgeSeconds": 3600
  }
]
```

```bash
gcloud storage buckets update gs://your-bucket --cors-file=cors.json
```

Add `http://localhost:3000` to `origin` if files are uploaded from a local studio as well. Delete `cors.json` afterwards or keep it out of the repository; it is not a secret, and it is not tracked either.

Create a JSON key for the service account and paste it into `GCS_SERVICE_ACCOUNT` in the studio. **It never goes into a file in the repository or into an environment variable.**

## Database Migrations

The schema lives in `supabase/migrations/`, applied in filename order. Nothing else defines it. The database is shared: the site's pages read it with the anon key, and its tables for visitor counts are defined here too.

| File | Adds |
| :- | :- |
| `0001_analytics_baseline.sql` | `counters`, `daily_stats`, `sessions`: the site's visitor counts, open to the anon key for exactly the verbs the site issues |
| `0002_chat_rate_limit.sql` | `chat_requests` and `check_chat_rate_limit`. Superseded by `check_rate_limit` in `0003`, and left in place because migrations are additive |
| `0003_studio.sql` | `documents` and `posts`, readable with the anon key, a post only once published; `studio_owner`, `studio_sessions`, `studio_otps`, `credentials`, and `rate_limit_events`, closed to it; and `check_rate_limit`, the one limiter behind sign-in, reset codes, the contact form, the visitor counts, and both assistants, callable by the service role only |
| `0004_consulting_copy.sql` | No schema. The consulting site's services, principles, process steps, and prices as `documents`, each type inserted only while it has no document, so a studio edit is never overwritten |

### How They Are Applied

`.github/workflows/migrate.yml` runs on a push to `backend-main`. It lists what is pending, applies it with `supabase db push`, and lists again. It needs one secret, `SUPABASE_DB_URL`, set on a GitHub **environment** named `supabase` and not repository-wide, so a workflow outside that environment cannot read it, and restricted to the `backend-main` branch. It is not the `Production` environment: Vercel records the site's deployments there, and a branch rule on it would reject them. Take the value from the Supabase dashboard, **Connect**, **Session pooler**, with the password filled in and percent-encoded. The direct connection is IPv6 only and GitHub's runners cannot reach it.

If the `production` environment restricts which branches may deploy to it, `backend-main` has to be on that list, or the job is refused before it starts.

**The workflow and the Vercel deployment start from the same push, and neither waits for the other.** Nothing in this repository makes the deployment depend on the migration job. That is why a migration must be additive: the new code and the old schema, or the old code and the new schema, have to work together for the minutes they overlap. When new code cannot run without a new table or column, apply the migration by hand before merging.

**With no staging database, `backend-main` is the first place a migration ever runs.** Read what is pending before you merge.

The workflow also declares a manual trigger. GitHub offers a manual run only for a workflow file present on the repository's default branch, and the default branch is the site's, which does not hold this file. Treat the push as the only trigger, and apply by hand when a run is needed without one.

### Applying Them by Hand

Read what is pending first. This only reads:

```bash
supabase migration list --db-url "$SUPABASE_DB_URL"
```

Then apply:

```bash
supabase db push --db-url "$SUPABASE_DB_URL"
```

This is what the workflow runs. `SUPABASE_DB_URL` here is a variable in your own shell, set for the session and never written to a file in the repository.

**Do not paste a migration into the SQL editor in the Supabase dashboard.** It works, and it leaves no record. The migration history stays empty, `migration list` shows the migration as still pending, and the next `db push` applies it a second time. `0001` to `0003` are written with `if not exists` and `create or replace`, and `0004` inserts nothing a second time, so all four survive that; do not assume a later one will. If one was run by hand, reconcile with `supabase migration repair --status applied <version> --db-url "$SUPABASE_DB_URL"`.

The filenames use a `0001` prefix where the CLI generates a 14-digit timestamp. `supabase migration list` prints one row per local migration it parsed, so four rows means it read all four. Confirm that once before relying on the workflow.

### Adding One

**Forward-only and additive.** A new file with the next number, never an edit to one that has been applied. Add a column, backfill it, and drop the old one in a later migration, never the same one, so rolling back the application never requires rolling back the schema.

## Promotion

`backend-dev` reaches `backend-main` by pull request and no other way.

```bash
gh pr create --base backend-main --head backend-dev --fill
```

**Name the base.** The repository's default branch is `main`, so a pull request opened without one targets the site. GitHub cannot build that comparison and says `There isn't anything to compare. main and backend-dev are entirely different commit histories.` That message means the base is wrong, not that the branch is broken.

Before merging:

1. Run the tests: `.venv\Scripts\python -m pytest backend/tests -q` on Windows, `.venv/bin/python -m pytest backend/tests -q` elsewhere. Nothing runs them for you.
2. Read what the merge would migrate, per "Applying Them by Hand".
3. Confirm `API.md` matches any endpoint the change touched.

| Action | Result |
| :- | :- |
| Push to `backend-dev` | Nothing is built or deployed |
| Merge into `backend-main` | A production deployment at `api.rahfi.pro`, and the migration workflow, side by side |

Content, posts, files, and credentials are not part of a deployment. A credential saved in the studio takes effect on the next request.

## Verification After a Deployment

Run these in order. Each proves something the one before it does not.

1. **The function was packaged and routed.**

```bash
curl -s https://api.rahfi.pro/api/health
```

Prints `{"status":"ok"}`. Anything else, and nothing below is worth running.

2. **The studio is closed, and the interactive documentation is off.**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://api.rahfi.pro/api/studio/me
curl -s -o /dev/null -w "%{http_code}\n" https://api.rahfi.pro/docs
```

The first prints `401`, the second `404`.

3. **The public reads reached the database with the anon key.**

```bash
curl -s https://api.rahfi.pro/api/public/config
curl -s "https://api.rahfi.pro/api/public/documents?type=pricingTier"
```

The first prints `{"recaptchaSiteKey":"..."}`; `null` means `RECAPTCHA_SITE_KEY` is not set. The second prints a list of price tiers. `{"error":"The server is not configured for this yet."}` means `SUPABASE_URL` or `SUPABASE_ANON_KEY` is not set in this project.

4. **The response headers are present.**

```bash
curl -s -D - -o /dev/null https://api.rahfi.pro/api/health
```

The output includes `strict-transport-security`, `x-frame-options: DENY`, `x-content-type-options: nosniff`, and `x-robots-tag`.

5. **Both sites reach it from the browser.** Open `https://rahfi.pro`: the visitor counts and the GitHub card fill in, which proves the portfolio's `BACKEND_URL`, its place in `ALLOWED_ORIGINS`, and `GITHUB_TOKEN`. Open `https://consulting.rahfi.pro`: the services and prices render from the studio.
6. **The database and the sealing key work.** Sign in to the studio on `rahfi.pro`. This proves the service role key and the encryption key reached the runtime and match the database.
7. **A save is accepted.** Change anything in the studio and save it. This proves `ALLOWED_ORIGINS` holds the production origin.
8. **A file uploads** under Files in the studio, which proves the bucket's CORS rule covers the production origin.
9. **The assistant answers** on the portfolio, which proves the model key saved in the studio can be opened and the model accepts it. Then ask Zoey something on the consulting site, which proves her brief is read from the studio's documents.
10. **The contact form sends**, which proves the mail settings work.

## Rollback

Vercel keeps every deployment. In the backend project, open **Deployments**, find the last good one, and choose **Promote to Production**. It takes effect at once with no rebuild.

To roll back in git as well, revert the merge commit on `backend-main` through a pull request. `backend-main` is never force pushed.

**A rollback does not roll back the database or the bucket.** Content, posts, credentials, and every uploaded file are shared across deployments, and an applied migration stays applied. This is the other reason a migration is additive.

## Known Gaps

| Gap | Consequence |
| :- | :- |
| The function has no rehearsal | `backend-dev` is not deployed, so a packaging or routing fault first shows in production unless a preview is made by hand. The health check and a promoted rollback are the safety net |
| Nothing gates the deployment on the migration job | New code can go live before its schema, or the schema before the code. Additive migrations, or applying by hand first, are what make that safe |
| No check runs the tests before a merge | A failing change can reach `backend-main`. Run them by hand |
| Branch protection on `backend-main` is a convention until it is configured | The pull request path is not enforced. Set it under **Settings > Branches** on GitHub |
| Losing `STUDIO_ENCRYPTION_KEY` loses every saved credential | Set a new key, reset the password by emailed code, and enter the credentials again |
| The bucket's CORS rule follows `ALLOWED_ORIGINS` only when a storage credential is saved | Changing the origins later does not update the bucket. Save `GCS_BUCKET` again, or set the rule by hand |
| The Python version is not pinned | Vercel picks its default for the function, which can differ from the 3.12 used in development |
| Migration filenames use `0001` where the CLI generates a timestamp | Not confirmed against the CLI. `supabase migration list` settles it in one read-only command |
