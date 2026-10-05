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

**A Python file placed under `api/` becomes its own Vercel function.** Vercel turns every file in that directory into an endpoint, so a helper module there is deployed as a second function with its own URL and its own cold start. `api/index.py` is one line that imports the application, and all backend code lives in `backend/`.

**A route handler file under `src/app/api` silently wins over the rewrite to the backend.** `next.config.mjs` rewrites `/api/*` to FastAPI, but a file is matched first, so a backend route at the same path is never reached and nothing reports it. Four exist: `/api/analytics`, `/api/github/stats`, `/api/content`, `/api/blog`. A new backend path must not collide with one, and a new route handler must not shadow a backend path.

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

- **`src/lib/content.ts` is the only thing that reads the `documents` table, and `src/data/blog.ts` the only thing that reads `posts`.** Both go through `src/lib/published.ts`, which reads Supabase's REST endpoint with the anon key; row-level security limits that key to every document and to published posts. Every page and every widget goes through them. A client component cannot, so it reads `/api/content`, which serves one payload for all of them.
- **An image is a public Google Cloud Storage URL, uploaded in `/studio` under Files.** A document stores the URL as a string. Do not commit an image, and do not add an endpoint that receives a file's bytes: a Vercel function body stops at 4.5 MB, which is why the browser sends them straight to the bucket through a signed URL.
- **The backend is `backend/`, one FastAPI application.** `api/index.py` is its entry on Vercel, `npm run dev:api` runs it on port 8000 locally, and its tests are `backend/tests`. Everything the studio writes, both assistants, and the contact form go through it.
- **`API.md` and `supabase/migrations/` are the contract.** An endpoint that changes is changed in `API.md` in the same commit, and a table that changes is a new migration, never an edit to an applied one.
- **A content type is described in two places that must agree.** `src/components/studio/content-schema.ts` is the form the studio draws, and `SHAPES` in `backend/sanity_import.py` is the list of types the backend accepts. `backend/routes/content.py` reads that list, so the import module cannot be deleted until `SHAPES` has moved out of it.
- **The model key, the mail password, and the storage service account are not environment variables.** They are saved in `/studio` under Settings and sealed in the `credentials` table. `.env.example` lists only what the studio needs in order to open.
- **`src/proxy.ts` is not what protects the studio.** It redirects a visitor with no cookie to the sign-in page and turns away crawlers that name themselves. The backend checks the session on every request, and that check is the lock.
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
