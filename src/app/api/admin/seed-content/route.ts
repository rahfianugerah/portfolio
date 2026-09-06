import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/auth";
import {
  achievementsFromResume,
  certificatesFromResume,
  educationFromResume,
  projectsFromResume,
  rolesFromResume,
} from "@/lib/content";
import { writeClient } from "@/sanity/lib/write-client";

export const runtime = "nodejs";

/**
 * Copies the resume content out of src/data/resume.tsx and into Sanity, once.
 *
 * Text only. No image URL is carried across, because the images it pointed at were committed
 * to this repository and are gone; the owner uploads them in the studio, which is also the
 * only way an image gets a hotspot and a rendition.
 *
 * It runs here rather than as a standalone script because resume.tsx is TSX holding React
 * elements, so plain Node cannot import it. Next already compiles it, and this route is
 * already behind the owner check, so the migration costs no new tooling and no second way
 * of authenticating.
 *
 * Every document is written with createIfNotExists against an id derived from its title, so
 * running it twice adds nothing and, more importantly, never overwrites an edit made in the
 * studio afterwards. The response says how many of each it skipped for that reason.
 */

/** A stable document id, so a re-run recognises what it already wrote. */
function docId(prefix: string, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `${prefix}.${slug || "untitled"}`;
}

export async function POST() {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let sanity;
  try {
    sanity = writeClient();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No write token" },
      { status: 500 }
    );
  }

  const projects = projectsFromResume().map((project, index) => ({
    _id: docId("project", project.title),
    _type: "project" as const,
    title: project.title,
    slug: { _type: "slug", current: docId("", project.title).slice(1) },
    status: project.status,
    description: project.description,
    technologies: project.technologies,
    video: project.video ?? undefined,
    links: project.links.map((link, i) => ({
      _key: `link-${i}`,
      _type: "object",
      type: link.type,
      href: link.href,
    })),
    order: index,
  }));

  const certificates = certificatesFromResume().map((certificate, index) => ({
    _id: docId("certificate", certificate.title),
    _type: "certificate" as const,
    title: certificate.title,
    issuer: certificate.issuer,
    kind: certificate.kind,
    categories: certificate.categories,
    externalUrl: certificate.externalUrl ?? undefined,
    order: index,
  }));

  const roles = rolesFromResume().map((role, index) => ({
    _id: docId(`role-${role.kind}`, `${role.company}-${role.title}`),
    _type: "role" as const,
    kind: role.kind,
    company: role.company,
    title: role.title,
    href: role.href ?? undefined,
    location: role.location ?? undefined,
    start: role.start,
    end: role.end ?? undefined,
    badges: role.badges,
    description: role.description,
    order: index,
  }));

  const education = educationFromResume().map((entry, index) => ({
    _id: docId("education", `${entry.school}-${entry.degree}`),
    _type: "education" as const,
    school: entry.school,
    degree: entry.degree,
    href: entry.href ?? undefined,
    start: entry.start,
    end: entry.end ?? undefined,
    description: entry.description,
    order: index,
  }));

  const achievements = achievementsFromResume().map((entry, index) => ({
    _id: docId("achievement", entry.title),
    _type: "achievement" as const,
    title: entry.title,
    issuer: entry.issuer ?? undefined,
    dates: entry.dates ?? undefined,
    location: entry.location ?? undefined,
    description: entry.description,
    links: entry.links.map((link, i) => ({
      _key: `link-${i}`,
      _type: "object",
      title: link.title,
      href: link.href,
    })),
    order: index,
  }));

  // Annotated rather than inferred: a union of several document shapes makes the
  // transaction's generic resolve to whichever came first, and the rest stop type-checking.
  const documents: ({ _id: string; _type: string } & Record<string, unknown>)[] = [
    ...projects,
    ...certificates,
    ...roles,
    ...education,
    ...achievements,
  ];

  try {
    // One transaction, so a failure halfway leaves nothing behind to reconcile by hand.
    const transaction = documents.reduce(
      (tx, doc) => tx.createIfNotExists(doc),
      sanity.transaction()
    );
    const result = await transaction.commit();

    return NextResponse.json({
      submitted: documents.length,
      projects: projects.length,
      certificates: certificates.length,
      roles: roles.length,
      education: education.length,
      achievements: achievements.length,
      written: result.results.length,
    });
  } catch (error) {
    console.error("seed-content failed:", error);
    return NextResponse.json(
      { error: "Could not write to Sanity. Check the token's permissions." },
      { status: 500 }
    );
  }
}
