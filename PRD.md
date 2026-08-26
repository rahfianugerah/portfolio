# PRD: Portfolio Visual Unification with Rahfi Consulting

**Owner:** Naufal Rahfi Anugerah
**Date:** 2026-08-26
**Status:** Draft

## Problem

One person operates two public sites — `rahfi.pro` (the portfolio) and `consulting.rahfi.pro` (the consulting practice) — and they look like they belong to two different people.

The portfolio is a light-or-dark themed surface of rounded, shadowed cards, headed in Bebas Neue, punctuated with a red accent, across three typefaces. The consulting site is flat pure black, has no rounded corner anywhere, draws every division with a single hairline border, uses white as its only accent, and runs on two typefaces. They share no color, no shape, no type, and no spacing rhythm.

The cost is credibility at the exact moment it matters most. A prospective client who arrives at the consulting site and follows a link to the portfolio to check who is behind it lands somewhere that reads as an unrelated property; the same happens in reverse when a recruiter or collaborator moves from the portfolio outward. The consulting site sells "transparency and precision" as the product, and a visual break between the two undercuts that claim before a word of copy is read. Every future change also costs twice: a decision made once has to be re-made in a second, incompatible vocabulary.

## Users

- **Prospective consulting clients** arriving from `consulting.rahfi.pro` to verify the person behind the practice. The highest-value visitor and the one the mismatch costs the most.
- **Recruiters and hiring managers** landing on the portfolio directly from a CV, LinkedIn, or a job platform, then following outward.
- **Collaborators and fellow engineers** reading the blog, the projects, and the GitHub activity.
- **Naufal Rahfi Anugerah**, the owner, who maintains both sites daily and currently pays the two-vocabulary tax on every change.

## What Is Built

Once this exists:

- A visitor moving between the two sites sees one continuous visual identity: the same black ground, the same hairline-border construction, the same square geometry, the same uppercase wide-tracked section labels, and a shared typographic voice.
- The portfolio reads as the richer, more formal of the two. It carries an engraved display face that the consulting site does not, used in one consistent role, so the two sites read as one identity at two levels of formality rather than as two designs.
- Every portfolio page — home, experience, projects, services, contact, blog, and blog post — reads in that one language, with no page left in the old vocabulary.
- The portfolio keeps everything it does today. Every rail, widget, animation, and interactive surface survives the change; only its appearance moves.
- The owner has a single set of design decisions to apply when either site changes next, instead of two.

## What Is Not Built

Explicitly out of scope, and why:

- **Light mode.** Retired, at the owner's direction. A black aesthetic that also has to work on white is two designs, not one, and the consulting site has no light mode to unify with. The theme toggle leaves the navigation.
- **Any accent color.** The palette is black and white only, at the owner's direction. The former red accent is retired entirely rather than being demoted to a status color.
- **A fourth voice for the display faces.** Three display faces are used, and each has exactly one job. A face used for two jobs, or a fourth face added for a one-off, is the failure mode this bounds against.
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
- Three display faces and one monospace face are served, each in one role, and no other family is requested by any page.
- No licensed font file is reachable at a browsable URL on the deployed site.
- A person shown both sites side by side, without being told they are related, identifies them as belonging to the same owner, and identifies the portfolio as the more formal of the two.
- The production build completes with no new errors or warnings, and every page renders correctly at mobile, tablet, and the widest desktop breakpoint.
- Every interactive element remains reachable and visibly focused by keyboard, text meets its contrast floor against black, and reduced-motion preferences are still honored.

## Constraints

- **Nothing may stop working.** The chatbot, contact form and its spam protection, visitor analytics, GitHub activity, blog and CMS, and every rail widget must behave exactly as they do today.
- **The multi-breakpoint rail layout must survive intact**, including its sticky offsets and scroll containers at the widest breakpoint.
- **Code blocks keep a monospace face.** The consulting site has no code on it and therefore no monospace need; the portfolio does, so a monospace family is retained for that use only. This is a recorded, deliberate deviation.
- **Display font licensing binds the implementation.** The shared display face is licensed free for commercial use, but its terms forbid modifying the font in any way, and forbid the site distributing it or offering it as a download. Format conversion is permitted. In practice this means the font file may not be subset or altered, and may not sit at any path a visitor can browse to.
- **Every additional font must have its license confirmed before it ships**, with the terms recorded, in the same way the shared display face was.
- **The embedded CMS studio renders its own interface** and cannot be brought into the design language.
- **Accessibility is not a place to economize.** Contrast, focus visibility, touch target size, and reduced-motion handling are requirements, not preferences.
- The house design standard in the standards vault is deliberately not applied to this change, at the owner's direction. The consulting site's language is the reference instead. This is a known divergence from `uix.component.md`, recorded here so it is a decision rather than a drift.

## Data

No change. Nothing about what the site reads or writes moves:

- Visitor analytics, blog content, GitHub activity, contact delivery, and the AI assistant all keep their current sources, destinations, and behavior.
- No new data is collected, and no new personal data is introduced, stored, or transmitted.
- The only assets added to the repository are font files, held outside the publicly served directory.

## Open Questions

- **What is the license of the engraved display face, and where does its file come from?** Owner to supply the font file and its license terms before that part of the work starts. Everything else in this document is unaffected by the answer. If the terms do not permit use on this site, a substitute in the same genre is chosen and the design role it fills does not change.
