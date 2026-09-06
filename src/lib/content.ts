import { client } from "@/sanity/lib/client";

/**
 * Every piece of content the site renders, read from Sanity.
 *
 * All of it used to live in src/data/resume.tsx, so adding a project or fixing a date was a
 * commit, a build and a deploy. That file is gone; what it held was exported once to
 * sanity/exports/resume.ndjson and imported into the dataset.
 *
 * There is no fallback any more, and that is deliberate. A fallback was worth having while
 * the dataset was empty; keeping one now would mean a second copy of the content in the
 * repository, which is the thing this change removed. An unreachable Sanity renders an
 * empty section, and the console says why.
 *
 * The link icons that made the old data unserialisable are gone. A link carries a string
 * and the renderer decides which component that means.
 */

/** Which component the renderer draws. The label beside it is free text. */
export type ProjectLinkIcon = "github" | "globe";

export type ProjectLink = {
  label: string;
  icon: ProjectLinkIcon;
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

export type Moment = {
  id: string;
  image: string;
  alt: string;
  caption: string | null;
};

export type Quote = {
  id: string;
  text: string;
  author: string;
  role: string | null;
  image: string | null;
};

export type SocialLink = {
  name: string;
  url: string;
  icon: string;
  inNavbar: boolean;
};

export type Profile = {
  name: string;
  initials: string;
  role: string;
  summary: string;
  location: string | null;
  locationLink: string | null;
  avatar: string | null;
  social: SocialLink[];
};

export type SkillGroup = {
  id: string;
  title: string;
  items: string[];
};

export type Role = {
  id: string;
  kind: "work" | "leadership";
  company: string;
  title: string;
  href: string | null;
  location: string | null;
  logo: string | null;
  start: string;
  /** Empty for a position still held. The renderer supplies the word "Present". */
  end: string | null;
  badges: string[];
  description: string[];
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  href: string | null;
  logo: string | null;
  start: string;
  end: string | null;
  description: string[];
};

export type Achievement = {
  id: string;
  title: string;
  issuer: string | null;
  dates: string | null;
  location: string | null;
  description: string;
  image: string | null;
  links: { title: string; href: string }[];
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
  "links": coalesce(links[]{label, icon, href}, [])
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

const MOMENT_QUERY = `*[_type == "moment" && defined(image.asset)]|order(order asc){
  "id": _id,
  "image": image.asset->url,
  "alt": coalesce(alt, ""),
  caption
}`;

const QUOTE_QUERY = `*[_type == "quote"]|order(order asc){
  "id": _id,
  text,
  author,
  role,
  "image": image.asset->url
}`;

const PROFILE_QUERY = `*[_type == "profile"][0]{
  name,
  "initials": coalesce(initials, ""),
  role,
  "summary": coalesce(summary, ""),
  location,
  locationLink,
  "avatar": avatar.asset->url,
  "social": coalesce(social[]{name, url, icon, "inNavbar": coalesce(inNavbar, true)}, [])
}`;

const SKILL_QUERY = `*[_type == "skillGroup"]|order(order asc){
  "id": _id,
  title,
  "items": coalesce(items, [])
}`;

const ROLE_QUERY = `*[_type == "role"]|order(order asc){
  "id": _id,
  kind,
  company,
  title,
  href,
  location,
  "logo": logo.asset->url,
  start,
  end,
  "badges": coalesce(badges, []),
  "description": coalesce(description, [])
}`;

const EDUCATION_QUERY = `*[_type == "education"]|order(order asc){
  "id": _id,
  school,
  degree,
  href,
  "logo": logo.asset->url,
  start,
  end,
  "description": coalesce(description, [])
}`;

const ACHIEVEMENT_QUERY = `*[_type == "achievement"]|order(order asc){
  "id": _id,
  title,
  issuer,
  dates,
  location,
  "description": coalesce(description, ""),
  "image": image.asset->url,
  "links": coalesce(links[]{title, href}, [])
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
  return query<Project>(PROJECT_QUERY, []);
}

export async function getCertificates(): Promise<Certificate[]> {
  return query<Certificate>(CERTIFICATE_QUERY, []);
}

/**
 * The site's identity. Unlike every list here it is a single document, so an empty dataset
 * has nothing to return: the caller gets null and decides what to render. There is no
 * fallback, because the copy that used to be one lives in this dataset now.
 */
export async function getProfile(): Promise<Profile | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;

  try {
    return await client.fetch<Profile | null>(
      PROFILE_QUERY,
      {},
      { next: { revalidate: REVALIDATE } }
    );
  } catch (error) {
    console.error("Sanity profile fetch failed:", error);
    return null;
  }
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  return query<SkillGroup>(SKILL_QUERY, []);
}

export async function getRoles(): Promise<Role[]> {
  return query<Role>(ROLE_QUERY, []);
}

export async function getEducation(): Promise<Education[]> {
  return query<Education>(EDUCATION_QUERY, []);
}

export async function getAchievements(): Promise<Achievement[]> {
  return query<Achievement>(ACHIEVEMENT_QUERY, []);
}

export async function getMoments(): Promise<Moment[]> {
  return query<Moment>(MOMENT_QUERY, []);
}

export async function getQuotes(): Promise<Quote[]> {
  return query<Quote>(QUOTE_QUERY, []);
}
