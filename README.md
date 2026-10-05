# Rahfi's Portfolio

![Next](https://img.shields.io/badge/Next-16.3.5-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.3.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)
![HeroUI](https://img.shields.io/badge/HeroUI-3.2.5-000000)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.142-009688?logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.116.0-3FCF8E?logo=supabase&logoColor=white)
![Node](https://img.shields.io/badge/Node-20-5FA04E?logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Managed-000000?logo=vercel&logoColor=white)
![pytest](https://img.shields.io/badge/pytest-9.1.1-0A9EDC?logo=pytest&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-2EA043)
![License](https://img.shields.io/badge/License-Private-750014)

Live at [rahfi.pro](https://rahfi.pro). Intent is in `PRD.md`; deployment is in `DEPLOY.md`; every endpoint is in `API.md`.

## Table of Contents

1. Project Overview
2. Features
3. Technology Stack
4. Frontend Architecture
5. Project Structure
6. Configuration
7. Routing, Pages, and Components
8. State and Data Management
9. Authentication, Styling, and Accessibility
10. Testing, Errors, and Performance
11. Development and Deployment

## 1. Project Overview

A personal site that carries a résumé, a project catalogue, writing, and a conversational
assistant that answers questions about the work. It is read by recruiters, prospective clients,
and other engineers, all of whom arrive cold and scan once.

It shares a design language with the consulting practice at `consulting.rahfi.pro`, deliberately.
The two are the same person at two levels of formality.

## 2. Features

### What a Visitor Can Do

| Feature | Where | What it does |
| :- | :- | :- |
| Interactive home | `/` | A landing page in a centred column: hexagons behind the hero that light up under the pointer, a draggable globe marking Jakarta, the skills in a two-row icon marquee, and figures that count up as they come into view |
| Résumé and work history | `/`, `/experience` | Every role, education entry, and leadership position, grouped by company. On `/experience` each sits on an Aceternity UI timeline that fills as the page scrolls |
| Project catalogue | `/project` | A bento grid of HeroUI cards, one preview image or video per project, each opening the project's own page with its stack and links, and a terminal while the page loads |
| Certificates | `/project` | Professional certifications and course completions, five to a page. A certificate with an uploaded PDF opens on the page itself rather than sending the reader away |
| Writings | `/blog`, `/blog/[slug]` | Every post as a card, three to a row, under a heading band over the hexagons; each post written in Markdown in the studio and rendered with syntax-highlighted code blocks |
| Services | The signals section on `/` | A summary of what the work covers. The engagement itself is the consulting practice, and the card links there |
| Contact | `/contact` | A validated form that the backend turns into an email to the owner, with a captcha and a rate limit in front of it |
| Ashley, the AI assistant | `/chat` | Answers questions about the work from the same documents the pages render. She runs on any OpenAI-compatible model through the backend. The key and the model name are saved in the studio and sealed in the database, so the browser never sees the key or the model host |
| Light and dark themes | Everywhere | Follows the system by default, and remembers an explicit choice |

### The Signals Dashboard

The home page ends on a Magic UI bento grid of live cards, spanned so every row ends on one line. Each one is independent: it renders a skeleton while it loads and a fallback if its source is unreachable, so one failing card never takes the page with it.

| Card | Source |
| :- | :- |
| Website visitors | Supabase, first-party, counted on this site |
| GitHub activity and latest repositories | The GitHub API, cached for an hour |
| Experiences velocity | Derived from the résumé data |
| Tech stack and specialties | The résumé data |
| Moments and quotations | Supabase, edited in the studio |
| Latest writing | Supabase, the `posts` table |
| Projects overview and social links | Mixed |
| Clock | The browser, in Asia/Jakarta |

### What the Owner Can Do

| Feature | Where | What it does |
| :- | :- | :- |
| Sign in | `/studio/login` | One owner account, with a password of the owner's choosing. A forgotten password, and the first one, is set with a six-digit code emailed to the owner |
| Write posts | `/studio/posts` | A Markdown editor with a preview beside it. Dropping a `.md` file fills the form from its front matter. A post is a draft or published, and publishing needs no commit and no deploy |
| Manage files | `/studio/files` | A Google Drive style file manager over a Google Cloud Storage bucket: folders, drag-and-drop upload of one file or many, preview, rename, move, delete, and a button that copies a file's public address |
| Edit content | `/studio/content` | Every content type either site shows, fourteen in all, each with a form built from one schema |
| Change credentials | `/studio/settings` | The model key and name, the mail settings, and the storage service account. A secret can be replaced or cleared, never read back |
| Change the password | `/studio/settings` | Needs the current password, and signs every session out |
| Import from Sanity | `/studio/settings` | A one-time copy of every document, post, and image out of the old dataset. Safe to run twice |

> [!note]
> Nothing on this site requires a visitor to sign in, and nothing collects a name or an address
> except the contact form, which sends it and stores nothing.

> [!important]
> A project's page renders its repository's README with the README's own HTML, the way GitHub
> does. That HTML comes from outside this codebase, so it is parsed by `rehype-raw` and then
> cleaned by `rehype-sanitize` with its default schema, which follows GitHub's, before anything
> renders. Nothing reaches the page through `dangerouslySetInnerHTML`. This is the recorded
> deviation `security.rules.md` asks for when stored or fetched HTML has to render.


## 3. Technology Stack

| Category | Technology | Version |
| :- | :- | :- |
| Runtime | Node | 20 |
| Framework | Next | 16.3.5 |
| Language | TypeScript | 6.0.3 |
| Build tool | Next, Turbopack | 16.3.5 |
| Router | Next App Router | 16.3.5 |
| Data fetching | Server Components, `fetch` | 16.3.5 |
| Styling | Tailwind CSS, shadcn token layer, HeroUI theme | 4.3.3 |
| Icons | Lucide, React Icons | 1.46.0, 5.7.0 |
| Backend | FastAPI on Python, as one Vercel function | 0.142, 3.12 |
| Content | Supabase PostgreSQL rows, Markdown through `react-markdown` | 10.1.0 |
| Database | Supabase, PostgreSQL | 2.116.0 |
| File storage | Google Cloud Storage, through `google-cloud-storage` | 3.16.0 |
| Password and secrets | Argon2id through `argon2-cffi`, AES-256-GCM through `cryptography` | 25.1.0, 50.0.2 |
| AI | Any OpenAI-compatible endpoint, over HTTP with an API key | No client library |
| Animation | Framer Motion | 13.3.0 |
| UI components | HeroUI | 3.2.5 |
| Copied components | Magic UI, Aceternity UI, shadcn/ui | Source in the repository |
| Testing | pytest, for the backend. The frontend has none | 9.1.1 |
| Deployment | Vercel | Managed |

## 4. Frontend Architecture

### Architecture Type

Hybrid. Most routes are static React Server Components; the assistant, the widgets, and the studio are client components. A FastAPI backend does every write and every call that needs a secret.

### Architecture Description

A single shell in `src/app/components/layout-content.tsx` supplies the top bar, a full-width page, and the footer for every public route. The studio under `/studio` has its own shell.

**Reading and writing take two different paths.** Pages read published content straight from Supabase, with the anon key, through `src/lib/content.ts` and `src/data/blog.ts`, because they are rendered at build time, before the backend exists. Row-level security limits that key to every document and to published posts. Everything else goes to the backend: the studio's saves, Ashley, the consulting site's assistant, and the contact form.

The backend is one FastAPI application in `backend/`. In production it is a Vercel Python function entered through `api/index.py`; locally it is uvicorn on port 8000. `next.config.mjs` rewrites `/api/*` to it. Four Next route handlers under `src/app/api` are files, so they are matched before the rewrite and keep answering: analytics, GitHub statistics, the content payload for client components, and the blog list. All four only read.

`src/proxy.ts` sits in front of every page. It turns away crawlers that identify themselves, and sends a visitor with no session cookie from `/studio` to the sign-in page.

### Main Layers

| Layer | Responsibility |
| :- | :- |
| `src/proxy.ts` | The crawler gate and the studio redirect |
| `src/app/layout.tsx` | Fonts, metadata, providers |
| `src/app/components/layout-content.tsx` | Top bar, full-width page, footer |
| `src/app/(site)/` | The public pages |
| `src/app/studio/` | The owner's panel |
| `src/app/api/` | The four read-only route handlers |
| `src/components/` | Shared components and primitives, and `studio/` for the panel's own |
| `src/lib/` | Content readers, the crawler list, Supabase, helpers |
| `src/data/` | The origin and navigation, and the post reader |
| `backend/` | The FastAPI application: authentication, credentials, files, posts, documents, the assistants, mail |
| `api/index.py` | The Vercel function's entry. One line, importing the application |
| `supabase/migrations/` | The schema |

### Application Flow

```text
Route > Proxy > Root Layout > Layout Content > Page > Component > Data Source
```

### User Interaction Flow

```text
User Action > Handler > Route Handler or Backend > State Update > Render
```

### Rendering Strategy

Static generation for the content routes, with a read revalidated every 60 seconds so a save in the studio shows without a deploy. Client rendering for the studio, the widgets, and the assistant. The backend renders nothing.

## 5. Project Structure

```text
api/
└── index.py                  # The Vercel Python function: imports the app from backend/
backend/
├── main.py                   # Routers, CORS, the one shape every error takes
├── routes/                   # public, account, files, content
├── auth.py                   # The owner account: sign-in, lockout, sessions, reset codes
├── crypto.py                 # Argon2id and AES-256-GCM
├── vault.py                  # The credentials saved in the studio
├── storage.py                # Google Cloud Storage as a drive
├── db.py, llm.py, mail.py, ratelimit.py, config.py
├── sanity_import.py          # The one-time import
└── tests/                    # pytest
src/
├── proxy.ts                  # Crawler gate, studio redirect
├── app/
│   ├── layout.tsx            # Fonts, metadata, providers
│   ├── robots.ts             # robots.txt
│   ├── globals.css           # Tokens
│   ├── (site)/               # Home, project, blog, contact, experience, chat
│   ├── studio/               # login, posts, files, content, settings
│   ├── api/                  # analytics, blog, github/stats, content
│   └── components/           # Page-level components and widgets
├── components/               # Shared components, magicui, ui primitives, studio
├── data/                     # site.ts, blog.ts
└── lib/                      # content, published, crawlers, group-roles, supabase, helpers
supabase/
└── migrations/               # 0001 to 0003, applied in filename order
```

### Directory Explanation

| Directory | Purpose | In git |
| :- | :- | :- |
| `backend/` | Every write and every call that needs a secret | Committed |
| `api/` | The function entry and nothing else. A second Python file here becomes a second function | Committed |
| `src/components/studio/` | The studio's forms, file browser, editor, and `content-schema.ts`, which describes every content type once | Committed |
| `src/data/` | The origin and the navigation. Everything else is a row in the database | Committed |
| `src/app/components/widgets/` | The signals grid cells, all on one shared frame | Committed |
| `src/lib/` | Everything with no JSX in it | Committed |
| `supabase/migrations/` | The schema, forward-only | Committed |
| `.venv/` | The Python environment | Gitignored |
| `.env`, `.env.local` | Local values | Gitignored |

> [!note]
> Five things are superseded by the backend and await removal by the owner: `src/app/api/chat/route.ts`, `src/lib/ollama.ts`, `src/lib/chat-rate-limit.ts`, `src/lib/rate-limit.ts`, and the `submitContactForm` action in `src/app/actions.ts`, with the `nodemailer` dependency it uses. Nothing calls them.

## 6. Configuration

### Configuration Files

| File | Purpose |
| :- | :- |
| `.env.example` | Environment variable reference |
| `next.config.mjs` | The rewrite of `/api/*` to the backend, unoptimized images, and the `/service` redirect |
| `vercel.json` | Region, the Python function, branch deployment, and response headers |
| `requirements.txt` | What the deployed backend installs |
| `requirements-dev.txt` | The same, plus uvicorn, pytest, and `python-dotenv` for a local machine |
| `eslint.config.mjs` | ESLint flat config, extending Next's core web vitals rules |
| `supabase/migrations/` | Every table, policy, and function |
| `.github/workflows/migrate.yml` | Applies the migrations on a push to `main` |

### Environment Variables

| Variable | Required | Description | Example |
| :- | :- | :- | :- |
| `SUPABASE_URL` | Yes | The Supabase project | `https://your_project_ref.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | Reads published content and counts visitors | `your_supabase_anon_key_here` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | The backend's database access. Bypasses row-level security | `your_supabase_service_role_key_here` |
| `STUDIO_ENCRYPTION_KEY` | Yes | 32 random bytes, base64. Seals the password digest and every saved credential | `your_base64_32_byte_key_here` |
| `STUDIO_SERVICE_KEY` | Yes | Shared with the consulting deployment, which sends it to reach the model | `your_long_random_service_key_here` |
| `ALLOWED_ORIGINS` | Yes | The origins allowed to make a studio write. Comma separated, no trailing slash | `https://rahfi.pro,https://consulting.rahfi.pro` |
| `GMAIL_USER` | Until SMTP is saved in the studio | Mail fallback, so the first reset code can be sent | `your_email@example.com` |
| `GMAIL_APP_PASSWORD` | Until SMTP is saved in the studio | The app password for that address | `your_16_character_app_password` |
| `GITHUB_TOKEN` | Yes | Read-only token for the GitHub statistics | `your_github_token_here` |
| `RECAPTCHA_SECRET_KEY` | Yes | Captcha verification | `your_recaptcha_secret_key_here` |
| `RECAPTCHA_SITE_KEY` | Yes | Captcha site key | `your_recaptcha_site_key_here` |

### Credentials Saved in the Studio

These are not environment variables. They are entered under `/studio/settings`, sealed with AES-256-GCM, and used on the next request with no redeploy.

| Name | Holds | Default |
| :- | :- | :- |
| `LLM_API_KEY` | The model key | |
| `LLM_MODEL` | The model name | `gpt-oss:120b` |
| `LLM_BASE_URL` | Any OpenAI-compatible endpoint | `https://ollama.com/v1` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Where mail is sent from | `smtp.gmail.com`, `587` |
| `CONTACT_TO` | Where the contact form's mail goes | The value of `SMTP_USER` |
| `GCS_BUCKET` | The bucket that holds every file | |
| `GCS_SERVICE_ACCOUNT` | The service account's JSON key | |

> [!danger]
> No variable here carries the `NEXT_PUBLIC_` prefix, and none may be given it: a prefixed value is compiled into the bundle the browser downloads. Every variable is read on the server. The one value the browser needs, the captcha site key, is handed to its page as a prop, and it is an identifier rather than a secret.

> [!warning]
> **Losing `STUDIO_ENCRYPTION_KEY` makes every saved credential unreadable and the password unusable.** Nothing can recover them, because the key is the only thing that opens them and it is deliberately not in the database. Set a new key, reset the password by emailed code, and enter the credentials again. Keep a copy in a password manager.

> [!note]
> `SUPABASE_ANON_KEY` is read by the analytics route and by the content readers. It would be safe in the browser anyway, because row-level security is what protects the data behind it; the policies are in `supabase/migrations/`.

### Environments

| Environment | Purpose | Branch |
| :- | :- | :- |
| Development | Local development, on two local servers | `dev` |
| Production | Live at `rahfi.pro` | `main` |

There is no preview environment. `vercel.json` disables deployment for `dev`.

## 7. Routing, Pages, and Components

### Routing Method

Next App Router, file-based.

### Main Routes

| Route | Page or layout | Access |
| :- | :- | :- |
| `/` | Home | Public |
| `/project` | Projects and certifications, full width | Public |
| `/project/[slug]` | One project, with its repository's README | Public |
| `/service` | Permanent home is the consulting site; redirects to `consulting.rahfi.pro/#services` | Public |
| `/chat` | Ashley, the AI assistant | Public |
| `/blog` | Blog list | Public |
| `/blog/[slug]` | Blog post | Public |
| `/contact` | Contact form | Public |
| `/experience` | Work history | Public |
| `/robots.txt` | Generated by `src/app/robots.ts` | Public |
| `/studio/login` | Sign in, and set or reset the password | Public |
| `/studio` | The studio's index | Owner |
| `/studio/posts`, `/studio/posts/[id]` | The post list and the Markdown editor | Owner |
| `/studio/files` | The file manager | Owner |
| `/studio/content`, `/studio/content/[type]` | The content types and the documents of one | Owner |
| `/studio/settings` | Credentials, the password, the one-time import | Owner |

Endpoints are in `API.md`.

Home carries anchored sections: `#hero`, `#experience`, `#education`, `#signals`, `#achievements`, `#contact`.

### Main Layouts

| Layout | Purpose | Used by |
| :- | :- | :- |
| `layout-content.tsx` | Top bar, full-width page, footer | Every public route |
| `Shell` | The studio's navigation and sign-out | Every `/studio` route except the sign-in page |

### Main Components

| Component | Category | Responsibility |
| :- | :- | :- |
| `TopNavbar` | Layout | Fixed top bar: the wordmark, the routes with the current one marked, the online indicator, and the blur band the page scrolls under |
| `Navbar` | Layout | The bottom dock, shown only below `md` where the top bar hides its links: the same routes as icons, plus socials and the theme toggle |
| `ResumeCard` | Feature | One company, expandable |
| `ProjectShowcase` | Feature | One project as a bento cell: its preview, status, title, and two lines, linking to its own page |
| `CertificateList` | Feature | Certificates, five to a page, with the PDF readable in place |
| `MarqueeBand` | Feature | Two rows of names beside their icons, moving in opposite directions and pausing under the pointer, at a speed set by the length of the text |
| `ProjectMarquee` | Feature | The projects in a `MarqueeBand`, each title beside its preview or a folder icon |
| `GitHubCard` | Feature | The GitHub profile, an activity strip, and the latest repositories |
| `Globe` | Magic UI | A draggable WebGL globe with one marker, on Jakarta, drawn in black and white in both themes |
| `NumberTicker` | Magic UI | A figure that counts up when it scrolls into view |
| `InteractiveHexagonPattern` | Magic UI | The hexagon grid behind the hero, every page heading, and the contact band, lit under the pointer |
| `Marquee` | Magic UI | One row moving on its own, the base of `MarqueeBand` |
| `BentoGrid` | Magic UI | The frame the signal cards are laid into |
| `Terminal` | Magic UI | The intro that opens a visit, and the screen that opens `/project` every time |
| `SiteIntro` | Layout | A terminal over the whole screen on a visitor's first page of a session, skipped by any key, a click, or reduced motion |
| `ProjectSplash` | Layout | The same terminal overlay under the top bar each time `/project` opens, from the `/project` layout so a cached visit plays it too |
| `Timeline` | Aceternity UI | The rail `/experience` sets every role and school on |
| `SiteFooter` | Layout | Columns of routes and links, and a closing line divided by HeroUI separators |
| `AssistantChat` | Feature | Ashley, on `/chat` |
| `Markdown` | Feature | A post's Markdown, with raw HTML parsed and then sanitized |
| `PostEditor` | Studio | The Markdown editor, its preview, and the `.md` drop target |
| `FileBrowser` | Studio | The file manager, also opened from a form to pick an image |
| `DocumentForm` | Studio | One form for every content type, drawn from `content-schema.ts` |

### Important Component Details

#### `Widget`

Purpose: the shared frame for every cell in the signals grid: one eyebrow, one padding, one
height, so the grid reads as a table rather than a pile.

| Property | Type | Required | Description |
| :- | :- | :- | :- |
| `title` | `string` | Yes | The eyebrow label |
| `meta` | `ReactNode` | No | Right-aligned secondary label |
| `bodyClassName` | `string` | No | Applied to the body |

> [!warning]
> Do not put `min-h-0` on a widget body. It lets the cell shrink below its content, which is what
> made two charts render at zero height. It belongs only where something actually scrolls.

## 8. State and Data Management

### State Management Method

Local component state and React context. There is no store.

### State Categories

| Category | Storage method | Purpose |
| :- | :- | :- |
| Local UI state | `useState` | Expansion, carousels, hover |
| Global state | Context | Theme, blog reading state |
| Server state | `fetch` in effects | Analytics, GitHub, blog |
| Persistent state | `sessionStorage` | Assistant history, visitor session id |
| Owner session | An `HttpOnly` cookie | The studio sign-in. No script can read it |

### State Flow

```text
User Action > Handler > Route Handler or Backend > State Update > Render
```

### Content Source

Everything lives in Supabase PostgreSQL, in two tables that `supabase/migrations/0003_studio.sql` creates. `documents` holds one row per content document, with its fields as JSON. `posts` holds one row per post, with its body as Markdown.

| Content | Lives in | Edited through |
| :- | :- | :- |
| Blog posts | `posts` | `/studio/posts` |
| Projects | `documents`, type `project` | `/studio/content` |
| Certificates | `documents`, type `certificate` | `/studio/content` |
| Home carousel photographs | `documents`, type `moment` | `/studio/content` |
| Home carousel quotations | `documents`, type `quote` | `/studio/content` |
| Consulting engagements | `documents`, type `clientProject` | `/studio/content` |
| Consulting track record figures | `documents`, type `counter` | `/studio/content` |
| Companies and schools | `documents`, type `organization` | `/studio/content` |
| Work and leadership | `documents`, type `role`, each pointing at an organization | `/studio/content` |
| Education | `documents`, type `education`, pointing at the same organizations | `/studio/content` |
| Achievements | `documents`, type `achievement` | `/studio/content` |
| The name, role, summary and social links | `documents`, the single `profile` row | `/studio/content` |
| Skills | `documents`, type `skillGroup` | `/studio/content` |
| Services | `documents`, type `service`, shown only in the signals section | `/studio/content` |
| Page titles and descriptions, for both sites | `documents`, type `pageMeta` | `/studio/content` |
| Images, PDFs, Markdown files | The Google Cloud Storage bucket, referenced by public URL | `/studio/files` |

`src/lib/content.ts` is the only place that reads `documents`, `src/data/blog.ts` is the only place that reads `posts`, and both go through `src/lib/published.ts`. **Nothing has a fallback.** That is deliberate: a fallback would be a second copy of every project, role and photograph living in the repository. An unreachable database renders an empty section and logs why.

A read is cached for 60 seconds, so a save in the studio is on the site within a minute, with no commit and no deploy. A draft post cannot be read at all: the anon key's policy filters on `published`.

What is left in `src/data/` is `site.ts`, which holds the origin and the navigation. Neither is content: the origin is needed synchronously by `metadataBase`, and the navigation is a map of this application's own routes.

> [!note]
> A company or a school is one `organization` document, and roles and education both point at it. The name, the website and the logo are written once: an employer with three roles under it carries one logo rather than three copies that drift apart, and a place that is both an employer and a school, which several of these are, is one document serving both.

> [!note]
> A project link carries an `icon` string, `github` or `globe`, and `ProjectShowcase` decides which component that means. Content holds no React element, which is what lets it live in a database at all.

> [!note]
> One studio and one database serve both sites. `consulting.rahfi.pro` reads the same `documents` rows with the anon key, redirects its own `/studio` here, and reaches the model through this backend with a shared service key, so a model change in the studio reaches both assistants.

> [!important]
> The existing content came out of Sanity once, from the import under `/studio/settings`. Each document is written under an id derived from its Sanity id, so running it twice adds nothing. Nothing keeps the two in step afterwards, and the importer is to be deleted once it has run.

### Data Fetching Method

Server Components read résumé content and posts from Supabase. Client components `fetch` the internal route handlers for the widgets, and the backend for the assistant, the contact form, and everything in the studio.

### Data Request Flow

```text
Component > Route Handler or Backend > External Service > Response > State Update
```

### Loading, Empty, and Error States

| State | Interface behaviour |
| :- | :- |
| Loading | A skeleton inside the widget frame, so the cell keeps its shape |
| Empty | An explicit message; the writing list and repository list both have one |
| Error | `WidgetFallback` replaces the cell; the page is unaffected |
| Success | The rendered content |

The three are mutually exclusive: a widget returns the fallback on error, the skeleton while
loading, and content otherwise.

### Browser Storage

| Data | Storage | Purpose | Expiration |
| :- | :- | :- | :- |
| Assistant history | `sessionStorage` | Survive a reload within the tab | Tab close |
| Visitor session id | `sessionStorage` | Deduplicate a visit | Tab close |
| `studio_session` | `HttpOnly` cookie | The owner's sign-in | 12 hours, or sign-out |

Session-scoped on purpose: a conversation about someone's CV is not left behind on a shared
machine. **No token is stored in browser storage.** The studio's session is a cookie no script can read.

## 9. Authentication, Styling, and Accessibility

### Authentication Method

A visitor never signs in. The studio has one account, the owner's, and there is no sign-up route.

| Part | How it works |
| :- | :- |
| The account | One row in `studio_owner`, created by hand with an email address and nothing else |
| The password | Of the owner's choosing, at least 12 characters. Stored as an Argon2id digest, and that digest sealed with AES-256-GCM under a key that is in the deployment environment and never in the database |
| A forgotten or first password | A six-digit code emailed to the address in that row and to no other. A request can neither choose the address nor learn it. The code lasts 10 minutes, works once, and dies after 5 wrong attempts |
| The session | An opaque random token in an `HttpOnly`, `SameSite=Lax` cookie, for 12 hours. The database holds only its SHA-256. Signing out revokes it, and changing the password revokes every session |
| Failed sign-ins | Every failure gets the same reply. Five lock the account for 15 minutes, and a reset code lifts the lock |
| The check | `src/proxy.ts` redirects a visitor without the cookie from `/studio` to `/studio/login`. That is a convenience. The backend verifies the session on every request, and a write must also come from an allowed `Origin` |

### What Is Sealed at Rest

The password digest, the model key, the mail password, and the storage service account key are AES-256-GCM ciphertext in the database, each under its own nonce and bound to the row it belongs to, so a blob lifted from one row cannot be pasted into another. A dump of the database yields nothing usable without `STUDIO_ENCRYPTION_KEY`. The studio shows only whether a secret is set, never its value.

### AI Crawlers Are Refused, Search Engines Are Not

`src/lib/crawlers.ts` holds one list that both `src/app/robots.ts` and `src/proxy.ts` read. A crawler that collects pages for a model, a scraping library, a headless browser, or a request with no `User-Agent` receives 403, and the AI crawlers are disallowed by name in `robots.txt`. Every response carries `X-Robots-Tag: noai, noimageai`. Search engines and link previews are deliberately left alone, because the site is meant to be found and shared. `robots.txt` also disallows `/studio` and `/api/` for everyone.

**This stops a crawler that says who it is, and nothing else.** A scraper that sends a browser's `User-Agent` walks past both, and nothing served to the public can prevent that.

### No Site Icon

The site has no icon, on purpose. No favicon file exists, and the root layout declares an empty one, which stops a browser asking for `/favicon.ico` anyway.

### Styling Method

Tailwind CSS 4, configured CSS-first in `src/app/globals.css`, over the shadcn tokens and HeroUI's
theme variables.

### Design System

Shared with `consulting.rahfi.pro`, and defined here: a shadcn token layer with a light and a
pitch black dark theme, rounded cards on a soft shadow, and no colour at all: black, white, and
the greys between. HeroUI's variables point at the same palette, so its cards, separators, and
skeletons match, and every paragraph is justified. Section titles follow one pattern, `Rahfi's | Title.`, in the same colour as the text
around them.

> [!note]
> The language is defined here and shared with `consulting.rahfi.pro`, so a visitor moving between
> the two sites sees one identity at two levels of formality.

### Theme Structure

| Item | Source |
| :- | :- |
| Colors | `src/app/globals.css`, `:root` and `.dark` |
| Typography | `src/app/layout.tsx` and `src/app/globals.css` |
| Spacing | Tailwind defaults |
| Breakpoints | Tailwind defaults |

### Typography

| Face | Role | Licence |
| :- | :- | :- |
| Google Sans | Headings in bold, body, UI, labels | Google Fonts |
| Inter | Fallback behind Google Sans | SIL OFL 1.1, Google Fonts |
| Source Code Pro | Code blocks only | SIL OFL 1.1, Google Fonts |

> [!warning]
> Google Sans arrives through a stylesheet link in `src/app/layout.tsx` rather than `next/font`,
> with a preconnect pair in front of it. Inter is loaded through `next/font` and named behind Google Sans
> in the family stack, so a slow font response does not shift the page. The lint rule that fires
> on that link is a Pages Router rule and is disabled at the line.

> [!note]
> No font file lives in this repository. Every face is served by Google Fonts, which is what keeps
> the licence obligations of a bundled font from applying here at all.

### Responsive Design

Tailwind's default breakpoints, with every page in a 1152 pixel column. The signals bento has four
columns at `lg`, two at `md`, and one below.

### Accessibility Practices

- Semantic HTML, with one `h1` per page
- Keyboard navigation, including the mobile menu as a native disclosure
- Focus management, `focus-visible` outlines on every control
- Form labels
- Alternative text
- Colour contrast against the black ground
- `prefers-reduced-motion` honoured by the carousels

### Accessibility Standard

Not formally audited.

## 10. Testing, Errors, and Performance

### Testing Strategy

The backend has a pytest suite in `backend/tests`, 124 tests. It runs against an in-memory stand-in for Supabase, so it needs no database, no network, and no credential. The frontend has no test suite: it is verified with `npx tsc --noEmit`, `npm run lint`, and by checking the routes.

### Running Tests

With the Python environment activated:

```bash
npm run test:api
```

### Error Categories

| Category | Description |
| :- | :- |
| Validation | Contact form input, checked by Zod in the browser and again by the backend |
| Network | An external service is unreachable; the widget shows a fallback |
| Not found | Route does not exist |
| Application | Unexpected render failure |

### Error Flow

```text
Error > Try/Catch or Boundary > Fallback Component > Console Log
```

### Performance Strategy

- Static generation for content routes
- Code splitting and tree shaking
- Images served from public Google Cloud Storage URLs at the size they were uploaded, with `images.unoptimized` set
- Font optimization through `next/font`, self-hosted
- Caching: GitHub stats revalidate hourly
- Published content cached for 60 seconds
- Rate limiting on sign-in, reset codes, the contact form, and both assistants, counted in PostgreSQL

### Performance Monitoring

| Metric or area | Tool or method |
| :- | :- |
| Visitor analytics | Supabase, first-party |
| Deployment analytics | Vercel |

## 11. Development and Deployment

### Requirements

- Node 20 or newer, and npm
- Python 3.12
- A Supabase project, and the Supabase CLI to apply the migrations
- A Google Cloud Storage bucket, for files. `DEPLOY.md` says what it needs
- A current browser

### Setup

Eight steps. Steps 1 to 5 get the site and the studio running; steps 6 to 8 are done once, in the studio.

**1. Install.** The Node packages, and a Python environment named `.venv` for the backend.

```bash
npm install
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements-dev.txt
```

On macOS or Linux the activation script is `.venv/bin/activate`.

**2. Configuration.** Copy the template and fill it in by hand. Do not commit the local file.

```bash
cp .env.example .env
```

Generate `STUDIO_ENCRYPTION_KEY` with:

```bash
python -c "import os,base64;print(base64.b64encode(os.urandom(32)).decode())"
```

**`ALLOWED_ORIGINS` must include `http://localhost:3000` for local work.** The backend refuses a studio write from any origin not on that list, so without it sign-in works and every save fails with `That request did not come from the studio.` That is deliberate: the `Origin` check is what stands in for a CSRF token.

**3. Apply the migrations.** They create every table. `SUPABASE_DB_URL` is the pooler connection string from the Supabase dashboard.

```bash
supabase db push --db-url "$SUPABASE_DB_URL"
```

**4. Create the owner row.** In the Supabase table editor, insert one row into `studio_owner` with the `email` column filled and nothing else. There is no sign-up, and this address is the only one a reset code is ever sent to.

**5. Start both servers**, each in its own shell.

```bash
npm run dev:api
```

```bash
npm run dev
```

The site is at `http://localhost:3000` and the backend at `http://127.0.0.1:8000`. Next rewrites `/api/*` to the backend, so the browser only ever talks to port 3000.

**Activate `.venv` in the shell that runs `npm run dev:api`.** The script calls bare `python`, which outside the environment is the system interpreter and fails with `No module named uvicorn`. The backend loads `.env.local` and then `.env` itself.

**6. Set the first password.** Open `http://localhost:3000/studio/login`, choose **Forgot password**, then **Send code**. Enter the six-digit code from the email with a password of at least 12 characters, then sign in with it.

**The page says a code was sent whether or not one was.** The reply is identical by design, so that it reveals nothing about the account. If no email arrives, the reason is in the backend's log: `The reset code could not be mailed`. The usual cause is a missing `GMAIL_USER` or `GMAIL_APP_PASSWORD`, which carry the mail until SMTP is saved in the studio.

**7. Configure storage and the model.** Under **Settings**, save `GCS_BUCKET` and `GCS_SERVICE_ACCOUNT`, then `LLM_API_KEY`. `LLM_MODEL` and `LLM_BASE_URL` have defaults. Until the model key is saved Ashley answers `The assistant is not configured yet.`, and until storage is saved the file manager answers `Storage is not configured.`

**8. Run the one-time import.** Under **Settings**, in **Import from Sanity**, enter the project id and the dataset, load the plan, and run it. It copies every document and post, and every image into the bucket under `imported/`. A document that fails is listed with its reason, and running the import again changes nothing already imported.

**Step 7 has to come before step 8.** Without storage, every document that carries an image fails and every document that does not still imports, so the site looks half filled rather than broken.

### Start the Development Server

```bash
npm run dev:api
```

```bash
npm run dev
```

Local URL: `http://localhost:3000`

### Build

```bash
npm run build
```

> [!warning]
> Never run `npm run build` while `npm run dev` is running against the same checkout. Both write
> to `.next/`, and the production build rewrites it underneath the dev server, corrupting its
> cache. The symptom is a 500 on `_app.js` together with `ENOENT` rename errors in
> `.next/cache/webpack/`, which points at webpack rather than at the cause. Verify with
> `npx tsc --noEmit` and `npm run lint`, which touch nothing.

### Deployment

| Item | Description |
| :- | :- |
| Platform | Vercel: the Next application and one Python function |
| Trigger | Push to `main`. `dev` is not deployed |
| Migrations | Applied by `.github/workflows/migrate.yml` on the same push, before the deploy |
| Build-time config | None. No variable is compiled into the browser bundle |
| Health check | Vercel deployment status, and the backend's health endpoint |
| Rollback process | Promote a previous deployment in the Vercel dashboard |

The full procedure is in `DEPLOY.md`.

> [!warning]
> **The backend's first deployment is production.** With `dev` not deployed there is no preview, so the Python function is packaged and routed for the first time on `main`. The local servers prove the application, not the packaging.

### Branching

Two branches, and a change moves one way.

| Branch | Holds | Accepts a merge from |
| :- | :- | :- |
| `main` | What is deployed | `dev` only |
| `dev` | Where work lands first; the default branch | A working branch, merged locally |

A change moves one way: `local work > dev > main`, through a pull request with a recorded human
approval.

### Known Limitations

| Limitation | Impact | Planned resolution |
| :- | :- | :- |
| The site is empty until the database is filled | Every section renders with nothing in it | Run the one-time import, or enter the content in the studio |
| No image exists until one is uploaded | Logos, achievement photos and carousel images render as their placeholder | Upload under Files in the studio |
| Images are served at the size they were uploaded | A large upload weighs on every page that shows it | Put a resizing proxy in front of the bucket if image weight shows in load time |
| Only crawlers that identify themselves are refused | A scraper that sends a browser's `User-Agent` reads everything a visitor can | None. Nothing served to the public can be made uncopyable |
| The backend cannot be rehearsed before production | A packaging or routing fault first shows on the live site | Check the health endpoint after every deployment, and promote the previous one if it fails |
| One owner, one account | There are no roles, invitations, or second sign-in | None planned |
| A post has no revision history and no scheduled publishing | It is a draft or it is published, and a save overwrites | None planned |
| Losing `STUDIO_ENCRYPTION_KEY` loses every saved credential | The password and every credential must be entered again | Keep the key in a password manager |
| The storage service account key is stored, sealed, in the database | A leak of both the database and the encryption key exposes the bucket | Keyless access from Vercel to Google Cloud, if the owner chooses it |
| Superseded files are still in the repository | `src/app/api/chat/route.ts` still answers at its path, though nothing calls it | The owner removes them, with `nodemailer` |
| The home carousels are empty until something is published | Two cards on the home page show a placeholder line | Add `moment` and `quote` documents in the studio |
| The résumé download has no place of its own | It is a link among the profile's social links, so replacing the CV means uploading a file and editing that link | Open in `PRD.md` |
| TypeScript and ESLint are held a major behind | typescript-eslint supports TypeScript up to 6.0, and the React, import, and accessibility plugins in eslint-config-next do not yet run on ESLint 10 | Move to TypeScript 7 and ESLint 10 once those packages support them |
| The GitHub activity graph is decorative | The squares are randomised, not real contribution data | Use the GitHub contributions API |
| No frontend test suite | Frontend regressions are caught by review only | Add end-to-end coverage of the routes |
| Ashley needs a model key saved in the studio | Without it every question is answered with "The assistant is not configured yet." | Save `LLM_API_KEY` under Settings. No restart is needed |
| Ashley keeps no memory between sessions | The transcript is in `sessionStorage` and only the last twelve turns are sent back | A stored conversation, if it is ever worth the privacy question |
