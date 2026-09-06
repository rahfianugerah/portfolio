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


# PRD Phase 3: Media CMS and Schema Migration

**Owner:** Naufal Rahfi Anugerah
**Date:** 2026-08-26
**Status:** Approved - not yet built

## Problem

Two kinds of content are stuck in the repository today, and both cost a deploy to change.

Photographs live in `public/` and are referenced by raw GitHub URLs baked into
`src/data/resume.tsx`. Adding one means committing a binary, pushing, and waiting for a
build. The résumé PDF has the same problem: it is a link in the resume data, so replacing
it is a code change. Neither is code, and neither should require a developer to be
available.

The résumé is the sharper case. It is the single most-requested artefact on the site, it
changes several times a year, and a stale one is worse than none - a recruiter downloading
last year's CV gets a wrong answer with no indication it is wrong.

The database has the same shape of problem in reverse. The analytics schema exists as two
`.sql` files at the repository root that contradict each other: one disables row-level
security, the other enables it, and which is true depends on which was pasted into the
Supabase console last. There is no record of what has been applied.

## Users

- **Naufal Rahfi Anugerah**, the only person who will ever log in. There is no second
  editor, no invitation flow, and no role model.
- **Every visitor**, indirectly: they see the images and download the résumé, and they are
  the reason the private half of the storage must stay private.

## What Is Built

- A signed-in owner can upload, replace, and delete photographs and documents from a page
  on the site, without a commit, a build, or a deploy.
- The résumé can be replaced in place, so the download link never changes and never goes
  stale.
- Every uploaded image is compressed, resized, and stripped of its metadata before it is
  stored, so a photograph taken on a phone cannot publish its GPS coordinates.
- Files are stored in Google Cloud Storage; their metadata lives in Supabase Postgres, so
  the database holds facts about files and never file bytes.
- Public images are served from a CDN-backed public path; the résumé and any document are
  reachable only through a short-lived signed URL that the site mints on request.
- The schema is a set of ordered migration files in the repository, applied automatically
  on a merge to `main`, so what is deployed and what is in the database cannot drift.

## What Is Not Built

- **No second editor, no roles, no permissions model.** One identity, allowlisted by
  address. A role system for a single user is a system with nothing to say.
- **No public sign-up, no password reset, no invitation flow.** There is no account to
  create; the one account already exists.
- **No password at all.** Authentication is a magic link, so there is no credential to
  store, leak, phish, or rotate.
- **No replacement for Sanity.** Blog posts stay in Sanity. This CMS owns the media
  library and the résumé, and nothing else.
- **No rich text editing, no page builder, no draft or publish workflow.** Uploading a
  file is the entire interaction.
- **No image transformation on read.** Files are processed once on upload and served as
  stored. A resize-on-demand service is a cache to invalidate and a bill to watch.
- **No move of the résumé data itself.** `src/data/resume.tsx` still holds the work
  history; only the files it points at move. That migration is designed separately and
  remains deferred.
- **No file bytes in any database.** Cloud SQL was considered and rejected: binaries in
  Postgres inflate every backup, defeat CDN caching, and lose range requests.

## Success Measure

- A photograph can be replaced without a commit, and the site shows the new one without a
  deploy.
- Replacing the résumé does not change its URL, and the previous file stops being
  reachable.
- An uploaded photograph carries no EXIF data. Verified by reading the stored object back
  and finding no GPS or camera tags.
- A document URL obtained by a visitor stops working after its expiry, and no document is
  reachable by guessing a path.
- Every upload route rejects an unauthenticated request, a file whose magic bytes do not
  match its claimed type, and anything over the size limit.
- No access token is present in `localStorage` or `sessionStorage` at any point.
- A failed migration stops the deploy rather than shipping an app against a half-applied
  schema. There is no staging branch to rehearse against, so `main` is the first place a
  migration runs and what is pending is read before the merge, not after it.

## Constraints

- **One identity source and one identity key.** Supabase Auth, keyed on its stable user
  UUID rather than the email address, which can change. No bespoke user or password table,
  per `auth.rules.md`.
- **The browser holds an `HttpOnly` cookie and nothing else.** No token in `localStorage`
  or `sessionStorage`, which would expose it to any XSS on the page.
- **Every route but the login page requires authentication.** There are no open CMS routes.
- **Uploads are validated by magic bytes**, never by extension or `Content-Type`, both of
  which the uploader controls. Allowlist: `pdf`, `jpg`, `jpeg`, `png`, `webp`. Size limit
  10 MB, configurable.
- **Stored filenames are generated by the server** from a hash. The original name is kept
  as metadata only, because a user-supplied name is a path traversal waiting to happen.
- **Images are re-encoded on the server**, to WebP at quality 80–85, at most 2000 px on the
  longest side, with EXIF stripped. Re-encoding also normalizes the file and discards any
  unexpected payload. A 300 px thumbnail is generated for list views.
- **A compressed file is never larger than its original.** Where it would be, the original
  is kept.
- **Recorded for every file**: original filename, MIME type, original size, stored size,
  SHA-256, uploader identity, and an ISO 8601 timestamp. Deduplicated by hash.
- **The GCS service-account key is the most dangerous secret either project holds.** It
  never carries a `NEXT_PUBLIC_` prefix, is never read outside a server route, and is
  scoped to one bucket with object-level permissions only - no bucket administration, no
  IAM.
- **Migrations are forward-only and additive.** Add a column, backfill, and drop in a later
  migration, never in the same one. A migration that fails aborts the deploy.

### The one place two standards disagree

`media.rules.md` requires that uploaded files be *"served only through an authenticated
endpoint"* and that an upload folder is *"never exposed directly to the public"*. That rule
is written for documents in a business application, and a portfolio's photographs are
public by definition - serving them through an authenticated endpoint would mean no visitor
could see them.

The resolution splits storage by intent rather than weakening the rule:

| Path | Holds | Served | Why |
| :- | :- | :- | :- |
| `public/` | Portfolio photographs | Public, CDN-backed | Displaying them is the point |
| `private/` | The résumé and any document | Signed URL, minutes-long expiry | These are personal data and not for indexing |

Both halves keep every other control: uniform bucket-level access so no object carries its
own ACL, server-generated names so nothing is guessable, no directory listing on either
path, and no execution anywhere. The intent of the rule - no open upload folder, nothing
guessable, nothing executable - holds; only the read path differs, and it differs because
the two kinds of file genuinely differ.

## Data

**New, in Supabase Postgres:** one `media` table holding file metadata only - id, storage
path, visibility, original filename, MIME type, byte sizes, SHA-256, dimensions, alt text,
uploader id, and timestamps. No file bytes.

**New, in Google Cloud Storage:** the files themselves, under the two prefixes above.

**Personal data:** the résumé contains a name, contact details, and an employment history.
It is personal data, which is why it sits behind a signed URL rather than a public path.
Uploaded photographs may contain identifiable people, which is why EXIF is stripped -
location metadata on a photograph is personal data under both Indonesia's UU PDP and the
GDPR.

**Row-level security:** public read on `media` rows marked public; every write restricted to
the authenticated owner. The two contradictory SQL files at the repository root are replaced
by ordered migrations, so the applied state stops depending on which was pasted last.

## Open Questions

- **Which email address is the allowlisted owner?** Supplied through `CMS_OWNER_EMAIL`
  rather than committed, so this is a value to fill rather than a decision to make.
- **Should the résumé download be rate limited?** It is a public-facing signed-URL mint on
  an unauthenticated route, which makes it the one place a visitor can cause repeated work.
