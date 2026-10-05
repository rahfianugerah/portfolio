# Rahfi's Portfolio

A personal portfolio, blog, and AI assistant at `rahfi.pro`.

@README.md
@PRD.md
@../docs/memory/memory.rules.md

## Rules Come From the Vault, Not From Here

`../docs/rules/` and `../docs/memory/` are the human-authored control plane, and they win on
conflict with anything inferred from this code. Read the memory for decisions already made rather
than re-deriving them.

Never read the whole vault to answer a question about this code. Read this file, then `PRD.md`
for intent, then `README.md`, then the specific rule you need.

The rules this project deviates from are named in `PRD.md` and `README.md`, each with its reason.
A deviation recorded there is a decision, not a gap to close.

## Before You Change Anything Here

Each of these has already cost time in this repository, and each fails silently.

**Never run `npm run build` while `npm run dev` is running against this checkout.** Both write to
`.next/`, and the production build rewrites it underneath the dev server, corrupting its cache.
The symptom is a 500 on `_app.js` together with `ENOENT` rename errors in
`.next/cache/webpack/`, which points at webpack rather than at the cause. Verify with
`npx tsc --noEmit` and `npm run lint`, which touch nothing. Check first:

```bash
# The port shows as owned by Code because VS Code forwards it; match the command line.
Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'next' }
```

**`BACKEND_URL` must be set when the site is built for production.** It is the only variable this site reads. `src/lib/backend.ts` returns it on the server, and the root layout writes it on `<html data-backend-url>`, where every browser call reads it. Static pages are rendered during the build, with the content and the address they find then. Unset in development it is `http://localhost:8000`; unset in a production build, the build logs `BACKEND_URL is not set: content, the studio, the assistant and the contact form will not work.` and still succeeds, with every section empty. Setting the variable afterwards changes nothing until the site is built again.

**Always `localhost`, never `127.0.0.1`.** The backend is `http://localhost:8000`, this site `http://localhost:3000`, and the consulting site `http://localhost:3001`. A browser treats the two names as different sites, so with either side on `127.0.0.1` the studio's cookie is not sent and the backend's `ALLOWED_ORIGINS` refuses the call. Nothing reports why: the studio just keeps returning to sign-in.

**Every studio call needs `credentials: "include"`.** The session cookie lives on the backend's host, and a cross-origin `fetch` sends it only when asked. `api()` in `src/components/studio/api.ts` does it; a studio request made any other way arrives signed out. Every call to the backend is built on `backendUrl()`, because a relative `/api/` path reaches this site, where only `/api/content` and `/api/blog` exist.

**Never merge a backend branch into this one, or this one into a backend branch.** `backend-main` and `backend-dev` live in the same repository with an unrelated history. A merge puts every file of one side into the other, and git only allows it with `--allow-unrelated-histories`, so that flag is the warning.

**A percentage height resolves against nothing when the parent is auto-sized.** This is why the
analytics chart rendered at zero and read as an empty widget: its bars sat in a flex column that
`items-end` never stretched. Any chart needs a definite height somewhere above it.

**`auto-rows-fr` is `minmax(0, 1fr)`, so a grid row's minimum is zero** and a row is allowed to be
shorter than its content. Combined with cells that span two rows, which contribute half their
height to each, it silently collapsed the signals grid. The bento uses an explicit minimum.

**Every bento span must be `lg:`-prefixed.** An unprefixed `col-span-2` inside a one-column grid
makes the browser add a column, turning the mobile layout two-wide with half of it empty. The
tiling must also cover its rows exactly: auto-placement is sparse, so a skipped slot is never
backfilled and has no element to draw its border.

**Font weights come from a font's metadata, not its filename.** Copperplate CC keeps Goudy's
naming, where *Heavy* is the upright regular at `usWeightClass` 400 and Bold is 700.

**No font file belongs in this repository at all.** Every face is served by Google Fonts, which
is what keeps a bundled font's licence obligations from applying here.

## Where Things Live

- **`src/lib/content.ts` is the only thing that reads the `documents` table, and `src/data/blog.ts` the only thing that reads `posts`.** Both go through `src/lib/published.ts`, which reads the backend's public endpoints with a 60-second revalidate; the backend reads with the anon key, so row-level security still limits it to every document and to published posts. Every page and every widget goes through them. A client component cannot, so it reads `/api/content` or `/api/blog`, the two route handlers left here, which hold no secret.
- **An image is a public Google Cloud Storage URL, uploaded in `/studio` under Files.** A document stores the URL as a string. Do not commit an image, and do not add an endpoint that receives a file's bytes: a Vercel function body stops at 4.5 MB, which is why the browser sends them straight to the bucket through a signed URL.
- **This branch is the frontend only. The backend is not here.** It is one FastAPI application on the `backend-main` and `backend-dev` branches of this repository, checked out locally as a second working tree at `../portfolio-backend`, and deployed as its own Vercel project from `backend-main`. Its code, its tests, `requirements.txt`, `api/index.py`, and `supabase/migrations/` are all there. Everything both sites read and the studio writes, both assistants, the contact form, the visitor counter, and the GitHub statistics go through it, and the browser calls it directly.
- **Two servers run locally, from two checkouts.** `npm run dev` here, on `http://localhost:3000`, and in `../portfolio-backend` the command `.venv\Scripts\python -m uvicorn api.index:app --reload --port 8000`, reached as `http://localhost:8000`. There is no `npm run dev:api` and no `npm run test:api` in this branch.
- **`API.md` and `supabase/migrations/` are the contract, and both are on the backend branches.** An endpoint or a table is changed there, never here. A change in this branch that needs a new endpoint needs a commit on `backend-dev` as well.
- **A content type is described in two places that must agree, on two branches.** `src/components/studio/content-schema.ts`, here, is the form the studio draws. `SHAPES` in `backend/sanity_import.py`, on the backend branches, is the list of types the backend accepts.
- **This site holds one environment variable, `BACKEND_URL`, and no secret.** The model key, the mail password, and the storage service account are saved in `/studio` under Settings and sealed by the backend. The Supabase keys, the GitHub token, both reCAPTCHA keys, the service role key, the sealing key, the mail fallback, and `ALLOWED_ORIGINS` belong to the backend's environment. `STUDIO_SERVICE_KEY` no longer exists. Do not add a variable here, and never a `NEXT_PUBLIC_` one.
- **`vercel.json` skips the build when `IS_BACKEND` is `1`.** The repository's two Vercel projects tell themselves apart by that variable, which only the backend project sets, so each skips the other's branches. Do not remove the `ignoreCommand`.
- **`src/proxy.ts` is not what protects the studio.** It only turns away crawlers that name themselves. The session cookie lives on the backend's host, which this site cannot see; a studio page sends a signed-out visitor to `/studio/login` on a 401, and the backend's check on every request is the lock.
- **Six files are left for the owner to delete**, because a permission rule stops an agent deleting them: `src/app/api/chat/route.ts`, `src/lib/ollama.ts`, `src/lib/chat-rate-limit.ts`, `src/lib/rate-limit.ts`, `src/app/actions.ts`, and `src/lib/supabase.ts`. Nothing imports them, and nothing may. The chat route is still built and reads Supabase variables this site no longer has, so they must go before the next production build.
- **`src/data/resume.tsx` is deleted.** Every piece of content is a row, edited in the studio. `src/data/site.ts` holds the origin and the navigation, which are configuration rather than content.
- **Nothing has a fallback, on purpose.** A fallback would be a second copy of the content in the
  repository, which is what this removed. An empty section means an empty table or a failed
  read, and the console says which. Do not add one back.
- **`src/lib/group-roles.ts` collapses the flat role list into one entry per company.** It was
  written out three times across two pages before, and the copies had begun to disagree about
  what "Present" meant. Use it rather than grouping again.
- **`src/data/site.ts` is the single source for navigation and the origin.**
- **Fonts are defined in `app/layout.tsx` and not exported.** A layout may only export a default
  component and Next's own route fields; any other named export fails the generated type check,
  which is what the font exports there used to do.
- **`src/app/components/widgets/widget.tsx`** is the frame every signals cell sits in. Use it
  rather than a cell drawing its own label and padding.

## Two Things Not to Do

- **Do not add a card.** There is no `Card` component; it was deleted rather than left for
  something to reach for. Lists are divided by one hairline between rows, and grids share each
  edge between two cells.
- **Do not reintroduce a colour.** The palette is black, white, and the greys between. Status
  reads from a label, never from a hue.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
