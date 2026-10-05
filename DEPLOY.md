# Deployment Runbook: Rahfi's Portfolio

> [!important]
> This guide deploys the site only. Vercel runs the Next application from `main`, so there is no container to build and no server to keep alive between requests. The backend is a second Vercel project on the same repository, deployed from `backend-main`, and its own guide is on the backend branches.

Target domain: **`rahfi.pro`** (the apex). The consulting site deploys to the `consulting.rahfi.pro` subdomain and calls the same backend for its content and its assistant.

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
> **The two deployments first meet in production.** With neither `dev` branch deployed there is no preview in which this site calls a deployed backend. `npm run dev` beside a local backend proves the application; it proves nothing about `BACKEND_URL`, the backend's CORS list, or the studio's cookie between two Vercel projects. Check `/api/health` on the backend's domain and the studio on `rahfi.pro` the moment a deployment of either project finishes, and be ready to promote the previous one. The only rehearsal there is has to be made by hand: `vercel` from a checkout builds a preview, but that environment has none of the variables until they are added to it, and with them it talks to the production backend and the production database.

## What Is Already in the Repository

| File | Purpose |
| :- | :- |
| `vercel.json` | Region, per-branch deployment, the `ignoreCommand`, and security headers |
| `next.config.mjs` | Unoptimized images and the `/service` redirect |
| `src/proxy.ts` | The crawler gate |
| `src/lib/backend.ts` | The backend's address, for the server and, through `<html data-backend-url>`, for the browser |
| `.env.example` | The one variable name. Its value is never committed |
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

## How the Site Reaches the Backend

**The site holds one variable, `BACKEND_URL`, and no secret.** The browser calls the backend at that address directly: the studio, the assistant, the contact form, the visitor counter, and the GitHub card. The site's server calls it too, for every page's content and for the contact page's captcha site key. Two Next route handlers remain here, `/api/content` and `/api/blog`, and both only reshape the published reads for client components.

**`BACKEND_URL` has to be set before the site is built.** Static pages are rendered during the build, with the content and the address they find then, and the root layout writes the address on `<html data-backend-url>`, where the browser reads it. A production build without it logs `BACKEND_URL is not set: content, the studio, the assistant and the contact form will not work.` and still succeeds, so the only signs are that line and a site with every section empty. Setting or changing the variable in Vercel does nothing until the project is deployed again.

**The backend has to allow this origin.** Its `ALLOWED_ORIGINS` must contain `https://rahfi.pro`, or the browser refuses every reply. The studio's session cookie is set on the backend's own host; `rahfi.pro` and `api.rahfi.pro` are the same site, so the cookie rides each studio call, which asks for it with `credentials: "include"`. A backend on a domain that is not a subdomain of `rahfi.pro` would break the studio.

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

One, for production. `dev` is not deployed, so there is no preview environment to fill.

```bash
vercel env add BACKEND_URL production
```

What it holds is in `.env.example`. Two conditions:

- **`BACKEND_URL` is the backend's origin, with no path.** Every call adds its own `/api/...`. It has to be set before the first build, per "How the Site Reaches the Backend" above.
- **`IS_BACKEND` is not set here.** It belongs to the backend project alone.

**Remove every other variable this project used to hold**: `STUDIO_SERVICE_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GITHUB_TOKEN`, and `RECAPTCHA_SITE_KEY`. The Supabase keys, the GitHub token, and both reCAPTCHA keys are the backend project's now, beside the service role key, the sealing key, `ALLOWED_ORIGINS`, and the mail fallback. `STUDIO_SERVICE_KEY` no longer exists anywhere. The model key, the model name, the mail settings, the bucket name, and the service account key are not environment variables at all. They are saved in `/studio` under Settings and take effect on the next request with no redeploy.

> [!danger]
> `BACKEND_URL` may not be given a `NEXT_PUBLIC_` prefix. A prefixed value is compiled into the bundle the browser downloads; the browser reads the address from `<html data-backend-url>` instead.

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

5. **Start both local servers.** The commands are in `README.md`. Open the site as `http://localhost:3000` with the backend at `http://localhost:8000`, never `127.0.0.1`: the two names are different sites to a browser, and the studio's cookie would not be sent.
6. **Set the first password.** Open `/studio/login`, choose **Forgot password**, then **Send code**, and enter the code with a password of at least 12 characters. The code is mailed through the backend's mail fallback, because SMTP is not set in the studio yet.
7. **Save the credentials in Settings**: `GCS_BUCKET` and `GCS_SERVICE_ACCOUNT` first, then `LLM_API_KEY` with `LLM_MODEL` and `LLM_BASE_URL` if the defaults are not wanted, then the `SMTP_*` values and `CONTACT_TO`.
8. **Run the one-time import** under Settings, **Import from Sanity**, with the project id and the dataset. It copies every document and post, and every image into the bucket under `imported/`. Running it again changes nothing already imported. Check the local site: no section that had content is empty.

**Step 7 has to come before step 8.** The import copies images into the bucket, so without storage every document that has an image fails with `Storage is not configured.` Documents with no image still import, which makes a half-finished import look like a finished one.

### Then this site

9. **Set this project's environment variable**, per step 5 of the setup, with `BACKEND_URL` pointing at the backend deployed in step 3, and confirm the backend's `ALLOWED_ORIGINS` contains `https://rahfi.pro`.
10. **Delete the six left-behind files**: `src/app/api/chat/route.ts`, `src/lib/ollama.ts`, `src/lib/chat-rate-limit.ts`, `src/lib/rate-limit.ts`, `src/app/actions.ts`, and `src/lib/supabase.ts`, with the `nodemailer` and `@supabase/supabase-js` dependencies. A permission rule stops an agent deleting them. The chat route is still built, and through `src/lib/supabase.ts` it reads Supabase variables this project no longer has, so the build is expected to fail until they are gone.
11. **Merge `dev` into `main`.**
12. **Verify the deployment**, per the section below, starting with `/api/health` on the backend's domain.

**Step 9 has to come before step 11.** Pages are rendered during the build, so a build that runs before `BACKEND_URL` exists ships every page empty and a browser that does not know where the backend is, and it has to be deployed again after the variable is set.

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

1. The backend answers: `/api/health` on its own domain returns `{"status": "ok"}`.
2. Every route returns 200 and shows content: `/`, `/project`, `/blog`, `/experience`, `/contact`, `/chat`. `/service` redirects to `consulting.rahfi.pro/#services`. Content proves `BACKEND_URL` was set when the site was built.
3. The two route handlers respond: `/api/blog`, `/api/content`. The visitor counter and the GitHub card on the home page fill in, which proves the backend allows this origin.
4. `/studio` sends a signed-out visitor to `/studio/login`, and signing in opens the studio and keeps it open from page to page. This proves the session cookie is set on the backend's host and sent with each studio call.
5. A file uploads under Files in the studio, which proves the bucket's CORS rule covers the production origin.
6. The assistant answers at `/chat`, which proves the model key saved in the studio can be opened and the model accepts it.
7. The contact form sends, which proves the two captcha keys in the backend's environment are a pair, and that the mail values work.
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
| The two deployments have no rehearsal together | Neither `dev` branch is deployed, so a fault in `BACKEND_URL`, the backend's CORS list, or the studio's cookie first shows in production unless a preview is pushed by hand. `/api/health` and a promoted rollback are the safety net |
| `BACKEND_URL` is read at build time | A build without it succeeds and ships empty pages. The build log carries the only warning |
| Six superseded files are still in the repository | The chat route among them is expected to fail the build. The owner deletes them before the next production deployment |
| `api.rahfi.pro` is the intended backend domain, not a confirmed one | `BACKEND_URL` has to be set to wherever the backend project is served, and it has to be a subdomain of `rahfi.pro` for the studio's cookie to be sent |
| Branch protection is not configured on the remote | The promotion path is a convention, not enforced. Set it under **Settings > Branches** on GitHub |
| `dev` is not the remote default branch | A fresh clone lands on `main` |
| Local `main` is one commit ahead of `origin/main` | Predates this work; resolve before the first production deploy |
| No CI runs lint or the typecheck before a merge | Vercel's build failing is the only current signal |
| Fifteen unused packages are removed from `package.json` but still installed | Run `npm install` to prune `node_modules` |
