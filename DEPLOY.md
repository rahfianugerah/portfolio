# Deployment Runbook: Rahfi's Portfolio

> [!important]
> This guide deploys the site only. Vercel runs the Next application from `main`, so there is no container to build and no server to keep alive between requests. The backend is a second Vercel project on the same repository, deployed from `backend-main`, and its own guide is on the backend branches.

Target domain: **`rahfi.pro`** (the apex). The consulting site deploys to the `consulting.rahfi.pro` subdomain, reads the same database, and reaches the model through the same backend.

## Two Vercel Projects on One Repository

| Project | Production branch | Domain | `IS_BACKEND` |
| :- | :- | :- | :- |
| The site, which this guide covers | `main` | `rahfi.pro` | Not set |
| The backend | `backend-main` | `api.rahfi.pro`, intended | `1` |

Vercel offers every push to every project linked to the repository, so each project has to turn away the other's branches. Both do it with `ignoreCommand` in `vercel.json`, which Vercel runs before a build and which skips the build when it exits 0.

| Branches | `ignoreCommand` | Skipped by |
| :- | :- | :- |
| `main`, `dev` | `[ "$IS_BACKEND" = "1" ]` | The backend project, where the variable is `1` |
| `backend-main`, `backend-dev` | `[ "$IS_BACKEND" != "1" ]` | This project, where the variable is not set |

**Never set `IS_BACKEND` in this project.** It is the only thing that tells the two projects apart. With it set to `1` here, the command on `main` exits 0 and this project skips every build of its own site, and it reports that as a skipped build, not as an error.

**A push to a backend branch shows in this project as a skipped build.** That is the arrangement working, not a failure to investigate. The same is true the other way round: a merge to `main` shows as skipped in the backend project.

## Branch to Environment

| Branch | Holds | Vercel environment | URL |
| :- | :- | :- | :- |
| `main` | The site | Production, in this project | `rahfi.pro` |
| `dev` | The site | None. It is not deployed | |
| `backend-main` | The backend | Production, in the backend project | `api.rahfi.pro`, intended |
| `backend-dev` | The backend | None. It is not deployed | |

A change to the site moves one way: `local work > dev > main`, through a pull request with a recorded human approval. Never push directly to `main`. The backend branches share no history with these two and are never merged with them.

**Only `main` and `backend-main` are deployed.** This branch's `vercel.json` sets `git.deploymentEnabled` to `false` for `dev`, and the backend's does the same for `backend-dev`, so a push to either builds nothing and publishes nothing. Work is reviewed on the local servers, and the first deployment a change gets is production.

> [!warning]
> **The two deployments first meet in production.** With neither `dev` branch deployed there is no preview in which this site forwards `/api` to a deployed backend. `npm run dev` beside a local backend proves the application; it proves nothing about `BACKEND_URL`, the rewrite between two Vercel projects, or the service key reaching the backend. Check `/api/health` on `rahfi.pro` the moment a deployment of either project finishes, and be ready to promote the previous one. The only rehearsal there is has to be made by hand: `vercel` from a checkout builds a preview, but that environment has none of the variables until they are added to it, and with them it talks to the production backend and the production database.

## What Is Already in the Repository

| File | Purpose |
| :- | :- |
| `vercel.json` | Region, per-branch deployment, the `ignoreCommand`, and security headers |
| `next.config.mjs` | The rewrite of `/api/:path*` to the backend |
| `src/proxy.ts` | The crawler gate, the studio redirect, and the two headers a forwarded request carries |
| `.env.example` | The variable names. Values are never committed |
| `.gitignore` | Already ignores `.vercel` and `.env` |

`vercel.json` pins the region to `sin1` (Singapore) and sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, and `X-Robots-Tag: noai, noimageai` on every response.

## What Is Documented on the Backend Branches

None of these is part of this project, and none of them is in this branch.

| Subject | Where |
| :- | :- |
| The Python function and its packaging | The backend's deployment guide |
| The backend project's environment variables, `IS_BACKEND` among them | The backend's `.env.example` and its deployment guide |
| The Google Cloud Storage bucket: its roles and its CORS rule | The backend's deployment guide |
| `supabase/migrations/` and the workflow that applies them | The backend branches, with the backend's deployment guide |
| Every endpoint | `API.md` on the backend branches |

## How `/api` Reaches the Backend

The browser only ever talks to `rahfi.pro`. `next.config.mjs` rewrites `/api/:path*` to `${BACKEND_URL}/api/:path*`, so the studio's session cookie stays first-party and no CORS is needed. Four paths are Next route handlers in this branch and answer before the rewrite: `/api/analytics`, `/api/github/stats`, `/api/content`, `/api/blog`.

**`BACKEND_URL` is read when the site is built, not when a request arrives.** A production build without it logs `BACKEND_URL is not set: /api is not forwarded, so the studio, chat and contact form will not work.` and adds no rewrite. The build still succeeds, so the only signs are that line in the build log and a site whose studio, assistant, and contact form do not work. Setting or changing the variable in Vercel does nothing until the project is deployed again.

On the way through, `src/proxy.ts` sets two headers on every `/api/*` request: `x-client-ip`, the visitor's address, and `x-service-key`, the value of `STUDIO_SERVICE_KEY`. The backend believes the address only when the key matches its own. **A missing or mismatched key raises no error.** The backend falls back to the address that connected to it, so all visitors share one rate limit and it runs out for everyone at once.

## First-Time Setup

> [!warning]
> Every step below needs an authenticated session. Run them yourself; they cannot be run on your behalf, and no secret should ever be pasted into a chat.

### 1. Authenticate

```bash
vercel login
```

### 2. Link the repository

From the root of this checkout:

```bash
vercel link
```

Choose the scope, then create or select the site's project. This writes `.vercel/`, which is gitignored.

**Select the site's project here, not the backend's.** The link is kept per directory, so the backend's checkout is linked to the backend's project separately. A checkout linked to the wrong project sends `vercel --prod` and `vercel env add` to that project.

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

Six, all for production. `dev` is not deployed, so there is no preview environment to fill.

```bash
vercel env add BACKEND_URL production
vercel env add STUDIO_SERVICE_KEY production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add GITHUB_TOKEN production
vercel env add RECAPTCHA_SITE_KEY production
```

What each holds is in `.env.example`. Three conditions:

- **`BACKEND_URL` is the backend's origin, with no path.** `/api` is added by the rewrite. It has to be set before the first build, per "How `/api` Reaches the Backend" above.
- **`STUDIO_SERVICE_KEY` is the same value in three places:** this project, the backend project, and the consulting project.
- **`IS_BACKEND` is not set here.** It belongs to the backend project alone.

The service role key, the sealing key, `ALLOWED_ORIGINS`, the mail fallback, and the reCAPTCHA secret are the backend project's and are not set in this one. The model key, the model name, the mail settings, the bucket name, and the service account key are not environment variables at all. They are saved in `/studio` under Settings and take effect on the next request with no redeploy.

> [!danger]
> None of these may be given a `NEXT_PUBLIC_` prefix. A prefixed value is compiled into the bundle the browser downloads and is public the moment it ships; every variable here is read on the server instead.

> [!note]
> `SUPABASE_ANON_KEY` is read only on the server. It is the anon key, and row-level security is what protects the data behind it. Its policies live on the backend branches, in `supabase/migrations/`. The service role key is the opposite: it bypasses every policy, and this project never holds it.

### 6. Remove the old preview domain

If `preview-rahfi-portfolio.vercel.app` is still listed under **Settings > Domains**, remove it. It was assigned to `dev` while that branch was deployed, and it now points at a deployment that no longer updates.

## The First Run, in Order

The site ships with no content, so a database that has not been filled renders every section empty. The backend goes first, then the database is filled from the local studio, and this site is deployed last.

### Backend first

The detail of each step is in the backend's deployment guide, on the backend branches.

1. **Apply the migrations by hand.** They create every table the studio needs.
2. **Create the owner row.** One row in `studio_owner` with the `email` column filled and nothing else. There is no sign-up, and a reset code is only ever sent to this address.
3. **Set the backend project's environment variables and deploy `backend-main`.**
4. **Confirm the backend answers.** `/api/health` on the backend's own domain returns `{"status": "ok"}`.

### Then fill the database, from the local studio

Done on a local machine, with the backend's `.env` holding the production Supabase values and the sealing key production uses.

5. **Start both local servers.** The commands are in `README.md`.
6. **Set the first password.** Open `/studio/login`, choose **Forgot password**, then **Send code**, and enter the code with a password of at least 12 characters. The code is mailed through the backend's mail fallback, because SMTP is not set in the studio yet.
7. **Save the credentials in Settings**: `GCS_BUCKET` and `GCS_SERVICE_ACCOUNT` first, then `LLM_API_KEY` with `LLM_MODEL` and `LLM_BASE_URL` if the defaults are not wanted, then the `SMTP_*` values and `CONTACT_TO`.
8. **Run the one-time import** under Settings, **Import from Sanity**, with the project id and the dataset. It copies every document and post, and every image into the bucket under `imported/`. Running it again changes nothing already imported. Check the local site: no section that had content is empty.

**Step 7 has to come before step 8.** The import copies images into the bucket, so without storage every document that has an image fails with `Storage is not configured.` Documents with no image still import, which makes a half-finished import look like a finished one.

### Then this site

9. **Set this project's environment variables**, per step 5 of the setup, with `BACKEND_URL` pointing at the backend deployed in step 3.
10. **Merge `dev` into `main`.**
11. **Verify the deployment**, per the section below, starting with `/api/health` on `rahfi.pro`.

**Step 9 has to come before step 10.** The rewrite is decided during the build, so a build that runs before `BACKEND_URL` exists ships a site that forwards nothing, and it has to be deployed again after the variable is set.

## Routine Deployment

Once linked, Vercel builds on every push to `main`.

| Action | Result in this project |
| :- | :- |
| Push to `dev` | Nothing is built or deployed |
| Merge `dev` into `main` | Production deployment, at `rahfi.pro` |
| Push to `backend-main` or `backend-dev` | A skipped build. The backend project handles its own branches |

To deploy manually:

```bash
vercel            # preview
vercel --prod     # production
```

**When a change needs both sides, deploy the backend first.** A page that calls an endpoint the deployed backend does not have yet fails for every visitor until the backend catches up.

Content, posts, files, and credentials are not part of a deployment. A save in the studio shows on the site within a minute, with no commit and no build.

## Verification After a Deployment

Use a browser for every check that is not marked otherwise. `curl` is one of the scraping tools the site turns away, and the gate covers `/api` as well, so it receives 403 on every path except `/robots.txt`.

1. The backend answers through this site: `rahfi.pro/api/health` returns `{"status": "ok"}`. This is the first proof that `BACKEND_URL` was set when the site was built and that the backend is up.
2. Every route returns 200: `/`, `/project`, `/blog`, `/experience`, `/contact`, `/chat`. `/service` redirects to `consulting.rahfi.pro/#services`.
3. The four route handlers respond: `/api/analytics`, `/api/blog`, `/api/content`, `/api/github/stats`.
4. `/studio` redirects to `/studio/login` when signed out, and signing in opens the studio. This proves the session cookie is set on this origin through the rewrite.
5. A file uploads under Files in the studio, which proves the bucket's CORS rule covers the production origin.
6. The assistant answers at `/chat`, which proves the model key saved in the studio can be opened and the model accepts it.
7. The contact form sends, which proves the captcha site key here matches the secret the backend holds, and that the mail values work.
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

## Rollback

Vercel keeps every deployment. In the dashboard, open **Deployments**, find the last good one, and choose **Promote to Production**. Instant, no rebuild.

To roll back in git as well, revert the merge commit on `main` through a pull request rather than force pushing. `main` is never force pushed.

> [!warning]
> A rollback of this project rolls back the site and nothing else. The backend is a separate deployment with its own history, and the database and the bucket are shared across deployments: the content, the posts, the credentials, the visitor counts, and every uploaded file stay as they are. A backend change or a schema change has to be reversed separately and deliberately, from the backend branches.

## Known Gaps

| Gap | Consequence |
| :- | :- |
| The two deployments have no rehearsal together | Neither `dev` branch is deployed, so a fault in the rewrite, `BACKEND_URL`, or the service key first shows in production unless a preview is pushed by hand. `/api/health` and a promoted rollback are the safety net |
| `BACKEND_URL` is read at build time | A build without it succeeds and forwards nothing. The build log carries the only warning |
| A mismatched `STUDIO_SERVICE_KEY` is silent | Every visitor shares one rate limit, and nothing logs why |
| `api.rahfi.pro` is the intended backend domain, not a confirmed one | `BACKEND_URL` has to be set to wherever the backend project is served |
| Branch protection is not configured on the remote | The promotion path is a convention, not enforced. Set it under **Settings > Branches** on GitHub |
| `dev` is not the remote default branch | A fresh clone lands on `main` |
| Local `main` is one commit ahead of `origin/main` | Predates this work; resolve before the first production deploy |
| No CI runs lint or the typecheck before a merge | Vercel's build failing is the only current signal |
| Fifteen unused packages are removed from `package.json` but still installed | Run `npm install` to prune `node_modules` |
