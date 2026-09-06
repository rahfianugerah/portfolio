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
  slug: string;
  title: string;
  status: string;
  description: string;
  technologies: string[];
  image: string | null;
  video: string | null;
  gallery: string[];
  /** "owner/repo", whose README is rendered as the project's documentation. */
  readmeRepo: string | null;
  links: ProjectLink[];
};

export type PageMeta = {
  title: string;
  description: string | null;
  heading: string | null;
  subtitle: string | null;
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
  logo: string | null;
  social: SocialLink[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
};

export type SkillGroup = {
  id: string;
  title: string;
  items: string[];
};

export type Role = {
  id: string;
  kind: "work" | "leadership";
  /** The organisation's name. One document, shared by every role and course under it. */
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

const PROJECT_FIELDS = `
  "id": _id,
  "slug": slug.current,
  title,
  "status": coalesce(status, ""),
  "description": coalesce(description, ""),
  "technologies": coalesce(technologies, []),
  "image": coalesce(image.asset->url, imageUrl),
  video,
  "gallery": coalesce(gallery[].asset->url, []),
  readmeRepo,
  "links": coalesce(links[]{label, icon, href}, [])
`;

const PROJECT_QUERY = `*[_type == "project"]|order(order asc, title asc){${PROJECT_FIELDS}}`;

const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0]{${PROJECT_FIELDS}}`;

const PAGE_META_QUERY = `*[_type == "pageMeta" && site == "portfolio" && route == $route][0]{
  title,
  description,
  heading,
  subtitle
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
  "logo": logo.asset->url,
  "social": coalesce(social[]{name, url, icon, "inNavbar": coalesce(inNavbar, true)}, [])
}`;

const SKILL_QUERY = `*[_type == "skillGroup"]|order(order asc){
  "id": _id,
  title,
  "items": coalesce(items, [])
}`;

const SERVICE_QUERY = `*[_type == "service"]|order(order asc){
  "id": _id,
  title,
  description
}`;

const ROLE_QUERY = `*[_type == "role"]|order(order asc){
  "id": _id,
  kind,
  "company": organisation->name,
  title,
  "href": organisation->website,
  location,
  "logo": organisation->logo.asset->url,
  start,
  end,
  "badges": coalesce(badges, []),
  "description": coalesce(description, [])
}`;

const EDUCATION_QUERY = `*[_type == "education"]|order(order asc){
  "id": _id,
  "school": organisation->name,
  degree,
  "href": organisation->website,
  "logo": organisation->logo.asset->url,
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

// Content changes when its author saves, and the author wants to see it. A minute is short
// enough that an edit shows up without a deploy and long enough that a visitor is not
// paying for a round trip per request. A studio webhook would make it immediate.
const REVALIDATE = 60;

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

/** One project, by the slug in its URL. Null when there is no such document. */
export async function getProject(slug: string): Promise<Project | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;

  try {
    return await client.fetch<Project | null>(
      PROJECT_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: REVALIDATE } }
    );
  } catch (error) {
    console.error("Sanity project fetch failed:", error);
    return null;
  }
}

/**
 * The title, description and heading of one route.
 *
 * Null when nothing has been written for it, which is the normal case: a page keeps the
 * words it shipped with until someone decides to change them in the studio.
 */
export async function getPageMeta(route: string): Promise<PageMeta | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;

  try {
    return await client.fetch<PageMeta | null>(
      PAGE_META_QUERY,
      { route },
      { next: { revalidate: REVALIDATE } }
    );
  } catch (error) {
    console.error("Sanity page metadata fetch failed:", error);
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  return query<Service>(SERVICE_QUERY, []);
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
