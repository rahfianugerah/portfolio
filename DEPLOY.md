# Deployment Runbook — Rahfi's Portfolio

> [!important]
> This project deploys to Vercel rather than Cloud Run, which is a recorded deviation from
> `deploy.rules.md`. The reason is that it is a Next application with server actions and API
> routes that Vercel runs directly, and no container of its own.

Target domain: **`rahfi.pro`** (the apex).
The consulting site uses the same configuration and deploys to the `consulting.rahfi.pro`
subdomain.

## Branch to Environment

| Branch | Vercel environment | URL |
| :- | :- | :- |
| `main` | Production | `rahfi.pro` |
| `staging` | Preview | Vercel-assigned preview URL |
| `dev` | Preview | Vercel-assigned preview URL |

A change moves one way, per `branch.rules.md`: `local work > dev > staging > main`, through a
pull request with a recorded human approval at each stage. Never push directly to `staging` or
`main`.

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
```

Repeat with `preview` and `development`. Use a **separate Sanity dataset and Supabase project for
preview** if you do not want preview traffic writing to production analytics.

> [!danger]
> The six without the `NEXT_PUBLIC_` prefix are real secrets: an AI key, a GitHub token, a mail
> password, and a captcha secret. They must never be given that prefix, because a `NEXT_PUBLIC_`
> value is compiled into the bundle the browser downloads and is public the moment it ships. See
> `secret.rules.md`.

> [!note]
> `NEXT_PUBLIC_SUPABASE_ANON_KEY` is public by design — it is the anon key, and row-level security
> is what protects the data behind it. Its policies live in `supabase-rls-policies.sql`.

## Routine Deployment

Once linked, Vercel builds on every push.

| Action | Result |
| :- | :- |
| Push to `dev` | Preview deployment |
| Merge `dev` into `staging` | Preview deployment to verify against |
| Merge `staging` into `main` | Production deployment |

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

## Rollback

Vercel keeps every deployment. In the dashboard, open **Deployments**, find the last good one, and
choose **Promote to Production**. Instant, no rebuild.

To roll back in git as well, revert the merge commit on `main` through a pull request rather than
force pushing. `main` is never force pushed, per `branch.rules.md`.

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
| Fifteen unused packages are removed from `package.json` but still installed | Run `npm install` to prune `node_modules` |
