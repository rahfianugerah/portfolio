# Deployment Runbook: Rahfi's Portfolio

> [!important]
> Vercel runs the Next application and one Python function, the FastAPI backend, so there is no container to build and no server to keep alive between requests.

Target domain: **`rahfi.pro`** (the apex). The consulting site deploys to the `consulting.rahfi.pro` subdomain, reads the same database, and reaches the model through this deployment's backend.

## Branch to Environment

| Branch | Vercel environment | URL |
| :- | :- | :- |
| `main` | Production | `rahfi.pro` |
| `dev` | None. It is not deployed | |

A change moves one way: `local work > dev > main`, through a pull request with a recorded human approval. Never push directly to `main`.

**Only `main` is deployed.** `vercel.json` sets `git.deploymentEnabled` to `false` for `dev`, so a push there builds nothing and publishes nothing. Work is reviewed on the local servers, and the first deployment a change gets is production.

> [!warning]
> **The Python function cannot be exercised before production.** With `dev` not deployed there is no preview, so the first time Vercel packages `api/index.py`, installs `requirements.txt`, and routes `/api/*` to it is the production deployment itself. `npm run dev:api` proves the application; it proves nothing about the packaging, the rewrite, the 60 second limit, or the environment variables. Check `/api/health` the moment a deployment finishes, and be ready to promote the previous one. The only rehearsal there is has to be made by hand: `vercel` from a checkout builds a preview, but that environment has none of the variables until they are added to it, and with them it reads and writes the production database.

## What Is Already in the Repository

| File | Purpose |
| :- | :- |
| `vercel.json` | Region, the Python function, per-branch deployment, and security headers. The consulting site's is the same file without the `functions` block |
| `api/index.py` | The Python function. One line, importing the application from `backend/` |
| `requirements.txt` | What Vercel installs for the function. `requirements-dev.txt` is for a local machine only |
| `supabase/migrations/` | The schema, applied in filename order |
| `.github/workflows/migrate.yml` | Applies the migrations on a push to `main` |
| `.env.example` | The variable names. Values are never committed |
| `.gitignore` | Already ignores `.vercel`, `.env`, and `.venv/` |

`vercel.json` pins the region to `sin1` (Singapore) and sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, and `X-Robots-Tag: noai, noimageai` on every response.

## The Python Function

`vercel.json` declares `api/index.py` as a function with a 60 second limit, and excludes `.next`, `node_modules`, `src`, `public`, `supabase`, and `.venv` from its bundle. In production `next.config.mjs` rewrites every `/api/*` path to it, except the four paths that are Next route handlers: `/api/analytics`, `/api/github/stats`, `/api/content`, `/api/blog`.

**Keep `api/` to that one file.** Vercel turns every Python file in that directory into a function of its own, so a helper module placed there is deployed as a second endpoint. Backend code lives in `backend/`.

The function reads its environment from Vercel. It does not read a `.env` file there: `python-dotenv` is a development requirement and is absent from the deployed bundle.

## First-Time Setup

> [!warning]
> Every step below needs an authenticated session. Run them yourself; they cannot be run on your behalf, and no secret should ever be pasted into a chat.

### 1. Authenticate

```bash
vercel login
```

### 2. Link the repository

From the repository root:

```bash
vercel link
```

Choose the scope, then create or select the project. This writes `.vercel/`, which is gitignored.

### 3. Set the production branch

In the Vercel dashboard, under **Settings > Git**, set the production branch to `main`.

Without this, Vercel treats its own default as production and a push to the wrong branch goes live.

### 4. Add the domain

```bash
vercel domains add rahfi.pro
vercel domains add www.rahfi.pro
```

Under **Settings > Domains**, assign `rahfi.pro` to **Production** and redirect `www` to it. Add the DNS records Vercel shows you at your registrar. An apex domain usually needs an `A` record rather than the `CNAME` a subdomain takes.

### 5. Environment variables

Eleven, all for production. `dev` is not deployed, so there is no preview environment to fill.

```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add STUDIO_ENCRYPTION_KEY production
vercel env add STUDIO_SERVICE_KEY production
vercel env add ALLOWED_ORIGINS production
vercel env add GMAIL_USER production
vercel env add GMAIL_APP_PASSWORD production
vercel env add GITHUB_TOKEN production
vercel env add RECAPTCHA_SECRET_KEY production
vercel env add RECAPTCHA_SITE_KEY production
```

What each holds is in `.env.example`. Three of them have a condition attached:

- **`STUDIO_ENCRYPTION_KEY` must be the same value everywhere that reads this database.** It seals the password digest and every saved credential. A deployment with a different key cannot open what a local studio saved, so sign-in fails with `Invalid email or password.` and every credential reads as broken. Keep a copy in a password manager.
- **`STUDIO_SERVICE_KEY` is set to the same value in the consulting project.** That site sends it to reach the model.
- **`ALLOWED_ORIGINS` has no trailing slash and no space.** A studio write from an origin not on the list is refused with `That request did not come from the studio.`

The model key, the model name, the mail settings, the bucket name, and the service account key are not set here. They are saved in `/studio` under Settings, sealed, and take effect on the next request with no redeploy.

> [!danger]
> None of these may be given a `NEXT_PUBLIC_` prefix. A prefixed value is compiled into the bundle the browser downloads and is public the moment it ships; every variable here is read on the server instead.

> [!note]
> `SUPABASE_ANON_KEY` is read only on the server. It is the anon key, and row-level security is what protects the data behind it. Its policies live in `supabase/migrations/`. `SUPABASE_SERVICE_ROLE_KEY` is the opposite: it bypasses every policy, and only the Python function reads it.

### 6. The Google Cloud Storage bucket

One bucket holds every image, PDF, and Markdown file. It needs three things.

| Requirement | Why | How |
| :- | :- | :- |
| Objects are publicly readable | A page shows an image by its `https://storage.googleapis.com/<bucket>/<path>` address, with no signature | Grant `allUsers` the Storage Object Viewer role on the bucket |
| The service account can create, read, list, and delete objects | The file manager does all four, and a move is a copy and a delete | Grant it the Storage Object Admin role on the bucket |
| CORS allows `PUT` from the site origins with the `Content-Type` and `x-goog-content-length-range` headers | The browser uploads straight to the bucket through a signed URL | Set automatically, or by hand, as below |

```bash
gcloud storage buckets add-iam-policy-binding gs://your-bucket --member=allUsers --role=roles/storage.objectViewer
gcloud storage buckets add-iam-policy-binding gs://your-bucket --member=serviceAccount:your-account@your-project.iam.gserviceaccount.com --role=roles/storage.objectAdmin
```

**The CORS rule is set automatically only when the service account may update the bucket.** Saving `GCS_BUCKET` or `GCS_SERVICE_ACCOUNT` in the studio tries to write the rule, using the origins in `ALLOWED_ORIGINS` at that moment. Storage Object Admin does not include that permission, so with the roles above the attempt is refused, the studio still reports the credential as saved, and the only trace is a `Bucket CORS could not be set` line in the function log. The symptom is an upload that fails in the browser with a CORS error. Set the rule by hand:

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

Add `http://localhost:3000` to `origin` if files are uploaded from a local studio as well. Create a JSON key for the service account and paste it into `GCS_SERVICE_ACCOUNT` in the studio. It never goes into a file in the repository or into an environment variable.

### 7. Remove the old preview domain

If `preview-rahfi-portfolio.vercel.app` is still listed under **Settings > Domains**, remove it. It was assigned to `dev` while that branch was deployed, and it now points at a deployment that no longer updates.

## The First Run, in Order

The site ships with no content, so a database that has not been filled renders every section empty. Fill it from the local studio before `main` is updated. Steps 1 to 6 are done on a local machine pointed at the production database; step 7 is the first deployment.

1. **Apply the migrations by hand**, per "Applying them by hand" below. `0003_studio.sql` creates every table the studio needs, and the workflow that would apply it runs only on a push to `main`.
2. **Create the owner row.** In the Supabase table editor, insert one row into `studio_owner` with the `email` column filled and nothing else. There is no sign-up, and a reset code is only ever sent to this address.
3. **Start both local servers** with a `.env` that holds the production `SUPABASE_*` values and the `STUDIO_ENCRYPTION_KEY` that production will use. The commands are in `README.md`.
4. **Set the first password.** Open `/studio/login`, choose **Forgot password**, then **Send code**, and enter the code with a password of at least 12 characters. The code is mailed through `GMAIL_USER` and `GMAIL_APP_PASSWORD`, because SMTP is not set in the studio yet.
5. **Save the credentials in Settings**: `GCS_BUCKET` and `GCS_SERVICE_ACCOUNT` first, then `LLM_API_KEY` with `LLM_MODEL` and `LLM_BASE_URL` if the defaults are not wanted, then the `SMTP_*` values and `CONTACT_TO`.
6. **Run the one-time import** under Settings, **Import from Sanity**, with the project id and the dataset. It copies every document and post, and every image into the bucket under `imported/`. Running it again changes nothing already imported. Check the local site: no section that had content is empty.
7. **Set the Vercel environment variables**, per step 5 of the setup, then merge `dev` into `main`.
8. **Verify the deployment**, per the section below, starting with `/api/health`.

**Step 5 has to come before step 6.** The import copies images into the bucket, so without storage every document that has an image fails with `Storage is not configured.` Documents with no image still import, which makes a half-finished import look like a finished one.

## Routine Deployment

Once linked, Vercel builds on every push to `main`.

| Action | Result |
| :- | :- |
| Push to `dev` | Nothing is built or deployed |
| Merge `dev` into `main` | Production deployment, at `rahfi.pro`, and Supabase migrations applied first |

To deploy manually:

```bash
vercel            # preview
vercel --prod     # production
```

Content, posts, files, and credentials are not part of a deployment. A save in the studio shows on the site within a minute, with no commit and no build.

## Verification After a Deployment

Use a browser for the pages. `curl` is one of the scraping tools the site turns away, so it receives 403 on every path outside `/api/` and `/robots.txt`.

1. The backend answers: `/api/health` returns `{"status": "ok"}`. This is the first proof the Python function was packaged and routed.
2. Every route returns 200: `/`, `/project`, `/blog`, `/experience`, `/contact`, `/chat`. `/service` redirects to `consulting.rahfi.pro/#services`.
3. The four route handlers respond: `/api/analytics`, `/api/blog`, `/api/content`, `/api/github/stats`.
4. `/studio` redirects to `/studio/login` when signed out, and signing in opens the studio. This proves the service role key and the encryption key reached the runtime.
5. A file uploads under Files in the studio, which proves the bucket's CORS rule covers the production origin.
6. The assistant answers at `/chat`, which proves the model key saved in the studio can be opened and the model accepts it.
7. The contact form sends, which proves the mail and captcha values work.
8. No icon is served: `/favicon.ico` returns 404 in a browser.
9. The signals grid renders all twelve cells, and the analytics and velocity charts draw.
10. A crawler that names itself is refused, and `robots.txt` stays readable:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -A "GPTBot" https://rahfi.pro/
curl -s https://rahfi.pro/robots.txt
```

The first prints `403`. The second lists the AI crawlers under `Disallow: /`.

11. Security headers are present:

```bash
curl -sI https://rahfi.pro/robots.txt | grep -i "strict-transport\|x-frame\|x-content-type\|x-robots-tag"
```

## Database Migrations

The schema lives in `supabase/migrations/`, applied in filename order. Nothing else defines it.

| File | Adds |
| :- | :- |
| `0001_analytics_baseline.sql` | `counters`, `daily_stats`, `sessions` |
| `0002_chat_rate_limit.sql` | `chat_requests`, and `check_chat_rate_limit`. Superseded by `check_rate_limit` in `0003`, and left in place because migrations are additive |
| `0003_studio.sql` | `documents` and `posts`, readable with the anon key; `studio_owner`, `studio_sessions`, `studio_otps`, `credentials`, and `rate_limit_events`, closed to it; and `check_rate_limit`, the one limiter behind sign-in, reset codes, the contact form, and both assistants |

Supabase holds everything now: the visitor counts, the content of both sites, the posts, the owner's account, and the sealed credentials. `documents` and `posts` are the only two tables the anon key can read beyond the analytics ones, and a post only once it is published. The other five have row-level security on and no policy, so only the service role reaches them.

### How they are applied

`.github/workflows/migrate.yml` runs on a push to `main`, before the deploy. It needs one secret, `SUPABASE_DB_URL`, set on a GitHub **environment** named `production` rather than repository-wide, so nothing outside a `main` push can read it. Take the value from **Project Settings > Database > Connection string**, the pooler URI, with the password filled in.

That is the whole setup. After the secret exists, a merge to `main` applies migrations on its own, and the job fails the deploy if a migration fails.

**With no staging branch, `main` is the first place a migration ever runs.** The soak period the promotion shape provides is gone, so read what is pending before you merge. `supabase migration list` changes nothing and takes a second.

### Applying them by hand

Read what is pending first. This only reads:

```bash
supabase migration list --db-url "$SUPABASE_DB_URL"
```

Then apply:

```bash
supabase db push --db-url "$SUPABASE_DB_URL"
```

This is what the workflow runs. Doing it by hand before merging is how you find out a migration fails without a failed deploy attached to it.

> [!warning]
> Pasting a migration into the SQL editor in the Supabase dashboard works, and it is also how the old drift happened. The editor does not record what it ran, so `supabase_migrations` stays empty, `migration list` shows the migration as still pending, and the next `db push` tries to apply it a second time. `0001` to `0003` are written with `if not exists` and `create or replace` and will survive that; do not assume a later one will. If you have already run them by hand, reconcile with `supabase migration repair --status applied <version> --db-url "$SUPABASE_DB_URL"` rather than letting the two disagree.

> [!important]
> The filenames use a `0001` prefix rather than the 14-digit timestamp the CLI generates. Confirm the CLI reads them before relying on the workflow: `supabase migration list` prints one row per local migration, so three rows means it parsed all three. If it does not list them, rename them to timestamps in one commit, and only while `supabase_migrations` is still empty. Renaming after a migration has been applied changes its recorded version and it will be applied again.

### Adding one

Forward-only and additive, per `PRD.md`. Add a column, backfill it, and drop the old one in a *later* migration, never the same one, so rolling back the app never requires rolling back the schema. A failed migration stops the job and the deploy gate depends on it, so a half-applied schema never gets a matching app shipped on top of it.

## Rollback

Vercel keeps every deployment. In the dashboard, open **Deployments**, find the last good one, and choose **Promote to Production**. Instant, no rebuild.

To roll back in git as well, revert the merge commit on `main` through a pull request rather than force pushing. `main` is never force pushed.

> [!warning]
> A rollback does **not** roll back the database or the bucket. The content, the posts, the credentials, the visitor counts, and every uploaded file are shared across deployments, so a schema change has to be reversed separately and deliberately.

## Known Gaps

| Gap | Consequence |
| :- | :- |
| The Python function has no rehearsal | `dev` is not deployed, so a packaging or routing fault first shows in production unless a preview is pushed by hand. `/api/health` and a promoted rollback are the safety net |
| Losing `STUDIO_ENCRYPTION_KEY` loses every saved credential | Set a new key, reset the password by emailed code, and enter the credentials again |
| The bucket's CORS rule follows `ALLOWED_ORIGINS` only when a storage credential is saved | Changing the origins later does not update the bucket. Save `GCS_BUCKET` again, or set the rule by hand |
| Branch protection is not configured on the remote | The promotion path is a convention, not enforced. Set it under **Settings > Branches** on GitHub |
| `dev` is not the remote default branch | A fresh clone lands on `main` |
| Local `main` is one commit ahead of `origin/main` | Predates this work; resolve before the first production deploy |
| No CI runs lint, typecheck, or the backend tests before a merge | Vercel's build failing is the only current signal |
| `SUPABASE_DB_URL` is not yet set on either GitHub environment | The migration workflow runs and fails; migrations have to be pushed by hand until it is |
| Migration filenames use `0001` rather than a 14-digit timestamp | Unverified against the CLI. `supabase migration list` settles it in one read-only command |
| Fifteen unused packages are removed from `package.json` but still installed | Run `npm install` to prune `node_modules` |
