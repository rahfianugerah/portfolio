<h1>
   Rahfi's Portfolio Website (<a href="https://rahfi.pro">rahfi.pro</a>)
</h1>

<img width="1584" height="396" alt="portfolio-banner" src="https://github.com/user-attachments/assets/c42336bf-9b3e-4b9d-89f2-49a35079ea14" />

<br/>

<div align=center>

![Maintenance](https://img.shields.io/badge/Maintenance-Yes-green)
![Build](https://img.shields.io/badge/Build-Passing-green)
[![Website](https://img.shields.io/badge/Portfolio_Website-Click_here-brightgreen)](https://rahfi.pro)
![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-%23007ACC?logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-%23323330?logo=javascript&logoColor=%23F7DF1E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.18.2-pink?logo=framer&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled_Components-6.1.19-DB7093?logo=styled-components&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Latest-000000?logo=shadcnui&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-8B5CF6?logo=radix-ui&logoColor=white)
![Lucide React](https://img.shields.io/badge/Lucide_React-0.395.0-gray?logo=lucide&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity_CMS-3.99.0-F03E2F?logo=sanity&logoColor=white)
![Portable Text](https://img.shields.io/badge/Portable_Text-5.0.0-orange)
![Supabase](https://img.shields.io/badge/Supabase-2.86.2-3ECF8E?logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini_AI-0.24.1-4285F4?logo=google&logoColor=white)
![reCAPTCHA v3](https://img.shields.io/badge/reCAPTCHA_v3-1.11.0-4285F4?logo=google&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.71.1-EC5990?logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3.25.76-3E67B1?logo=zod&logoColor=white)
![MDX](https://img.shields.io/badge/MDX-Latest-1B1F24?logo=mdx&logoColor=white)
![Remark](https://img.shields.io/badge/Remark_GFM-4.0.1-gray)
![Shiki](https://img.shields.io/badge/Shiki-1.29.2-pink)

</div>

### Project Overview

<p align="justify">
   This project is a modern, high-performance personal portfolio website designed to showcase professional experience, research projects, and creative works through an elegant, responsive interface.
   Built with Next.js 14, Tailwind CSS, Shadcn UI, and powered by Sanity CMS and Supabase, the project emphasizes performance, accessibility, and modular scalability. Serving as both a digital resume and an interactive project hub.
</p>

### Features

| Feature | Description |
|---|---|
| **AI Chatbot** | Floating chatbot powered by Google Gemini AI that answers questions about skills, projects, and experience. Chat history is persisted per browser session. |
| **Blog** | Full blog system with Sanity CMS as the headless CMS. Posts are rendered with Portable Text and support syntax-highlighted code blocks via Shiki. |
| **Analytics Dashboard** | Real-time visitor tracking widget backed by Supabase (PostgreSQL). Tracks unique sessions, daily/weekly deltas, and displays a sparkline chart. |
| **GitHub Stats** | Live GitHub stats widget (public repos, latest repositories) fetched from the GitHub API with hourly caching. |
| **Contact Form** | Validated contact form using React Hook Form + Zod with Google reCAPTCHA v3 spam protection and Nodemailer email delivery. |
| **Experience Graph** | Visual timeline graph of professional work experience with interactive hover states. |
| **Project Showcase** | Project cards with tech-stack badges pulled from structured resume data. |
| **Dark / Light Mode** | System-aware theme toggle built with `next-themes`. |
| **Sanity Studio** | Embedded Sanity Studio at `/studio` for content management. |
| **Smooth Animations** | Blur-fade entrance animations and shiny text effects from the custom MagicUI component library (Framer Motion). |
| **Rate Limiting** | API routes are protected with server-side rate limiting. |
| **Responsive Layout** | Multi-column rail layout (far-left, left, main, right, far-right) that collapses gracefully on mobile. |

### Tech Stack

#### Framework & Runtime
- **[Next.js 14](https://nextjs.org)** (App Router): Server components, API routes, ISR
- **React 18**: Concurrent rendering, server/client component split
- **TypeScript 5**: End-to-end type safety

#### UI & Styling
- **Tailwind CSS 3**: Utility-first CSS
- **Shadcn UI**: Accessible Component primitives built on Radix UI
- **Framer Motion / Motion**: Page and element animations
- **MagicUI**: Custom animated components (BlurFade, AnimatedShinyText, Dock, IconCloud)
- **Lucide React & React Icons**: Icon set

#### Content Management
- **Sanity CMS v3**: Headless CMS for blog posts with Portable Text rendering
- **MDX**: Markdown + JSX for rich content
- **Shiki / rehype-pretty-code**: Server-side syntax highlighting

#### Backend & Database
- **Supabase (PostgreSQL)**: Visitor analytics, session tracking
- **Nodemailer**: Contact form email delivery

#### AI & External APIs
- **Google Gemini AI**: Conversational AI chatbot
- **GitHub REST API**: Live repository and profile stats
- **Google reCAPTCHA v3**: Form spam protection

#### Forms & Validation
- **React Hook Form** + **Zod**: Schema-validated forms with client/server validation

### Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`:  Supabase project URL 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public key 
- `NEXT_PUBLIC_SANITY_PROJECT_ID`:  Sanity project ID 
- `NEXT_PUBLIC_SANITY_DATASET`:  Sanity dataset (e.g. `production`) 
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`:  Google reCAPTCHA v3 site key 
- `RECAPTCHA_SECRET_KEY`:  Google reCAPTCHA v3 secret key 
- `GEMINI_API_KEY`:  Google Gemini AI API key 
- `GITHUB_TOKEN`:  GitHub personal access token (for stats API) 
- `EMAIL_USER`:  SMTP email address for contact form 
- `EMAIL_PASS`:  SMTP password / app password 

</div>

### Project Structure

```
src/
├── app/
│   ├── page.tsx               # Home / hero page
│   ├── blog/                  # Blog listing & individual post pages
│   ├── experience/            # Experience page
│   ├── project/               # Projects page
│   ├── contact/               # Contact page
│   ├── studio/                # Embedded Sanity Studio
│   ├── components/            # Page-level components (chatbot, widgets, forms)
│   │   └── widgets/           # Analytics, GitHub stats, latest blogs widgets
│   ├── api/                   # Next.js API routes
│   │   ├── analytics/         # Visitor tracking endpoint
│   │   ├── blog/              # Blog data endpoint
│   │   └── github/stats/      # GitHub stats endpoint
│   └── actions.ts             # Server Actions (AI chat, contact form)
├── components/                # Shared/global UI components
│   ├── magicui/               # Animated UI primitives (BlurFade, Dock, etc.)
│   └── ui/                    # Shadcn UI components
├── data/
│   └── resume.tsx             # Structured resume data (work, projects, skills)
├── lib/
│   ├── analytics-supabase.ts  # Supabase analytics helpers
│   ├── rate-limit.ts          # API rate limiting
│   ├── supabase.ts            # Supabase client
│   └── utils.ts               # Utility functions
└── sanity/                    # Sanity CMS configuration & schema
```

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Project Author

GitHub: [@rahfianugerah](https://www.github.com/rahfianugerah)
