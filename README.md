# Rahfi's Portfolio

![Next](https://img.shields.io/badge/Next-14.2.30-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?logo=tailwindcss&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-3.99.0-F03E2F?logo=sanity&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.86.2-3FCF8E?logo=supabase&logoColor=white)
![Node](https://img.shields.io/badge/Node-20-5FA04E?logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Managed-000000?logo=vercel&logoColor=white)
![Testing](https://img.shields.io/badge/Testing-None_Yet-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-2EA043)
![License](https://img.shields.io/badge/License-Private-750014)

Live at [rahfi.pro](https://rahfi.pro). Intent is in `PRD.md`; deployment is in `DEPLOY.md`.

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
| Interactive home | `/` | A full-width landing page: meteors behind the hero, a draggable globe marking Jakarta, rows that drift faster as the page scrolls, and figures that count up as they come into view |
| Résumé and work history | `/`, `/experience` | Every role, education entry, and leadership position, grouped by company and expandable |
| Project catalogue | `/project` | Full width, one preview image or video per project, with the source and the running site both linked |
| Certificates | `/project` | Professional certifications and course completions, five to a page. A certificate with an uploaded PDF opens on the page itself rather than sending the reader away |
| Blog | `/blog`, `/blog/[slug]` | Posts written in the studio, rendered through Portable Text with syntax-highlighted code blocks |
| Services | The signals section on `/` | A summary of what the work covers. The engagement itself is the consulting practice, and the card links there |
| Contact | `/contact` | A validated form that emails the owner, with a captcha and a rate limit in front of it |
| Ashley, the AI assistant | `/chat` | Answers questions about the work from the same documents the pages render. She runs on Ollama Cloud through a server route, with the API key held on the server, so the browser never sees the key or the model host |
| Light and dark themes | Everywhere | Follows the system by default, and remembers an explicit choice |

### The Signals Dashboard

The home page ends on a section of live cards, packed into columns so each keeps its own height. Each one is independent: it renders a skeleton while it loads and a fallback if its source is unreachable, so one failing card never takes the page with it.

| Card | Source |
| :- | :- |
| Website visitors | Supabase, first-party, counted on this site |
| GitHub activity and latest repositories | The GitHub API, cached for an hour |
| Experiences velocity | Derived from the résumé data |
| Tech stack and specialties | The résumé data |
| Moments and quotations | Sanity, uploaded in the studio |
| Latest writing | Sanity |
| Projects overview and social links | Mixed |
| Clock | The browser, in Asia/Jakarta |

### What the Owner Can Do

| Feature | Where | What it does |
| :- | :- | :- |
| Edit every image, post, project, and certificate | `/studio` | Sanity Studio, embedded at full viewport height, signed in through Sanity |
| Sign in to the private area | `/admin/login` | A magic link to one allowlisted address. There is no password to store or leak |
| Move the résumé content into Sanity | `/admin` | A one-time copy that is safe to run twice |

> [!note]
> Nothing on this site requires a visitor to sign in, and nothing collects a name or an address
> except the contact form, which sends it and stores nothing.


## 3. Technology Stack

| Category | Technology | Version |
| :- | :- | :- |
| Runtime | Node | 20 |
| Framework | Next | 14.2.30 |
| Language | TypeScript | 5.8.3 |
| Build tool | Next, webpack | 14.2.30 |
| Router | Next App Router | 14.2.30 |
| Data fetching | Server Components, server actions, `fetch` | 14.2.30 |
| Styling | Tailwind CSS, shadcn token layer | 3.4.17 |
| Icons | Lucide, React Icons | 0.395.0, 5.5.0 |
| Content | Sanity, Portable Text | 3.99.0 |
| Database | Supabase, PostgreSQL | 2.86.2 |
| AI | Ollama Cloud, over HTTP with an API key | No client library |
| Animation | Framer Motion | 11.18.2 |
| Testing | <code style="color: red">Not Used</code> | |
| Deployment | Vercel | Managed |

## 4. Frontend Architecture

### Architecture Type

Hybrid. Most routes are static React Server Components; the assistant and the widgets are client
components, and analytics, blog, and GitHub data come from API routes.

### Architecture Description

A single shell in `src/app/components/layout-content.tsx` supplies the top bar, a full-width
page, and the footer for every route. Every piece of content is read from Sanity through
`src/lib/content.ts`, with no fallback. Analytics are read from and written to Supabase, and the
assistant calls Ollama Cloud through a server route, so the model host is never named in the
browser.

### Main Layers

| Layer | Responsibility |
| :- | :- |
| `src/app/layout.tsx` | Fonts, metadata, providers |
| `src/app/components/layout-content.tsx` | Top bar, full-width page, footer |
| `src/app/*/page.tsx` | Route composition |
| `src/app/api/` | Analytics, blog, and GitHub endpoints |
| `src/app/actions.ts` | Server actions: assistant and contact |
| `src/components/` | Shared components and primitives |
| `src/lib/` | Fonts, Supabase, rate limiting, helpers |
| `src/data/` | Résumé content and navigation |

### Application Flow

```text
Route > Root Layout > Layout Content > Page > Component > Data Source
```

### User Interaction Flow

```text
User Action > Handler > Server Action or API Route > State Update > Render
```

### Rendering Strategy

Static generation for the content routes, server rendering for the CMS studio and the API routes,
client rendering for the widgets and the assistant.

## 5. Project Structure

```text
src/
├── app/
│   ├── layout.tsx            # Fonts, metadata, providers
│   ├── page.tsx              # Home: hero, about, experience, projects, signals
│   ├── globals.css           # Tokens
│   ├── project/              # Projects and certifications, full width
│   ├── blog/                 # Blog list and post
│   ├── contact/              # Contact form
│   ├── experience/           # Work history
│   ├── studio/               # Embedded Sanity Studio
│   ├── api/                  # analytics, blog, github/stats, content
│   ├── actions.ts            # Server actions
│   └── components/           # Page-level components and widgets
├── components/               # Shared components, magicui, ui primitives
├── data/                     # site.ts, blog.ts
├── lib/                      # content, group-roles, supabase, auth, rate-limit, helpers
└── sanity/                   # CMS client, write client, schemas
```

### Directory Explanation

| Directory | Purpose |
| :- | :- |
| `src/data/` | The origin and the navigation. Everything else moved to Sanity |
| `src/fonts/` | Font files. Deliberately not `public/`, see Configuration |
| `src/app/components/widgets/` | The signals grid cells, all on one shared frame |
| `src/lib/` | Everything with no JSX in it |

## 6. Configuration

### Configuration Files

| File | Purpose |
| :- | :- |
| `.env.example` | Environment variable reference |
| `next.config.mjs` | Remote image hosts and redirects for moved routes |
| `vercel.json` | Region, branch deployment, and security headers |
| `tailwind.config.ts` | Fonts, palette bindings, and the collapsed radius scale |
| `sanity.config.ts` | CMS studio configuration |
| `supabase-schema.sql` | Analytics tables |
| `supabase-rls-policies.sql` | Row-level security policies |

### Environment Variables

| Variable | Required | Description | Example |
| :- | :- | :- | :- |
| `OLLAMA_API_KEY` | Yes | Ollama Cloud key, server only | `your_ollama_api_key_here` |
| `OLLAMA_BASE_URL` | No | Ollama-compatible host, Ollama Cloud by default | `https://ollama.com` |
| `OLLAMA_MODEL` | No | A model listed at `ollama.com/api/tags` | `gpt-oss:120b` |
| `GITHUB_TOKEN` | Yes | Read-only token for the stats endpoint | `your_token_here` |
| `GMAIL_USER` | Yes | Contact form sender | `you@example.com` |
| `GMAIL_APP_PASSWORD` | Yes | Contact form app password | `your_app_password_here` |
| `RECAPTCHA_SECRET_KEY` | Yes | Captcha verification | `your_secret_here` |
| `RECAPTCHA_SITE_KEY` | Yes | Captcha site key | `your_site_key_here` |
| `SANITY_PROJECT_ID` | Yes | CMS project | `your_project_id` |
| `SANITY_DATASET` | Yes | CMS dataset | `production` |
| `SANITY_API_VERSION` | Yes | CMS API date | `2025-12-01` |
| `SUPABASE_URL` | Yes | Analytics project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | Analytics anon key | `your_anon_key` |

> [!danger]
> No variable here carries the `NEXT_PUBLIC_` prefix, and none may be given it: a prefixed value
> is compiled into the bundle the browser downloads. Every variable is read on the server. The two
> values the browser genuinely needs, the captcha site key and the Sanity project for the studio,
> are handed to their page as props, and both are identifiers rather than secrets.

> [!note]
> `SUPABASE_ANON_KEY` is read only by the analytics route. It would be safe in the browser anyway,
> because row-level security is what protects the data behind it; the policies are in
> `supabase/migrations/`.

### Environments

| Environment | Purpose | Branch |
| :- | :- | :- |
| Development | Local development | `dev` |
| Preview | Shared verification, at `preview-rahfi-portfolio.vercel.app` | `dev` |
| Production | Live at `rahfi.pro` | `main` |

## 7. Routing, Pages, and Components

### Routing Method

Next App Router, file-based.

### Main Routes

| Route | Page or layout | Access |
| :- | :- | :- |
| `/` | Home | Public |
| `/project` | Projects and certifications, full width | Public |
| `/service` | Permanent home is the consulting site; redirects to `consulting.rahfi.pro/#services` | Public |
| `/chat` | Ashley, the AI assistant | Public |
| `/api/chat` | Ashley's answer, streamed from Ollama | Public |
| `/blog` | Blog list | Public |
| `/blog/[slug]` | Blog post | Public |
| `/contact` | Contact form | Public |
| `/experience` | Work history | Public |
| `/studio` | Sanity Studio | Authenticated by Sanity |
| `/api/content` | Everything a client component renders | Public |

Home carries anchored sections: `#hero`, `#experience`, `#education`, `#projects`, `#signals`,
`#achievements`, `#contact`.

### Main Layouts

| Layout | Purpose | Used by |
| :- | :- | :- |
| `layout-content.tsx` | Top bar, full-width page, footer | Every route |

### Main Components

| Component | Category | Responsibility |
| :- | :- | :- |
| `TopNavbar` | Layout | Fixed top bar: the wordmark, the routes with the current one marked, the online indicator, and the blur band the page scrolls under |
| `Navbar` | Layout | The bottom dock, shown only below `md` where the top bar hides its links: the same routes as icons, plus socials and the theme toggle |
| `ResumeCard` | Feature | One company, expandable |
| `ProjectShowcase` | Feature | One project: preview, tags, source and site links |
| `CertificateList` | Feature | Certificates, five to a page, with the PDF readable in place |
| `ProjectVelocity` | Feature | Project previews, or titles until there are previews, in two rows that drift faster as the page scrolls |
| `GitHubCard` | Feature | The GitHub profile, an activity strip, and the latest repositories |
| `Globe` | Magic UI | A draggable WebGL globe with one marker, on Jakarta, drawn in black and white in both themes |
| `Meteors` | Magic UI | Meteors falling behind the hero and the page headings |
| `ScrollVelocityRow` | Magic UI | A row of anything that drifts sideways and speeds up with the scroll |
| `NumberTicker` | Magic UI | A figure that counts up when it scrolls into view |
| `AssistantChat` | Feature | Ashley, on `/chat` |

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

### State Flow

```text
User Action > Handler > Server Action or API Route > State Update > Render
```

### Content Source

| Content | Lives in | Edited through |
| :- | :- | :- |
| Projects | Sanity, `project` documents | `/studio` |
| Certificates | Sanity, `certificate` documents | `/studio` |
| Blog posts | Sanity, `post` documents | `/studio` |
| Home carousel photographs | Sanity, `moment` documents | `/studio` |
| Home carousel quotations | Sanity, `quote` documents | `/studio` |
| Consulting engagements | Sanity, `clientProject` documents | `/studio` |
| Consulting track record figures | Sanity, `counter` documents | `/studio` |
| Companies and schools | Sanity, `organization` documents | `/studio` |
| Work and leadership | Sanity, `role` documents, each pointing at an organization | `/studio` |
| Education | Sanity, `education` documents, pointing at the same organizations | `/studio` |
| Achievements | Sanity, `achievement` documents | `/studio` |
| The name, role, summary and social links | Sanity, the single `profile` document | `/studio` |
| Skills | Sanity, `skillGroup` documents | `/studio` |
| Services | Sanity, `service` documents, shown only in the signals section | `/studio` |

`src/lib/content.ts` is the only place that reads any of it, and **nothing has a fallback**. That
is deliberate: a fallback was worth having while the dataset was empty, and keeping one now would
mean a second copy of every project, role and photograph living in the repository, which is the
thing this change removed. An unreachable Sanity renders an empty section and logs why.

What is left in `src/data/` is `site.ts`, which holds the origin and the navigation. Neither is
content: the origin is needed synchronously by `metadataBase`, and the navigation is a map of this
application's own routes.

> [!note]
> A company or a school is one `organization` document, and roles and education both point at
> it. The name, the website and the logo are written once: an employer with three roles under it
> carries one logo rather than three copies that drift apart, and a place that is both an employer
> and a school, which several of these are, is one document serving both.

> [!note]
> The link icons that used to make this content unserialisable are gone. A link carries a `type`
> string now, and `ProjectShowcase` decides which component that means. That single change is what
> let the content move out of the repository at all.

> [!note]
> One studio and one dataset serve both sites. `consulting.rahfi.pro` holds no Sanity client:
> it reads `clientProject` over the public GROQ endpoint with a plain `fetch`, and redirects its
> own `/studio` here. Two studios against one dataset is two things to keep in step for no gain.

> [!important]
> The one-time copy runs from a button on `/admin`, not from a script, because `resume.tsx` is TSX
> holding React elements and plain Node cannot import it. It writes with `createIfNotExists`, so
> pressing it twice adds nothing and never overwrites a studio edit. It needs
> `SANITY_API_WRITE_TOKEN`; the read path never sees a token.

### Data Fetching Method

Server Components for résumé and CMS content; `fetch` against internal API routes for the widgets;
server actions for the assistant and the contact form.

### Data Request Flow

```text
Component > API Route or Server Action > External Service > Response > State Update
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

Session-scoped on purpose: a conversation about someone's CV is not left behind on a shared
machine. **No token is stored in browser storage.**

## 9. Authentication, Styling, and Accessibility

### Authentication Method

None, anywhere. The embedded Sanity Studio at `/studio` authenticates through Sanity itself, and
that is the only sign-in the project has. There is no owner session, no cookie, and no middleware:
they existed for a media library that no longer does.

### Styling Method

Tailwind CSS 3 over a shadcn HSL token layer in `src/app/globals.css`.

### Design System

Shared with `consulting.rahfi.pro`, and defined here: a shadcn HSL token layer with a light and a
dark theme, rounded cards on a soft shadow, and no colour at all: black, white, and the greys
between. Section titles follow one pattern, `Rahfi's | Title.`, in the same colour as the text
around them.

> [!note]
> The language is defined here and shared with `consulting.rahfi.pro`, so a visitor moving between
> the two sites sees one identity at two levels of formality.

### Theme Structure

| Item | Source |
| :- | :- |
| Colors | `src/app/globals.css`, `:root` and `.dark` |
| Typography | `src/app/layout.tsx` and `tailwind.config.ts` |
| Spacing | Tailwind defaults |
| Breakpoints | Tailwind defaults |

### Typography

| Face | Role | Licence |
| :- | :- | :- |
| Google Sans | Headings in bold, body, UI, labels | Google Fonts |
| Inter | Fallback behind Google Sans | SIL OFL 1.1, Google Fonts |
| Source Code Pro | Code blocks only | SIL OFL 1.1, Google Fonts |

> [!warning]
> Google Sans is not in Next 14's font catalogue, so unlike the consulting site this one cannot
> load it through `next/font` and takes a stylesheet link in `src/app/layout.tsx` instead, with a
> preconnect pair in front of it. Inter is loaded through `next/font` and named behind Google Sans
> in the family stack, so a slow font response does not shift the page. The lint rule that fires
> on that link is a Pages Router rule and is disabled at the line.

> [!note]
> No font file lives in this repository. Every face is served by Google Fonts, which is what keeps
> the licence obligations of a bundled font from applying here at all.

### Responsive Design

Tailwind's default breakpoints. The signals grid is a bento at `lg`, two uniform columns at `sm`,
and a single column below.

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

<code style="color: red">Not Used</code>. There is no test suite.

### Running Tests

Not applicable. Verification is `npx tsc --noEmit`, `npm run lint`, and checking the routes.

### Error Categories

| Category | Description |
| :- | :- |
| Validation | Contact form input, checked by Zod on both sides |
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
- Image optimization through `next/image`
- Font optimization through `next/font`, self-hosted
- Caching: GitHub stats revalidate hourly
- Rate limiting on the contact form

### Performance Monitoring

| Metric or area | Tool or method |
| :- | :- |
| Visitor analytics | Supabase, first-party |
| Deployment analytics | Vercel |

## 11. Development and Deployment

### Requirements

- Node 20 or newer
- npm
- A current browser

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`.
2. Add the required values by hand.
3. Do not commit the local environment file.

```bash
cp .env.example .env
```

### Import the Content

The site renders from Sanity and ships with no content of its own, so a fresh dataset shows empty
sections. `sanity/exports/resume.ndjson` holds all 95 documents: the profile, the skill groups,
the roles, the education, the projects, the achievements and the certificates.

**Name the package explicitly, and do not install it.** Bare `npx sanity` resolves to the `sanity`
studio package, which is 3.99 and whose `yargs` dependency throws `require is not defined in ES
module scope` on Node 26. `@sanity/cli` is the separate standalone CLI, currently 8.9.1, and it
runs. Written this way it is fetched into the npm cache rather than into `node_modules`, so it
never becomes a dependency of the site.

```bash
npx --yes @sanity/cli@latest logout
npx --yes @sanity/cli@latest login
npx --yes @sanity/cli@latest dataset import sanity/exports/resume.ndjson -d production --replace
```

Run them from the repository root: the path to the export is relative, and the CLI reads
`sanity.cli.ts` from the working directory to find out which project to import into. Without that
file it has no project and asks for one, which is why it exists; `sanity.config.ts` configures the
studio and is not read for this.

`logout` first only if a different account is already signed in. The session is stored per user,
not per project, so signing in once covers every repository on the machine.

`--replace` overwrites a document whose id already exists and leaves everything else alone, so
running it twice is safe and re-running it after an edit in the studio is not.

Images are not in that file and cannot be: they were committed to this repository and are deleted.
Upload them in the studio against the documents the import creates.

> [!warning]
> **No document id may contain a dot.** Sanity reads the segment before a dot as a path namespace,
> the same mechanism behind `drafts.`, and an anonymous reader has no grant for a custom one. An id
> like `role-work.acme` imports without complaint and is visible in the studio, while every public
> query omits it with `"reason": "permission"`, so the site renders empty with no error anywhere.
> The ids in the export use hyphens throughout.

### Start the Development Server

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
| Platform | Vercel |
| Trigger | Push to `main` for production; `dev` builds a preview at `preview-rahfi-portfolio.vercel.app` |
| Build-time config | None. No variable is compiled into the browser bundle |
| Health check | Vercel deployment status |
| Rollback process | Promote a previous deployment in the Vercel dashboard |

The full procedure is in `DEPLOY.md`.

> [!note]
> Vercel builds the site, serves it from the edge, and gives the `dev` branch a preview, so there
> is no container and no server to maintain.

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
| The site is empty until the dataset is imported | Every section renders with nothing in it | Import `sanity/exports/resume.ndjson`, then upload the images |
| No image exists until one is uploaded | Logos, achievement photos and carousel images render as their placeholder | Upload in the studio |
| The bundled Sanity CLI does not run on Node 26 | Bare `npx sanity` throws a yargs ESM error before doing anything | Name the package: `npx --yes @sanity/cli@latest` |
| Unused packages removed from `package.json` but still installed | `node_modules` is larger than it needs to be, and still holds `@google-cloud/storage`, `sharp` and `file-type` | Run `npm install` |
| The home carousels are empty until something is published | Two cards on the home page show a placeholder line | Upload `moment` and `quote` documents in the studio |
| The résumé download is the Google Drive link in `src/data/resume.tsx` | Replacing the CV is a commit, and the previous file stays reachable | Give the résumé a Sanity document with a file field |
| Two majors behind on Next | Missing framework fixes | Upgrade 14 to 16; two call sites break on Next 15's async request APIs |
| The GitHub activity graph is decorative | The squares are randomised, not real contribution data | Use the GitHub contributions API |
| No test suite | Regressions are caught by review only | Add end-to-end coverage of the routes |
| Ashley needs `OLLAMA_API_KEY` in every environment | Without it every answer is "(Ashley lost her connection. Please try again.)", and the real reason, the missing key, is only in the server log | Set the key in `.env` locally and in each Vercel environment, then restart the dev server, which reads the environment once at startup |
| Ashley keeps no memory between sessions | The transcript is in `sessionStorage` and only the last twelve turns are sent back | A stored conversation, if it is ever worth the privacy question |
