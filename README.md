# Rahfi's Portfolio

![Next](https://img.shields.io/badge/Next-16.3.5-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.3.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)
![HeroUI](https://img.shields.io/badge/HeroUI-3.2.5-000000)
![Supabase](https://img.shields.io/badge/Supabase-2.116.0-3FCF8E?logo=supabase&logoColor=white)
![Node](https://img.shields.io/badge/Node-20-5FA04E?logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Managed-000000?logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-2EA043)
![License](https://img.shields.io/badge/License-Private-750014)

Live at [rahfi.pro](https://rahfi.pro). **This branch is the frontend only.** The backend lives on the `backend-main` and `backend-dev` branches of the same repository, and `API.md` is there with it. Intent is in `PRD.md`; deployment of the site is in `DEPLOY.md`.

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
| Backend | FastAPI, a separate deployment on the `backend-main` branch | Not in this branch |
| Content | Supabase PostgreSQL rows, Markdown through `react-markdown` | 10.1.0 |
| Database | Supabase, PostgreSQL | 2.116.0 |
| File storage | Google Cloud Storage, read by public URL. The backend does the writing | Managed |
| AI | Any OpenAI-compatible endpoint, called by the backend | No client library |
| Animation | Framer Motion | 13.3.0 |
| UI components | HeroUI | 3.2.5 |
| Copied components | Magic UI, Aceternity UI, shadcn/ui | Source in the repository |
| Testing | None in this branch. The backend's suite is on its own branches | |
| Deployment | Vercel | Managed |

## 4. Frontend Architecture

### Architecture Type

Hybrid. Most routes are static React Server Components; the assistant, the widgets, and the studio are client components. A FastAPI backend, deployed separately, does every write and every call that needs a secret.

### Architecture Description

A single shell in `src/app/components/layout-content.tsx` supplies the top bar, a full-width page, and the footer for every public route. The studio under `/studio` has its own shell.

**Reading and writing take two different paths.** Pages read published content straight from Supabase, with the anon key, through `src/lib/content.ts` and `src/data/blog.ts`, because they are rendered at build time, when the backend cannot be asked. Row-level security limits that key to every document and to published posts. Everything else goes to the backend: the studio's saves, Ashley, the consulting site's assistant, and the contact form.

**The browser only ever talks to this origin.** `next.config.mjs` rewrites `/api/:path*` to `${BACKEND_URL}/api/:path*`, so this server passes a request for `/api` on to the backend. That keeps the studio's session cookie first-party and needs no CORS. Four Next route handlers under `src/app/api` are files, so they are matched before the rewrite and keep answering: analytics, GitHub statistics, the content payload for client components, and the blog list. All four only read.

**The rewrite needs `BACKEND_URL` when the site is built.** Unset in development, it falls back to `http://127.0.0.1:8000`. Unset in a production build, the build logs `BACKEND_URL is not set: /api is not forwarded, so the studio, chat and contact form will not work.` and adds no rewrite, so the backend's paths are not forwarded until the variable is set and the site is built again. That is deliberate: a build says so instead of shipping a rewrite to nothing.

`src/proxy.ts` sits in front of every request and does three things. It turns away crawlers that identify themselves, on every path including `/api`. It sends a visitor with no session cookie from `/studio` to the sign-in page. On a request for `/api/*` it sets two headers before the request is forwarded: `x-client-ip`, the first entry of `x-forwarded-for`, and `x-service-key`, the value of `STUDIO_SERVICE_KEY`. Both are set unconditionally, so a value the browser sent is overwritten.

### The Backend Lives on Other Branches

The backend is one FastAPI application. For this site it signs the owner in, does every studio save, signs the file uploads, answers as Ashley, sends the contact form's mail, and holds the credentials saved in the studio. **None of its code is in this branch.**

| Item | Where |
| :- | :- |
| Its code, tests, `requirements.txt`, and `supabase/migrations/` | The `backend-dev` and `backend-main` branches of this repository |
| Its documentation | Its own `README.md` and `API.md`, on those branches |
| A local checkout | A second working tree beside this one, `../portfolio-backend`, on `backend-dev` |
| Its deployment | A Vercel project of its own on this repository, with `backend-main` as the production branch, intended for `api.rahfi.pro` |

**The backend branches share no history with `main` and `dev`, and are never merged with them.** A merge in either direction would put every file of one side into the other.

**The backend believes `x-client-ip` only when `x-service-key` matches its own `STUDIO_SERVICE_KEY`.** Seen from the backend, every forwarded request arrives from this site's server, so without the stated address every visitor would share one rate limit. A missing or mismatched key raises no error: the backend falls back to the address that connected, and the allowances for chat, the contact form, and sign-in are spent by all visitors together.

### Main Layers

| Layer | Responsibility |
| :- | :- |
| `next.config.mjs` | The rewrite of `/api/*` to the backend |
| `src/proxy.ts` | The crawler gate, the studio redirect, and the two headers a forwarded `/api` request carries |
| `src/app/layout.tsx` | Fonts, metadata, providers |
| `src/app/components/layout-content.tsx` | Top bar, full-width page, footer |
| `src/app/(site)/` | The public pages |
| `src/app/studio/` | The owner's panel |
| `src/app/api/` | The four read-only route handlers |
| `src/components/` | Shared components and primitives, and `studio/` for the panel's own |
| `src/lib/` | Content readers, the crawler list, Supabase, helpers |
| `src/data/` | The origin and navigation, and the post reader |

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
src/
├── proxy.ts                  # Crawler gate, studio redirect, headers for the backend
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
next.config.mjs               # The rewrite of /api to the backend
vercel.json                   # Region, branch deployment, the build skip, headers
```

### Directory Explanation

| Directory | Purpose | In git |
| :- | :- | :- |
| `src/components/studio/` | The studio's forms, file browser, editor, and `content-schema.ts`, which describes every content type once | Committed |
| `src/data/` | The origin and the navigation. Everything else is a row in the database | Committed |
| `src/app/components/widgets/` | The signals grid cells, all on one shared frame | Committed |
| `src/lib/` | Everything with no JSX in it | Committed |
| `.env`, `.env.local` | Local values for the site. The backend's are in its own checkout | Gitignored |
| `backend/`, `api/`, `supabase/` | The backend, its function entry, and the schema | Not in this branch. Committed on the backend branches |

> [!note]
> Five things are superseded by the backend and await removal by the owner: `src/app/api/chat/route.ts`, `src/lib/ollama.ts`, `src/lib/chat-rate-limit.ts`, `src/lib/rate-limit.ts`, and the `submitContactForm` action in `src/app/actions.ts`, with the `nodemailer` dependency it uses. Nothing calls them.

## 6. Configuration

### Configuration Files

| File | Purpose |
| :- | :- |
| `.env.example` | Environment variable reference |
| `next.config.mjs` | The rewrite of `/api/*` to the backend, unoptimized images, and the `/service` redirect |
| `vercel.json` | Region, branch deployment, the `ignoreCommand` that makes the backend's Vercel project skip this branch, and response headers |
| `eslint.config.mjs` | ESLint flat config, extending Next's core web vitals rules |

### Environment Variables

| Variable | Required | Description | Example |
| :- | :- | :- | :- |
| `BACKEND_URL` | In production | Where `/api` is forwarded. Read when the site is built. Unset in development, it is `http://127.0.0.1:8000` | `https://api.rahfi.pro` |
| `STUDIO_SERVICE_KEY` | Yes | Sent to the backend with every forwarded request. The same string as the backend's and the consulting site's | `your_long_random_service_key_here` |
| `SUPABASE_URL` | Yes | The Supabase project | `https://your_project_ref.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | Reads published content and counts visitors | `your_supabase_anon_key_here` |
| `GITHUB_TOKEN` | Yes | Read-only token for the GitHub statistics | `your_github_token_here` |
| `RECAPTCHA_SITE_KEY` | Yes | Captcha site key. The matching secret is the backend's | `your_recaptcha_site_key_here` |

The service role key, the sealing key, `ALLOWED_ORIGINS`, the mail fallback, and the captcha secret belong to the backend's environment. They are listed in the `.env.example` on its branches, and none of them is set for this site.

### Credentials Saved in the Studio

These are not environment variables. They are entered under `/studio/settings`, sealed by the backend before they reach the database, and used on the next request with no redeploy.

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

> [!note]
> `SUPABASE_ANON_KEY` is read by the analytics route and by the content readers. It would be safe in the browser anyway, because row-level security is what protects the data behind it; the policies are on the backend branches, in `supabase/migrations/`.

### Environments

| Environment | Purpose | Branch |
| :- | :- | :- |
| Development | Local development, on two local servers from two checkouts | `dev` here, `backend-dev` for the backend |
| Production | Live at `rahfi.pro` | `main` |

There is no preview environment. `vercel.json` disables deployment for `dev`, and the backend's does the same for `backend-dev`.

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

Endpoints are in `API.md`, on the backend branches.

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

Everything lives in Supabase PostgreSQL, in two tables that `supabase/migrations/0003_studio.sql`, on the backend branches, creates. `documents` holds one row per content document, with its fields as JSON. `posts` holds one row per post, with its body as Markdown.

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
> One studio and one database serve both sites. `consulting.rahfi.pro` reads the same `documents` rows with the anon key, redirects its own `/studio` here, and reaches the model through the same backend with a shared service key, so a model change in the studio reaches both assistants.

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

A visitor never signs in. The studio has one account, the owner's, and there is no sign-up route. The backend does the authenticating; this site draws the forms and carries the cookie.

| Part | How it works |
| :- | :- |
| The account | One row in `studio_owner`, created by hand with an email address and nothing else |
| The password | Of the owner's choosing, at least 12 characters. A forgotten password, and the first one, is set with a six-digit code emailed to the address in that row and to no other |
| The session | An opaque random token in an `HttpOnly`, `SameSite=Lax` cookie, for 12 hours. It is first-party because the browser only ever calls this origin, which forwards the request |
| The check | `src/proxy.ts` redirects a visitor without the cookie from `/studio` to `/studio/login`. That is a convenience. The backend verifies the session on every request, and a write must also come from an allowed `Origin` |

How the password is stored, how a code expires, the lockout, and what is sealed at rest are the backend's, and are documented on its branches. The studio shows only whether a secret is set, never its value.

### AI Crawlers Are Refused, Search Engines Are Not

`src/lib/crawlers.ts` holds one list that both `src/app/robots.ts` and `src/proxy.ts` read. A crawler that collects pages for a model, a scraping library, a headless browser, or a request with no `User-Agent` receives 403 on every path, `/api` included, and the AI crawlers are disallowed by name in `robots.txt`. Every response carries `X-Robots-Tag: noai, noimageai`. Search engines and link previews are deliberately left alone, because the site is meant to be found and shared. `robots.txt` also disallows `/studio` and `/api/` for everyone.

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

This branch has no test suite. It is verified with `npx tsc --noEmit`, `npm run lint`, and by checking the routes. The backend's pytest suite lives on the backend branches and runs from that checkout.

### Running Tests

Neither command writes to `.next/`, so both are safe beside a running dev server.

```bash
npx tsc --noEmit
npm run lint
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
- Rate limiting on sign-in, reset codes, the contact form, and both assistants, counted in PostgreSQL by the backend

### Performance Monitoring

| Metric or area | Tool or method |
| :- | :- |
| Visitor analytics | Supabase, first-party |
| Deployment analytics | Vercel |

## 11. Development and Deployment

### Requirements

- Node 20 or newer, and npm
- A second checkout of this repository on `backend-dev`, running the backend. Its Python version and packages are in its own README
- A Supabase project, with the backend's migrations applied
- A Google Cloud Storage bucket, for files. The backend's deployment guide says what it needs
- A current browser

### Setup

Eight steps. Step 1 is already done on the owner's machine. Steps 2 to 5 get the site and the studio running; steps 6 to 8 are done once, in the studio.

**1. Two checkouts.** This directory holds the site. The backend is a second working tree of the same repository, beside it.

```bash
git worktree add ../portfolio-backend backend-dev
```

**Never check a backend branch out in this directory.** The two sides share no history, so each stays in its own directory and neither is merged into the other.

**2. Install.** The Node packages, here. The backend's Python environment is set up in its own checkout, per its README.

```bash
npm install
```

**3. Configuration.** Two environment files, one per checkout. Copy each template and fill it in by hand. Neither local file is committed.

```bash
cp .env.example .env
cp ../portfolio-backend/.env.example ../portfolio-backend/.env
```

| File | Read by | Holds |
| :- | :- | :- |
| `.env` in this checkout | `npm run dev` | The six variables in "Environment Variables" above |
| `.env` in `../portfolio-backend` | The backend | The service role key, the sealing key, `STUDIO_SERVICE_KEY`, `ALLOWED_ORIGINS`, the mail fallback, and the captcha secret |

`BACKEND_URL` can be left out of the local file. Unset in development, the rewrite points at `http://127.0.0.1:8000`, which is where the backend's uvicorn runs.

**`STUDIO_SERVICE_KEY` must be the same string in both files.** The site sends it with every forwarded request, and the backend believes the visitor's address only when it matches. A mismatch prints nothing: every visitor is counted as one, and the rate limits run out for all of them at once.

**`ALLOWED_ORIGINS`, in the backend's file, must include `http://localhost:3000` for local work.** The backend refuses a studio write from any origin not on that list, so without it sign-in works and every save fails with `That request did not come from the studio.` That is deliberate: the `Origin` check is what stands in for a CSRF token.

**4. The database.** The migrations and the owner's row belong to the backend. Apply the migrations from its checkout and create the one row in `studio_owner`, per its README. There is no sign-up, and the address in that row is the only one a reset code is ever sent to.

**5. Start both servers**, each in its own shell. The backend first, from its checkout, in PowerShell:

```powershell
cd ..\portfolio-backend
.venv\Scripts\python -m uvicorn api.index:app --reload --port 8000
```

Then the site, from this one:

```bash
npm run dev
```

The site is at `http://localhost:3000` and the backend at `http://127.0.0.1:8000`. Next forwards `/api/*` to the backend, so the browser only ever talks to port 3000.

**The site starts without the backend, and that hides the fault.** Pages read Supabase directly and the four route handlers answer on their own, so the home page renders either way. The studio, the assistant, and the contact form are what fail. The backend reads the `.env` of the directory it is started in, which is why it is started from its own checkout.

**6. Set the first password.** Open `http://localhost:3000/studio/login`, choose **Forgot password**, then **Send code**. Enter the six-digit code from the email with a password of at least 12 characters, then sign in with it.

**The page says a code was sent whether or not one was.** The reply is identical by design, so that it reveals nothing about the account. If no email arrives, the reason is in the backend's log: `The reset code could not be mailed`. The usual cause is a missing `GMAIL_USER` or `GMAIL_APP_PASSWORD` in the backend's `.env`, which carry the mail until SMTP is saved in the studio.

**7. Configure storage and the model.** Under **Settings**, save `GCS_BUCKET` and `GCS_SERVICE_ACCOUNT`, then `LLM_API_KEY`. `LLM_MODEL` and `LLM_BASE_URL` have defaults. Until the model key is saved Ashley answers `The assistant is not configured yet.`, and until storage is saved the file manager answers `Storage is not configured.`

**8. Run the one-time import.** Under **Settings**, in **Import from Sanity**, enter the project id and the dataset, load the plan, and run it. It copies every document and post, and every image into the bucket under `imported/`. A document that fails is listed with its reason, and running the import again changes nothing already imported.

**Step 7 has to come before step 8.** Without storage, every document that carries an image fails and every document that does not still imports, so the site looks half filled rather than broken.

### Start the Development Server

The backend, from `../portfolio-backend`:

```powershell
.venv\Scripts\python -m uvicorn api.index:app --reload --port 8000
```

The site, from this checkout:

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
| Platform | Vercel. This site is one project; the backend is a second project on the same repository |
| Trigger | Push to `main`. `dev` is not deployed, and a push to a backend branch is skipped by this project |
| Migrations | Not this project's. They are applied from the backend branches |
| Build-time config | `BACKEND_URL`, read when `next.config.mjs` builds the rewrite. No variable is compiled into the browser bundle |
| Health check | Vercel deployment status, and `/api/health` on this origin, which answers only when the rewrite and the backend both work |
| Rollback process | Promote a previous deployment in the Vercel dashboard |

The full procedure is in `DEPLOY.md`.

> [!warning]
> **The two deployments first meet in production.** Neither `dev` nor `backend-dev` is deployed, so there is no preview in which this site forwards to a deployed backend. The local servers prove the application, not the rewrite between two Vercel projects.

### Branching

Two branches hold the site, and a change moves one way.

| Branch | Holds | Accepts a merge from |
| :- | :- | :- |
| `main` | What is deployed | `dev` only |
| `dev` | Where work lands first; the default branch | A working branch, merged locally |

A change moves one way: `local work > dev > main`, through a pull request with a recorded human
approval.

The backend has the same pair, `backend-dev` and `backend-main`, in the same repository. They share no history with these two and are never merged with them.

### Known Limitations

| Limitation | Impact | Planned resolution |
| :- | :- | :- |
| The site is empty until the database is filled | Every section renders with nothing in it | Run the one-time import, or enter the content in the studio |
| No image exists until one is uploaded | Logos, achievement photos and carousel images render as their placeholder | Upload under Files in the studio |
| Images are served at the size they were uploaded | A large upload weighs on every page that shows it | Put a resizing proxy in front of the bucket if image weight shows in load time |
| Only crawlers that identify themselves are refused | A scraper that sends a browser's `User-Agent` reads everything a visitor can | None. Nothing served to the public can be made uncopyable |
| Neither `dev` nor `backend-dev` is deployed | The rewrite between the two deployments first runs on the live site | Check `/api/health` on this origin after either project deploys, and promote the previous deployment if it fails |
| `/api` depends on a variable read at build time | A production build without `BACKEND_URL` ships with no rewrite, and changing the variable does nothing until the site is built again | Set it before the first build, and redeploy after changing it |
| A route handler under `src/app/api` wins over the rewrite | A backend path that a file here also takes is never reached, and nothing reports it | Check `API.md` on the backend branches before adding a handler |
| The backend's rate limits depend on two headers this site sets | Without a matching `STUDIO_SERVICE_KEY` every visitor shares one allowance | Keep the key identical in both projects |
| One owner, one account | There are no roles, invitations, or second sign-in | None planned |
| A post has no revision history and no scheduled publishing | It is a draft or it is published, and a save overwrites | None planned |
| Saved credentials are sealed under a key only the backend holds | Losing that key means the password and every credential must be entered again | Keep the key in a password manager. The detail is on the backend branches |
| Superseded files are still in the repository | `src/app/api/chat/route.ts` still answers at its path, though nothing calls it | The owner removes them, with `nodemailer` |
| The home carousels are empty until something is published | Two cards on the home page show a placeholder line | Add `moment` and `quote` documents in the studio |
| The résumé download has no place of its own | It is a link among the profile's social links, so replacing the CV means uploading a file and editing that link | Open in `PRD.md` |
| TypeScript and ESLint are held a major behind | typescript-eslint supports TypeScript up to 6.0, and the React, import, and accessibility plugins in eslint-config-next do not yet run on ESLint 10 | Move to TypeScript 7 and ESLint 10 once those packages support them |
| The GitHub activity graph is decorative | The squares are randomised, not real contribution data | Use the GitHub contributions API |
| No test suite in this branch | Frontend regressions are caught by review only | Add end-to-end coverage of the routes |
| Ashley needs a model key saved in the studio | Without it every question is answered with "The assistant is not configured yet." | Save `LLM_API_KEY` under Settings. No restart is needed |
| Ashley keeps no memory between sessions | The transcript is in `sessionStorage` and only the last twelve turns are sent back | A stored conversation, if it is ever worth the privacy question |
