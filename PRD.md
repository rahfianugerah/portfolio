# PRD: The Studio Backend as Its Own Deployable

**Owner:** Naufal Rahfi Anugerah
**Date:** 2026-10-05
**Status:** Approved

**The product intent is not restated here.** What the studio is for, who signs in, and what it must never do are Phase 4, "A Studio of My Own", of `PRD.md` on the site's branches, `main` and `dev`, of this same repository. This document covers one thing only: the backend that Phase 4 called for, released on its own. Where the two disagree about the product, Phase 4 is right and this one is corrected.

Phase 4 in brief, for a reader who has only this branch: the owner runs both sites, `rahfi.pro` and `consulting.rahfi.pro`, from one private studio; writes posts in Markdown; keeps files the way a drive works; and changes the assistant's model, the mail sender, and the storage credentials without a redeploy. Nothing saved there can be read back.

## Problem

The backend shipped inside the portfolio site, as part of that site's deployment. Three things followed from that, and each one cost something.

- **Every change to a page redeployed the thing that holds the secrets.** A copy edit on the portfolio rebuilt and replaced the only process that can write to the database, and a rollback of the site rolled the backend back with it.
- **The consulting site depended on the portfolio's deployment.** Its assistant reached the model through another site, so a bad deploy of the portfolio could silence an assistant on a site that had not changed.
- **Two unrelated things shared one release.** The site and the backend have different runtimes, different dependencies, and different reasons to change, and neither could ship without the other.

## Users

- **Naufal Rahfi Anugerah**, the only person who deploys it and the only person who signs in to the studio it serves.
- **The two sites**, as callers: the portfolio on behalf of its visitors and its studio, and the consulting site on behalf of its assistant.
- **Visitors to both sites**, indirectly: they talk to the assistants and send the contact form.

## What Is Built

Once this exists, the owner can:

- **Release the backend without releasing a site**, and release a site without touching the backend.
- **Roll either one back alone.**
- **Keep the database's write access in one place.** The deployment that serves the studio is the only one holding it; neither site does.
- **Serve both sites from one backend that belongs to neither**, so the consulting site's assistant no longer passes through the portfolio.
- **Keep one sign-in on the portfolio's own address.** The owner still opens the studio on `rahfi.pro`, and a visitor still sees one site, not two.
- **Keep per-visitor limits meaningful** even though visitors now arrive by way of a site's server.
- **Check a change on a local machine with no database and no credential.**

Everything Phase 4 lists as built is unchanged by this: the studio, the vault, the file manager, posts, documents, the one-time import, both assistants, and the contact form behave as they did.

## What Is Not Built

- **No new product capability.** This is a change in how the backend is released, not in what the studio does. A feature request belongs in a new phase of the site's PRD.
- **No deployment of `backend-dev`.** There is no preview and no staging environment. The first place a change runs for real is production.
- **No second database.** Local work and production use the same one. A staging copy was not asked for.
- **No public interface for third parties.** The callers are the owner's two sites. There are no client keys, no published reference, and no versioning promise.
- **No repository of its own, yet.** The backend lives in the site's repository as a separate history. Moving it is an open question below.
- **No automatic check before a release.** Tests are run by hand.
- **No change to how pages read published content.** They still read it directly, not through the backend, so a page renders when the backend is down.
- **No second account, roles, or sign-up**, exactly as Phase 4 already excludes.

## Success Measure

- A push to either site branch produces no backend deployment, and a push to either backend branch produces no site deployment.
- The backend's health check answers on its own address after a release, before either site is touched.
- The consulting site's assistant answers while the portfolio is being redeployed.
- Signing in to the studio on `rahfi.pro` works with no cookie set on any other address.
- Two visitors behind the same site are limited separately, and a caller that is not one of the sites cannot choose which visitor it is counted as.
- The full test suite passes on a machine holding no credential and no network access to the database.
- Every measure in Phase 4 still holds: a saved credential's value appears in no response and no log line, and a dump of the database yields nothing usable without the deployment's key.

## Constraints

- **Platforms are set by the owner:** Vercel for hosting, Supabase for the data, Google Cloud Storage for files, and FastAPI for the backend, as Phase 4 records.
- **One repository, two histories.** The backend lives on `backend-main` and `backend-dev`. Those branches are never merged with `main` or `dev`, in either direction.
- **Only `backend-main` is deployed.**
- **One database, shared with both sites.** A schema change is forward-only and additive, because the sites and the backend release at different times against it.
- **The key that seals the stored secrets has to be the one that sealed what is already there.** Changing it means resetting the password and entering every credential again.
- **The service-account key stays in the studio, sealed**, at the owner's direction, as Phase 4 records.
- **No environment file is read, printed, or copied** by any tool or agent.
- **The owner's address and every saved secret never appear in a response or a log line.**

## Data

- **Supabase Postgres, read and written:** every content document and post both sites show, the owner's account, its sessions and reset codes, the stored credentials, and the rate-limit counts. The site's visitor analytics live in the same database and are not touched by the backend.
- **Google Cloud Storage, read and written:** images, PDFs, and Markdown files the owner uploads, and the files copied once from Sanity.
- **Sent out:** questions and resume content to the model the owner has chosen; contact messages and reset codes to a mail server.
- **Secrets at rest:** the password digest, the model key, the mail password, and the service-account key. All sealed, all server-only.
- **Personal data:** the owner's email address in the account row; the resume's name, contact details, and employment history; the name, email address, and network address a visitor submits with a contact message, which are mailed to the owner and not stored; and a one-way digest of a visitor's network address in the rate limits.

## Open Questions

- **Does `backend-dev` get a deployment of its own, and a database to go with it?** Today nothing rehearses a release. Owner to decide.
- **Does the backend move to a repository of its own?** It shares one with the site as a separate history. Owner to decide.
- **Keyless access to Google Cloud Storage?** Open since Phase 4. It would remove the most dangerous stored secret. Owner to decide.
- **Does a check run the tests before a merge to `backend-main`?** Owner to decide.
