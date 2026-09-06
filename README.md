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
2. Technology Stack
3. Frontend Architecture
4. Project Structure
5. Configuration
6. Routing, Pages, and Components
7. State and Data Management
8. Authentication, Styling, and Accessibility
9. Testing, Errors, and Performance
10. Development and Deployment
11. Deviations From the Standards

## 1. Project Overview

A personal site that carries a résumé, a project catalogue, writing, and a conversational
assistant that answers questions about the work. It is read by recruiters, prospective clients,
and other engineers, all of whom arrive cold and scan once.

It shares a design language with the consulting practice at `consulting.rahfi.pro`, deliberately.
The two are the same person at two levels of formality.

## 2. Technology Stack

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
| AI | Google Gemini | 0.24.1 |
| Animation | Framer Motion | 11.18.2 |
| Testing | <code style="color: red">Not Used</code> | |
| Deployment | Vercel | Managed |

## 3. Frontend Architecture

### Architecture Type

Hybrid. Most routes are static React Server Components; the assistant and the widgets are client
components, and analytics, blog, and GitHub data come from API routes.

### Architecture Description

A single shell in `src/app/components/layout-content.tsx` supplies navigation and the footer for
every route. Projects and certificates are read from Sanity through `src/lib/content.ts`, which
falls back to `src/data/resume.tsx` when Sanity is empty or unreachable; the rest of the résumé is
still compiled in from that file. Blog content is fetched
from Sanity; analytics are read from and written to Supabase; the assistant calls Gemini through a
server action so the key never reaches the browser.

### Main Layers

| Layer | Responsibility |
| :- | :- |
| `src/app/layout.tsx` | Fonts, metadata, providers |
| `src/app/components/layout-content.tsx` | Navigation, container, footer |
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

## 4. Project Structure

```text
src/
├── app/
│   ├── layout.tsx            # Fonts, metadata, providers
│   ├── page.tsx              # Home: hero, about, experience, projects, signals
│   ├── globals.css           # Tokens
│   ├── project/              # Projects and certifications, full width
│   ├── service/              # Services
│   ├── blog/                 # Blog list and post
│   ├── contact/              # Contact form
│   ├── experience/           # Work history
│   ├── admin/                # Media library and the content migration
│   ├── studio/               # Embedded Sanity Studio
│   ├── api/                  # analytics, blog, github/stats, media, admin, content
│   ├── actions.ts            # Server actions
│   └── components/           # Page-level components and widgets
├── components/               # Shared components, magicui, ui primitives
├── data/                     # resume.tsx, blog.ts
├── lib/                      # content, supabase, auth, gcs, media, helpers
└── sanity/                   # CMS client, write client, schemas
```

### Directory Explanation

| Directory | Purpose |
| :- | :- |
| `src/data/` | The résumé, and the fallback behind the Sanity content. Edited more often than any component |
| `src/fonts/` | Font files. Deliberately not `public/`, see Configuration |
| `src/app/components/widgets/` | The signals grid cells, all on one shared frame |
| `src/lib/` | Everything with no JSX in it |

## 5. Configuration

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
| `GEMINI_API_KEY` | Yes | Assistant model key | `your_api_key_here` |
| `GITHUB_TOKEN` | Yes | Read-only token for the stats endpoint | `your_token_here` |
| `GMAIL_USER` | Yes | Contact form sender | `you@example.com` |
| `GMAIL_APP_PASSWORD` | Yes | Contact form app password | `your_app_password_here` |
| `RECAPTCHA_SECRET_KEY` | Yes | Captcha verification | `your_secret_here` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Yes | Captcha site key | `your_site_key_here` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | CMS project | `your_project_id` |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | CMS dataset | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | CMS API date | `2025-12-01` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Analytics project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Analytics anon key | `your_anon_key` |

> [!danger]
> Every `NEXT_PUBLIC_` variable ends up inside the bundle the browser downloads. It is public the
> moment it ships. The ones without that prefix are real secrets, an AI key, a GitHub token, a
> mail password, a captcha secret, a Sanity write token, and must never be given it, per
> `secret.rules.md`.

> [!note]
> `NEXT_PUBLIC_SUPABASE_ANON_KEY` is public by design. Row-level security is what protects the
> data behind it; the policies are in `supabase-rls-policies.sql`.

### Environments

| Environment | Purpose | Branch |
| :- | :- | :- |
| Development | Local development | `dev` |
| Preview | Shared verification, at `preview-rahfi-portfolio.vercel.app` | `dev` |
| Production | Live at `rahfi.pro` | `main` |

## 6. Routing, Pages, and Components

### Routing Method

Next App Router, file-based.

### Main Routes

| Route | Page or layout | Access |
| :- | :- | :- |
| `/` | Home | Public |
| `/project` | Projects and certifications, full width | Public |
| `/service` | Services | Public |
| `/blog` | Blog list | Public |
| `/blog/[slug]` | Blog post | Public |
| `/contact` | Contact form | Public |
| `/experience` | Work history | Public |
| `/studio` | Sanity Studio | Authenticated by Sanity |
| `/admin` | Media library, content migration | Owner only |
| `/api/content` | Carousel photographs and quotations | Public |
| `/api/admin/seed-content` | One-time resume to Sanity copy | Owner only |

Home carries anchored sections: `#about`, `#experiences`, `#projects`, `#achievements`, `#stats`.

### Main Layouts

| Layout | Purpose | Used by |
| :- | :- | :- |
| `layout-content.tsx` | Navigation, container, footer | Every route |

### Main Components

| Component | Category | Responsibility |
| :- | :- | :- |
| `TopNavbar` | Layout | Fixed top bar: the wordmark, the online indicator, and the blur band the page scrolls under |
| `Navbar` | Layout | The bottom dock: links, socials, theme toggle |
| `ResumeCard` | Feature | One company, expandable |
| `ProjectShowcase` | Feature | One project: preview, tags, source and site links |
| `CertificateList` | Feature | Certificates, five to a page, with the PDF readable in place |
| `Widget` | Shared | The frame every signals cell sits in |
| `Chatbot` | Feature | The assistant |

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

## 7. State and Data Management

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
| Work, education, leadership, achievements | `src/data/resume.tsx` | A commit |
| Photographs and the résumé PDF | Google Cloud Storage, metadata in Supabase | `/admin` |

`src/lib/content.ts` is the only place that reads projects and certificates. It queries Sanity and
returns the résumé data instead when the project id is unset, when the query throws, or when it
comes back empty, so an unconfigured or unreachable CMS shows the old content rather than an empty
page a visitor cannot explain.

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

## 8. Authentication, Styling, and Accessibility

### Authentication Method

None for visitors. The embedded Sanity Studio at `/studio` authenticates through Sanity itself.

### Styling Method

Tailwind CSS 3 over a shadcn HSL token layer in `src/app/globals.css`.

### Design System

Shared with `consulting.rahfi.pro`, and defined here: a shadcn HSL token layer with a light and a
dark theme, rounded cards on a soft shadow, and `#FF0000` used only as punctuation inside a
heading. Section titles follow one pattern, `Rahfi's | Title.`, with the apostrophe, the pipe and
the full stop in the accent.

> [!note]
> This is a recorded deviation from `uix.component.md`, which specifies black on white with Inter.
> The deviation is deliberate; see `PRD.md`.

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
| Bebas Neue | Headings, via `font-bebas` | SIL OFL 1.1, Google Fonts |
| Google Sans | Body, UI, labels | Google Fonts |
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

## 9. Testing, Errors, and Performance

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

## 10. Development and Deployment

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
| Build-time config | Every `NEXT_PUBLIC_` value |
| Health check | Vercel deployment status |
| Rollback process | Promote a previous deployment in the Vercel dashboard |

The full procedure is in `DEPLOY.md`.

> [!note]
> This project deploys to Vercel rather than Cloud Run, which is a documented deviation from
> `deploy.rules.md`.

### Branching

This project uses the trunk shape from `branch.rules.md`, which is a recorded deviation. See
Deviations From the Standards.

| Branch | Holds | Accepts a merge from |
| :- | :- | :- |
| `main` | What is deployed | `dev` only |
| `dev` | Where work lands first; the default branch | A working branch, merged locally |

A change moves one way: `local work > dev > main`, through a pull request with a recorded human
approval.

### Known Limitations

| Limitation | Impact | Planned resolution |
| :- | :- | :- |
| Work, education, leadership and achievements are still in `src/data/resume.tsx` | Editing them is a commit and a deploy | The same treatment as projects: a schema, a query in `src/lib/content.ts`, and a line in the migration route |
| `src/data/resume.tsx` still holds React elements in the `icon` fields the migrated types no longer read | Nothing breaks, but the file reads as if those icons matter | Drop them when the last consumer moves to Sanity |
| Fifteen unused packages removed from `package.json` but still installed | `node_modules` is larger than it needs to be | Run `npm install` |
| Two majors behind on Next | Missing framework fixes | Upgrade 14 to 16; two call sites break on Next 15's async request APIs |
| The GitHub activity graph is decorative | The squares are randomised, not real contribution data | Use the GitHub contributions API |
| No test suite | Regressions are caught by review only | Add end-to-end coverage of the routes |

## 11. Deviations From the Standards

1. **Two branches, not three.** `branch.rules.md` says a project that deploys uses the promotion shape, `dev` > `staging` > `main`. This uses trunk, `dev` > `main`, at the owner's direction. One person reviews every change, so a staging branch was a merge nobody read on the way to a deployment nobody else was waiting for. The cost is real and named where it bites: `main` is the first place a database migration ever runs, so what is pending is read before the merge rather than discovered after it. The preview at `preview-rahfi-portfolio.vercel.app` is where a change is looked at, and it is a deployment rather than a branch.
2. **Vercel, not Cloud Run.** `deploy.rules.md` requires every deployed project to ship to Cloud Run. This is a Next.js site with no server of its own to run, and Vercel builds it, serves it from the edge, and gives every branch a preview for nothing. The exception does not generalise to a project with a backend.
3. **The design language is not the house standard.** `uix.component.md` specifies black on white with Inter. This site uses the token layer, the red punctuation accent, and Bebas Neue described under Design System, shared with `consulting.rahfi.pro`, at the owner's direction. The cost is that neither site can adopt a house component without restyling it.
4. **Public files are served publicly.** `media.rules.md` requires an uploaded file to be served only through an authenticated endpoint. A portfolio's photographs are public by definition, so serving them behind authentication would mean no visitor could see them. Storage is split instead: `public/` is CDN-backed, `private/` is reachable only through a short-lived signed URL, and every other control in the rule holds on both. The reasoning is in `PRD.md`.
