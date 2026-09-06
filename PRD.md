# PRD: Portfolio Visual Unification with Rahfi Consulting

**Owner:** Naufal Rahfi Anugerah
**Date:** 2026-08-26
**Status:** Approved - built on `dev`, not yet promoted to `main`

## Problem

One person operates two public sites - `rahfi.pro` (the portfolio) and `consulting.rahfi.pro` (the consulting practice) - and they look like they belong to two different people.

The portfolio is a light-or-dark themed surface of rounded, shadowed cards, headed in Bebas Neue, punctuated with a red accent, across three typefaces. The consulting site is flat pure black, has no rounded corner anywhere, draws every division with a single hairline border, uses white as its only accent, and runs on two typefaces. They share no color, no shape, no type, and no spacing rhythm.

The cost is credibility at the exact moment it matters most. A prospective client who arrives at the consulting site and follows a link to the portfolio to check who is behind it lands somewhere that reads as an unrelated property; the same happens in reverse when a recruiter or collaborator moves from the portfolio outward. The consulting site sells "transparency and precision" as the product, and a visual break between the two undercuts that claim before a word of copy is read. Every future change also costs twice: a decision made once has to be re-made in a second, incompatible vocabulary.

## Users

- **Prospective consulting clients** arriving from `consulting.rahfi.pro` to verify the person behind the practice. The highest-value visitor and the one the mismatch costs the most.
- **Recruiters and hiring managers** landing on the portfolio directly from a CV, LinkedIn, or a job platform, then following outward.
- **Collaborators and fellow engineers** reading the blog, the projects, and the GitHub activity.
- **Naufal Rahfi Anugerah**, the owner, who maintains both sites daily and currently pays the two-vocabulary tax on every change.

## What Is Built

Once this exists:

- A visitor moving between the two sites sees one continuous visual identity: the same black ground, the same hairline-border construction, the same square geometry, the same uppercase wide-tracked section labels, and the same body typeface.
- The portfolio reads as the richer, more formal of the two. It carries an engraved display face that the consulting site does not, used in one consistent role, so the two sites read as one identity at two levels of formality rather than as two designs.
- Every portfolio page - home, experience, projects, services, contact, blog, and blog post - reads in that one language, with no page left in the old vocabulary.
- The portfolio keeps everything it does today. Every rail, widget, animation, and interactive surface survives the change; only its appearance moves.
- The owner has a single set of design decisions to apply when either site changes next, instead of two.

## What Is Not Built

Explicitly out of scope, and why:

- **Light mode.** Retired, at the owner's direction. A black aesthetic that also has to work on white is two designs, not one, and the consulting site has no light mode to unify with. The theme toggle leaves the navigation.
- **Any accent color.** The palette is black and white only, at the owner's direction. The former red accent is retired entirely rather than being demoted to a status color.
- **A third voice for the display faces.** One engraved face carries headings, one body face carries everything else, and each has exactly one job. A face used for two jobs, or a third added for a one-off, is the failure mode this bounds against. A script face was tried for a brand accent and removed: on a black, square, engraved page it read as belonging to a different site.
- **Any content or copy change.** No heading is reworded, no project added, no description rewritten. This change is appearance only, so that anything that looks different is a design decision and not a content edit hiding inside one.
- **Any change to the resume data.** The structured data behind the site is untouched.
- **Any layout or information-architecture change.** The multi-rail responsive layout, the page set, the navigation targets, and the widget ordering all stay exactly as they are. The bottom floating navigation stays, restyled, at the owner's direction. Restructuring at the same time as re-skinning would make a regression impossible to attribute.
- **Any framework or dependency upgrade.** The site stays on its current Next.js, React, and Tailwind majors. Chasing the consulting site's newer versions is a separate piece of work with its own risk.
- **Merging consulting content into the portfolio.** No pricing tiers, no engagement process, no consulting service copy moves across. The two sites stay separate products that look related.
- **A shared component library or monorepo.** Two sites that agree on how they look do not yet justify the cost of a package that both consume. Revisit if a third surface appears.
- **Re-skinning the embedded CMS studio.** It ships its own interface and is an authoring tool, not a visitor-facing page.
- **Fixing the font exposure on the consulting site.** That site serves its display font from a publicly browsable path. It is a real issue and it is recorded here, but it is a change to a different repository and is not made as part of this work.
- **New pages, new features, or new integrations.** Nothing is added.

## Success Measure

Checkable after the change:

- Loading any portfolio page in a fresh browser produces a pure black background, with no light theme reachable by any control, setting, or system preference.
- A search of the source for the retired red accent value returns nothing, and no color outside black, white, and the grays between them is rendered anywhere a visitor can see.
- No rounded corner is visible on any card, badge, button, input, or panel outside the deliberate exceptions recorded in the plan.
- One display face, one body face and one monospace face are served, each in one role, and no other family is requested by any page.
- No licensed font file is reachable at a browsable URL on the deployed site.
- A person shown both sites side by side, without being told they are related, identifies them as belonging to the same owner, and identifies the portfolio as the more formal of the two.
- The production build completes with no new errors or warnings, and every page renders correctly at mobile, tablet, and the widest desktop breakpoint.
- Every interactive element remains reachable and visibly focused by keyboard, text meets its contrast floor against black, and reduced-motion preferences are still honored.

## Constraints

- **Nothing may stop working.** The chatbot, contact form and its spam protection, visitor analytics, GitHub activity, blog and CMS, and every rail widget must behave exactly as they do today.
- **The multi-breakpoint rail layout must survive intact**, including its sticky offsets and scroll containers at the widest breakpoint.
- **Code blocks keep a monospace face.** The consulting site has no code on it and therefore no monospace need; the portfolio does, so a monospace family is retained for that use only. This is a recorded, deliberate deviation.
- **Display font licensing binds the implementation.**
  - The engraved heading face is under the SIL Open Font License 1.1, which permits modification and redistribution but requires the copyright notice and the licence to travel with every copy. A licence file therefore ships beside the font. Because the upstream package omits the copyright line from its licence file, the notice is taken from the font's own embedded metadata rather than written by hand.
  - It is not subset, because subsetting would make it a Modified Version that may no longer use its reserved name.
  - No font sits in the publicly served directory. The licence in force no longer requires this, but one rule for every font is less to get wrong than a rule per licence.
- **A font's weights are mapped from its embedded metadata, never from its filename.** The engraved face keeps its original naming, in which the upright regular weight is the one called "Heavy". Reading the filename would map it to the wrong weight and leave the browser synthesising a face that already exists.
- **Every additional font must have its licence confirmed before it ships**, with the terms recorded, in the same way this one was.
- **The embedded CMS studio renders its own interface** and cannot be brought into the design language.
- **Accessibility is not a place to economize.** Contrast, focus visibility, touch target size, and reduced-motion handling are requirements, not preferences.
- The house design standard in the standards vault is deliberately not applied to this change, at the owner's direction. The consulting site's language is the reference instead. This is a known divergence from `uix.component.md`, recorded here so it is a decision rather than a drift.

## Data

No change. Nothing about what the site reads or writes moves:

- Visitor analytics, blog content, GitHub activity, contact delivery, and the AI assistant all keep their current sources, destinations, and behavior.
- No new data is collected, and no new personal data is introduced, stored, or transmitted.
- The only assets added to the repository are font files, held outside the publicly served directory.

## Open Questions

- **When is this promoted past `dev`?** The work is built and verified on `dev`. Promotion to `main` is the owner's decision, through a pull request with a recorded approval. Nothing has been pushed.
- **When is the font exposure on the consulting site fixed?** That site serves its display font from a publicly browsable path, which its licence does not permit. Recorded here because it was found during this work; it is a one-file move in a different repository and needs its own change.

The question this document opened with - the licence and provenance of the engraved display face - is answered, and the terms it turned out to carry are recorded under Constraints.


# PRD Phase 2: Full-Width Layout and Top Navigation

**Owner:** Naufal Rahfi Anugerah
**Date:** 2026-08-26
**Status:** Draft - not started

## Problem

Phase 1 changed how the portfolio looks but deliberately left how it is arranged alone. That arrangement is now the thing holding it back.

The site is built as a narrow centre column flanked by up to four sticky rails. The main content is fixed at 440px on the widest screens, so on a 1920px monitor the writing a visitor actually came to read occupies under a quarter of the width while eight widget cards compete for the rest. Everything is a peer: analytics sit at the same visual weight as the work history.

Navigation compounds it. The primary navigation is a floating dock at the bottom of the screen, which is unusual enough that visitors look for a top bar first and do not find one. The consulting site has a conventional fixed top bar, so the two sites still navigate differently even though they now look alike.

The content is also split across more destinations than it needs. Experience lives on its own page holding a list the home page already shows a truncated copy of, so the same history is maintained in two places and a visitor has to leave home to see all of it.

## Users

The same four as Phase 1. This phase matters most to the **prospective client and the recruiter**, who arrive cold, scan once, and leave: they are the ones paying the cost of a 440px column and a navigation bar that is not where they looked.

## What Is Built

- The site fills the screen. Content spans a full-width container with the same bordered construction as the consulting site, instead of a fixed narrow column with rails beside it.
- A conventional fixed top navigation bar carries the whole site: **Home, Projects, Services, Writing, Contact**, plus a distinct entry into the assistant.
- The home page opens with the name and description on the left and an image beside it, and carries the résumé, GitHub, and LinkedIn links directly beneath that description, so the three things a recruiter wants are above the fold.
- Home reads as one scrollable narrative with anchored sections - about, experiences, projects - reachable both from the hero and by deep link.
- The **complete** experience list is on the home page. It is no longer truncated, and it is no longer duplicated on a separate page.
- Every analytics and information card that exists today survives, gathered into one full-width dashboard section on the home page rather than scattered down four rails.
- The assistant becomes its own full-height page laid out like a conversational app, reached from the top bar and from the hero, instead of a small floating panel.

## What Is Not Built

- **No content or copy rewriting.** Sections move and are re-arranged; their words are not rewritten. Same discipline as Phase 1.
- **No change to the résumé data.** The structured data is untouched, and the new navigation is defined in its own module rather than driven from it.
- **No new pages beyond the assistant.** Projects, Services, Writing, and Contact keep their existing pages; only Experience is absorbed into home.
- **No redesign of the visual language.** Phase 1's palette, typography, geometry, and borders carry over unchanged. This phase moves boxes, it does not restyle them.
- **No dark and light theming, no accent colour.** Still black and white.
- **No framework or dependency upgrade**, and no change to any API route, server action, or data source.
- **No responsive rewrite beyond what full width requires.** The layout must work at mobile, tablet, and desktop, but no new breakpoint system is introduced.
- **No mega-menu, no mobile drawer animation library, no scroll-spy library.** Anchor navigation is anchors.

## Success Measure

- On a 1920px display, the main content occupies the full container width rather than a 440px column, and no sticky rail remains.
- Every page's primary navigation is the same fixed top bar, and the floating dock is gone from the codebase.
- The home page lists every work entry the résumé data holds, and no separate experience page remains.
- Every card that exists before this phase still renders after it. None is dropped.
- The hero shows the name, the description, and the résumé, GitHub, and LinkedIn links without scrolling, at desktop and at mobile.
- Clicking a hero anchor scrolls to the matching section, and loading that anchor as a URL directly lands on it.
- The assistant page fills the viewport height, keeps its scroll position at the latest message, and behaves the same as the panel it replaces.
- The production build completes with no new errors, every route still serves, and keyboard focus remains visible throughout.

## Open Questions

- **Does the writing section keep its `/blog` URL, or move to `/writing` to match its label?** Moving is tidier but changes published URLs, so it needs redirects. Owner to decide; the recommendation is to move and redirect, so no existing link breaks.


# PRD Phase 3: One CMS, and a Schema With a History

**Owner:** Naufal Rahfi Anugerah
**Date:** 2026-09-06
**Status:** Approved and built. Supersedes the Google Cloud Storage media CMS described in the version of this phase dated 2026-08-26.

## Problem

Two kinds of content cost a deploy to change, and the database had no record of its own shape.

Photographs lived in `public/` and were referenced by raw GitHub URLs baked into `src/data/resume.tsx`. Adding one meant committing a binary and waiting for a build. The same was true of every project image and every certificate.

The database had the same problem in reverse. The analytics schema was two `.sql` files at the repository root that contradicted each other, one disabling row-level security and the other enabling it, and which was true depended on which had been pasted into the Supabase console last.

The first version of this phase answered the content half by building a second CMS: an owner-only upload page writing to a Google Cloud Storage bucket, with the file metadata in a Supabase table. That worked, and it was a mistake. The project already had a CMS. Running two meant two authentication paths, two places to look for a file, a service-account key that was the most dangerous secret in the repository, and an upload pipeline of magic-byte checks, re-encoding, and EXIF stripping that Sanity performs on its own.

## Users

- **Naufal Rahfi Anugerah**, the only person who will ever sign in. There is no second editor, no invitation flow, and no role model.
- **Every visitor**, indirectly: they see the images and read the posts.

## What Is Built

- Every image, document, and post is a Sanity document, edited at `/studio`, with no commit, build, or deploy involved.
- One CMS, one sign-in, one place a file can be.
- The schema is a set of ordered migration files applied automatically on a merge to `main`, so what is deployed and what is in the database cannot drift.
- No image is committed to this repository, and the carousels have no fallback content: an empty studio shows an empty frame rather than a picture nobody chose to publish.

## What Is Not Built

- **No second CMS.** The Google Cloud Storage bucket, its upload routes, its media table, and its service-account key are removed. `0004_drop_media.sql` drops the table rather than editing the migration that created it, because migrations are forward-only.
- **No second editor, no roles, no permissions model.** One identity, allowlisted by address.
- **No password.** Authentication into `/admin` is a magic link, so there is no credential to store, leak, phish, or rotate.
- **No upload endpoint of our own.** The studio is one. Writing a second would mean re-implementing validation Sanity already does.
- **No move of the resume data itself.** `src/data/resume.tsx` still holds the work history, education, leadership, and achievements. Projects and certificates left it; the rest follow the same pattern when they go.

## Success Measure

- A photograph can be replaced without a commit, and the site shows the new one without a deploy.
- No image file, and no font file, exists anywhere in this repository.
- The only route that can write to a content store is the one-time migration button, and it rejects an unauthenticated request.
- No access token is present in `localStorage` or `sessionStorage` at any point.
- A migration that fails stops the deploy rather than shipping an app against a half-applied schema.

## Constraints

- **One identity source and one identity key.** Supabase Auth, keyed on its stable user UUID rather than the email address, which can change. No bespoke user or password table, per `auth.rules.md`.
- **The browser holds an `HttpOnly` cookie and nothing else.** No token in `localStorage` or `sessionStorage`, which would expose it to any XSS on the page.
- **Every `/admin` route requires authentication.** There are no open CMS routes.
- **The Sanity read client never carries a token.** It is imported by modules that reach the browser bundle. The write token lives in a separate client used by one server route.
- **Migrations are forward-only and additive.** Add a column, backfill, and drop in a later migration, never in the same one. A migration that fails aborts the deploy.
- **`main` is the first place a migration runs.** There is no staging branch to rehearse against, which is the cost accepted in the branching deviation recorded in `README.md`. What is pending is read before the merge.

### Where this departs from the media standard

`media.rules.md` requires an uploaded file to be served only through an authenticated endpoint. A portfolio's photographs are public by definition, so serving them behind authentication would mean no visitor could see them.

They are Sanity assets on Sanity's CDN: server-generated names that cannot be guessed, no directory listing, and nothing executable. The intent of the rule holds; only the read path differs, and it differs because the files genuinely are public.

## Data

**In Supabase Postgres:** visitor analytics only. `counters`, `daily_stats`, and `sessions`. The `media` table is dropped.

**In Sanity:** every image, document, and post, with the bytes and the metadata together.

**Personal data:** the resume contains a name, contact details, and an employment history. It is currently a link to Google Drive held in the resume data, which is a known limitation: replacing it is a commit, and the previous file stays reachable.

## Open Questions

- **When does the rest of the resume data move?** Work, education, leadership, and achievements have no schema yet. The pattern is settled by projects and certificates; only the work is outstanding.
- **Should the resume download become a Sanity document?** It would make replacing the CV an upload rather than a commit, which is the same argument that moved everything else.
