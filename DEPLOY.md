# Deployment Runbook: Rahfi's Portfolio

> [!important]
> Vercel runs the server actions and the API routes directly, so there is no container to build
> and no server to keep alive between requests.

Target domain: **`rahfi.pro`** (the apex).
The consulting site uses the same configuration and deploys to the `consulting.rahfi.pro`
subdomain.

## Branch to Environment

| Branch | Vercel environment | URL |
| :- | :- | :- |
| `main` | Production | `rahfi.pro` |
| `dev` | Preview | `preview-rahfi-portfolio.vercel.app` |

A change moves one way: `local work > dev > main`, through a pull request with a recorded human
approval. Never push directly to `main`.

**`dev` has a fixed preview URL, not a generated one.** Vercel gives every branch deployment a
URL containing the commit, which changes on every push and cannot be bookmarked or shared ahead
of time. A domain assigned to a git branch always points at that branch's latest deployment, so
`preview-rahfi-portfolio.vercel.app` is stable. Adding it is step 6 of First-Time Setup.

## What Is Already in the Repository

| File | Purpose |
| :- | :- |
| `vercel.json` | Region, per-branch deployment, and security headers. **Byte-identical to the consulting site's.** |
| `.env.example` | The variable names. Values are never committed |
| `.gitignore` | Already ignores `.vercel` and `.env` |

`vercel.json` pins the region to `sin1` (Singapore) and sets `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security` on
every response.

## First-Time Setup

> [!warning]
> Every step below needs an authenticated session. Run them yourself; they cannot be run on your
> behalf, and no secret should ever be pasted into a chat.

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

Without this, Vercel treats its own default as production and a push to the wrong branch goes
live.

### 4. Add the domain

```bash
vercel domains add rahfi.pro
vercel domains add www.rahfi.pro
```

Under **Settings > Domains**, assign `rahfi.pro` to **Production** and redirect `www` to it. Add
the DNS records Vercel shows you at your registrar. An apex domain usually needs an `A` record
rather than the `CNAME` a subdomain takes.

### 5. Environment variables

Unlike the consulting site, this project genuinely needs eleven. Add each to every environment it
applies to:

```bash
vercel env add GEMINI_API_KEY production
vercel env add GITHUB_TOKEN production
vercel env add GMAIL_USER production
vercel env add GMAIL_APP_PASSWORD production
vercel env add RECAPTCHA_SECRET_KEY production
vercel env add NEXT_PUBLIC_RECAPTCHA_SITE_KEY production
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
vercel env add NEXT_PUBLIC_SANITY_DATASET production
vercel env add NEXT_PUBLIC_SANITY_API_VERSION production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add CMS_OWNER_EMAIL production
```

Repeat each with `preview` and `development`. Use a **separate Sanity dataset and Supabase
project for preview** if you do not want preview traffic writing to production analytics.

`SANITY_API_WRITE_TOKEN` is the exception. It is needed only by the one-time migration button on
`/admin`, so add it when you run that and revoke it afterwards.

> [!danger]
> The ones without the `NEXT_PUBLIC_` prefix are real secrets: an AI key, a GitHub token, a mail
> password, a captcha secret, and the owner address. They must never be given that prefix, because
> a `NEXT_PUBLIC_` value is compiled into the bundle the browser downloads and is public the moment
> it ships.

> [!note]
> `NEXT_PUBLIC_SUPABASE_ANON_KEY` is public by design. It is the anon key, and row-level security
> is what protects the data behind it. Its policies live in `supabase/migrations/`.

### 6. Give `dev` a fixed preview URL

Under **Settings > Domains**, add `preview-rahfi-portfolio.vercel.app`. Vercel accepts a second
`.vercel.app` name if nobody has taken it. In the row it creates, open **Edit**, set **Git
Branch** to `dev`, and save.

**Do this from the dashboard, not the CLI.** `vercel domains add` registers a domain on the
account; it does not attach it to a branch, and the branch field is what makes the URL follow
`dev` instead of pointing at one deployment.

From then on every push to `dev` is reachable at that address. Without it Vercel still builds a
preview, but its URL contains the commit, so it changes on every push and cannot be shared before
the push exists.

### 7. Give the migration workflow its secret

The database migrations in `supabase/migrations/` are applied by
`.github/workflows/migrate.yml` on every push to `main`. It reads one secret from a GitHub
environment.

On GitHub, open **Settings > Environments**, create one named `production`, and add a secret
called `SUPABASE_DB_URL`. Its value is the pooler connection string from the Supabase dashboard
under **Project Settings > Database**, with the password filled in.

**The environment name has to be exactly `production`.** The workflow names it, and a secret added
repository-wide instead is not visible to a job that declares an environment.

Check it before you rely on it:

```bash
supabase migration list --db-url "$SUPABASE_DB_URL"
```

That reads and changes nothing. Four rows means the CLI parsed all four migration files.

## Routine Deployment

Once linked, Vercel builds on every push.

| Action | Result |
| :- | :- |
| Push to `dev` | Preview deployment, at `preview-rahfi-portfolio.vercel.app` |
| Merge `dev` into `main` | Production deployment, at `rahfi.pro`, and Supabase migrations applied first |

To deploy manually:

```bash
vercel            # preview
vercel --prod     # production
```

## Verification After a Deployment

1. Every route returns 200: `/`, `/project`, `/service`, `/writing`, `/contact`, `/chat`.
2. The moved URLs redirect rather than 404: `/blog` and `/blog/:slug` to `/writing`, and
   `/experience` to `/#experiences`. All three were published.
3. The three API routes respond: `/api/analytics`, `/api/blog`, `/api/github/stats`.
4. The assistant answers at `/chat`, which proves the Gemini key reached the runtime.
5. The contact form sends, which proves the mail and captcha values did.
6. No font file is reachable at the site root; `/CopperplateCC-Heavy.ttf` must return 404.
7. The signals grid renders all twelve cells, and the analytics and velocity charts draw.
8. Security headers are present:

```bash
curl -sI https://rahfi.pro | grep -i "strict-transport\|x-frame\|x-content-type"
```

## Database Migrations

The schema lives in `supabase/migrations/`, applied in filename order. Nothing else defines it:
the two contradicting `.sql` files that used to sit at the repository root are gone, and with them
the question of which one was pasted into the console last.

| File | Adds |
| :- | :- |
| `0001_analytics_baseline.sql` | `counters`, `daily_stats`, `sessions` |
| `0002_media.sql` | `media` |
| `0003_media_links.sql` | Link rows on `media` |

Those four tables are exactly the four the code queries, so the schema is complete for what ships
today. Sanity content needs no migration; it is a different system.

### How they are applied

`.github/workflows/migrate.yml` runs on a push to `main`, before the deploy. It needs one secret,
`SUPABASE_DB_URL`, set on a GitHub **environment** named `production` rather than
repository-wide, so nothing outside a `main` push can read it. Take the value from **Project
Settings > Database > Connection string**, the pooler URI, with the password filled in.

That is the whole setup. After the secret exists, a merge to `main` applies migrations on its
own, and the job fails the deploy if a migration fails.

**With no staging branch, `main` is the first place a migration ever runs.** The soak period the
promotion shape provides is gone, so read what is pending before you merge. `supabase migration
list` changes nothing and takes a second.

### Applying them by hand

Read what is pending first. This only reads:

```bash
supabase migration list --db-url "$SUPABASE_DB_URL"
```

Then apply:

```bash
supabase db push --db-url "$SUPABASE_DB_URL"
```

This is what the workflow runs. Doing it by hand before merging is how you find out a migration
fails without a failed deploy attached to it.

> [!warning]
> Pasting a migration into the SQL editor in the Supabase dashboard works, and it is also how the
> old drift happened. The editor does not record what it ran, so `supabase_migrations` stays empty,
> `migration list` shows the migration as still pending, and the next `db push` tries to apply it
> a second time. `0001` and `0002` are written with `if not exists` and will survive that; do not
> assume a later one will. If you have already run them by hand, reconcile with
> `supabase migration repair --status applied <version> --db-url "$SUPABASE_DB_URL"` rather than
> letting the two disagree.

> [!important]
> The filenames use a `0001` prefix rather than the 14-digit timestamp the CLI generates. Confirm
> the CLI reads them before relying on the workflow: `supabase migration list` prints one row per
> local migration, so three rows means it parsed all three. If it does not list them, rename them
> to timestamps in one commit, and only while `supabase_migrations` is still empty. Renaming after
> a migration has been applied changes its recorded version and it will be applied again.

### Adding one

Forward-only and additive, per `PRD.md`. Add a column, backfill it, and drop the old one in a
*later* migration, never the same one, so rolling back the app never requires rolling back the
schema. A failed migration stops the job and the deploy gate depends on it, so a half-applied
schema never gets a matching app shipped on top of it.

## Rollback

Vercel keeps every deployment. In the dashboard, open **Deployments**, find the last good one, and
choose **Promote to Production**. Instant, no rebuild.

To roll back in git as well, revert the merge commit on `main` through a pull request rather than
force pushing. `main` is never force pushed.

> [!warning]
> A rollback does **not** roll back the database. Supabase analytics and Sanity content are shared
> across deployments, so a schema change has to be reversed separately and deliberately.

## Known Gaps

| Gap | Consequence |
| :- | :- |
| Branch protection is not configured on the remote | The promotion path is a convention, not enforced. Set it under **Settings > Branches** on GitHub |
| `dev` is not the remote default branch | A fresh clone lands on `main` |
| Local `main` is one commit ahead of `origin/main` | Predates this work; resolve before the first production deploy |
| No CI runs lint or typecheck before a merge | Vercel's build failing is the only current signal |
| `SUPABASE_DB_URL` is not yet set on either GitHub environment | The migration workflow runs and fails; migrations have to be pushed by hand until it is |
| Migration filenames use `0001` rather than a 14-digit timestamp | Unverified against the CLI. `supabase migration list` settles it in one read-only command |
| Fifteen unused packages are removed from `package.json` but still installed | Run `npm install` to prune `node_modules` |
