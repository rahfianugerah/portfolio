import { client } from "@/sanity/lib/client";
import { DATA } from "@/data/resume";

/**
 * Projects and certificates, read from Sanity.
 *
 * Both used to live in src/data/resume.tsx, which meant adding one was a commit, a build
 * and a deploy. They are documents now. The resume data stays as the fallback, so the page
 * keeps rendering before the content is migrated and if Sanity is ever unreachable, rather
 * than showing an empty page for a reason a visitor cannot see.
 *
 * The link icons that made the old data unserialisable are gone. A link now carries a
 * `type` string and the renderer decides which component that means.
 */

export type ProjectLinkType = "Website" | "Source Code";

export type ProjectLink = {
  type: ProjectLinkType;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  status: string;
  description: string;
  technologies: string[];
  image: string | null;
  video: string | null;
  links: ProjectLink[];
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  kind: "professional" | "learning";
  categories: string[];
  /** A PDF uploaded to Sanity, which the page can render in place. */
  fileUrl: string | null;
  /** A certificate that only exists on the issuer's site, which the page links to. */
  externalUrl: string | null;
};

const PROJECT_QUERY = `*[_type == "project"]|order(order asc, title asc){
  "id": _id,
  title,
  "status": coalesce(status, ""),
  "description": coalesce(description, ""),
  "technologies": coalesce(technologies, []),
  "image": coalesce(image.asset->url, imageUrl),
  video,
  "links": coalesce(links[]{type, href}, [])
}`;

const CERTIFICATE_QUERY = `*[_type == "certificate"]|order(order asc, title asc){
  "id": _id,
  title,
  issuer,
  "kind": coalesce(kind, "professional"),
  "categories": coalesce(categories, []),
  "fileUrl": file.asset->url,
  externalUrl
}`;

// Content changes when its author saves, not when a visitor arrives, so an hour of cache is
// generous. The studio can revalidate sooner through a webhook if that ever matters.
const REVALIDATE = 3600;

async function query<T>(groq: string, fallback: T[]): Promise<T[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return fallback;

  try {
    const rows = await client.fetch<T[]>(
      groq,
      {},
      { next: { revalidate: REVALIDATE } }
    );
    return rows?.length ? rows : fallback;
  } catch (error) {
    console.error("Sanity content fetch failed, using resume data:", error);
    return fallback;
  }
}

export async function getProjects(): Promise<Project[]> {
  return query<Project>(PROJECT_QUERY, projectsFromResume());
}

export async function getCertificates(): Promise<Certificate[]> {
  return query<Certificate>(CERTIFICATE_QUERY, certificatesFromResume());
}

/* -------------------------------------------------------------------------- */
/* The fallback, and the source the one-time migration reads.                  */
/* -------------------------------------------------------------------------- */

/** Projects as plain data. The icon on each link is dropped; `type` replaces it. */
export function projectsFromResume(): Project[] {
  return DATA.projects.map((project, index) => ({
    id: `resume-project-${index}`,
    title: project.title,
    status: project.status ?? "",
    description: project.description ?? "",
    technologies: [...(project.technologies ?? [])],
    image: project.image || null,
    video: project.video || null,
    links: (project.links ?? [])
      .filter((link): link is typeof link & { type: ProjectLinkType } =>
        link.type === "Website" || link.type === "Source Code"
      )
      .map((link) => ({ type: link.type, href: link.href })),
  }));
}

/** Certificates as plain data. The two resume lists are one type split by `kind`. */
export function certificatesFromResume(): Certificate[] {
  const map = (
    entries: typeof DATA.certifications | typeof DATA.learning_certificate,
    kind: Certificate["kind"]
  ): Certificate[] =>
    entries.map((entry, index) => ({
      id: `resume-${kind}-${index}`,
      title: entry.title,
      issuer: entry.issued,
      kind,
      categories: [...(entry.category ?? [])],
      // Nothing in the resume data is an uploaded file; every one of them is a link to an
      // issuer. Uploading the PDF is what the Sanity field is for.
      fileUrl: null,
      externalUrl: entry.links?.[0]?.href ?? null,
    }));

  return [
    ...map(DATA.certifications, "professional"),
    ...map(DATA.learning_certificate, "learning"),
  ];
}
