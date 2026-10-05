import { readPublished } from "@/lib/published";

/**
 * Every piece of content the site renders, read from the documents table.
 *
 * It lived in src/data/resume.tsx once, then in Sanity. It is edited in /studio now, and this
 * file is still the only thing that reads it: every page and every widget goes through here,
 * which is why the store could change twice without a page noticing.
 *
 * There is no fallback, and that is deliberate. A fallback would be a second copy of the
 * content in the repository. An unreachable database renders an empty section, and the
 * console says why.
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
  /** The organization's name. One document, shared by every role and course under it. */
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
  /** A PDF uploaded in the studio, which the page can render in place. */
  fileUrl: string | null;
  /** A certificate that only exists on the issuer's site, which the page links to. */
  externalUrl: string | null;
};

/** A row as the backend returns it. `data` is whatever the studio saved for that type. */
type Row = { id: string; data: Record<string, unknown>; sort_order: number };

async function documents(type: string): Promise<Row[]> {
  return (await readPublished<Row[]>(`documents?type=${type}`)) ?? [];
}

// The studio saves what was typed, so a field can be missing or empty. These three read one
// defensively, which is the job coalesce() did in every query this replaced.
const text = (value: unknown): string => (typeof value === "string" ? value : "");
const optional = (value: unknown): string | null =>
  typeof value === "string" && value ? value : null;
const list = <T = string>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

/** Studio order first, then a name, so rows at the same position do not shuffle between reads. */
const byName = (key: string) => (a: Row, b: Row) =>
  a.sort_order - b.sort_order || text(a.data[key]).localeCompare(text(b.data[key]));

type Organization = { name: string; website: string | null; logo: string | null };

/** Organizations by id. A role and a course both point at one rather than repeating it. */
async function organizations(): Promise<Map<string, Organization>> {
  const rows = await documents("organization");
  return new Map(
    rows.map(({ id, data }) => [
      id,
      { name: text(data.name), website: optional(data.website), logo: optional(data.logo) },
    ])
  );
}

function toProject({ id, data }: Row): Project {
  return {
    id,
    slug: text(data.slug),
    title: text(data.title),
    status: text(data.status),
    description: text(data.description),
    technologies: list(data.technologies),
    image: optional(data.image),
    video: optional(data.video),
    gallery: list(data.gallery),
    readmeRepo: optional(data.readmeRepo),
    links: list<ProjectLink>(data.links),
  };
}

export async function getProjects(): Promise<Project[]> {
  return (await documents("project")).sort(byName("title")).map(toProject);
}

/** One project, by the slug in its URL. Null when there is no such document. */
export async function getProject(slug: string): Promise<Project | null> {
  // The list is one cached read that the index page makes anyway, so finding the project in
  // it costs nothing a second query would save.
  return (await getProjects()).find((project) => project.slug === slug) ?? null;
}

export async function getCertificates(): Promise<Certificate[]> {
  return (await documents("certificate")).sort(byName("title")).map(({ id, data }) => ({
    id,
    title: text(data.title),
    issuer: text(data.issuer),
    kind: data.kind === "learning" ? "learning" : "professional",
    categories: list(data.categories),
    fileUrl: optional(data.fileUrl),
    externalUrl: optional(data.externalUrl),
  }));
}

/**
 * The site's identity. Unlike every list here it is a single document, so an empty table has
 * nothing to return: the caller gets null and decides what to render.
 */
export async function getProfile(): Promise<Profile | null> {
  const [row] = await documents("profile");
  if (!row) return null;

  const { data } = row;
  return {
    name: text(data.name),
    initials: text(data.initials),
    role: text(data.role),
    summary: text(data.summary),
    location: optional(data.location),
    locationLink: optional(data.locationLink),
    avatar: optional(data.avatar),
    logo: optional(data.logo),
    social: list<Partial<SocialLink>>(data.social).map((link) => ({
      name: text(link.name),
      url: text(link.url),
      icon: text(link.icon),
      inNavbar: link.inNavbar ?? true,
    })),
  };
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  return (await documents("skillGroup")).map(({ id, data }) => ({
    id,
    title: text(data.title),
    items: list(data.items),
  }));
}

/**
 * The title, description and heading of one route.
 *
 * Null when nothing has been written for it, which is the normal case: a page keeps the
 * words it shipped with until someone decides to change them in the studio. Both sites'
 * routes are stored together and collide, so the site is part of the key.
 */
export async function getPageMeta(route: string): Promise<PageMeta | null> {
  const row = (await documents("pageMeta")).find(
    ({ data }) => data.site === "portfolio" && data.route === route
  );
  if (!row) return null;

  return {
    title: text(row.data.title),
    description: optional(row.data.description),
    heading: optional(row.data.heading),
    subtitle: optional(row.data.subtitle),
  };
}

export async function getServices(): Promise<Service[]> {
  return (await documents("service")).map(({ id, data }) => ({
    id,
    title: text(data.title),
    description: text(data.description),
  }));
}

export async function getRoles(): Promise<Role[]> {
  const [rows, orgs] = await Promise.all([documents("role"), organizations()]);

  return rows.map(({ id, data }) => {
    const organization = orgs.get(text(data.organization));
    return {
      id,
      kind: data.kind === "leadership" ? "leadership" : "work",
      company: organization?.name ?? "",
      title: text(data.title),
      href: organization?.website ?? null,
      location: optional(data.location),
      logo: organization?.logo ?? null,
      start: text(data.start),
      end: optional(data.end),
      badges: list(data.badges),
      description: list(data.description),
    };
  });
}

export async function getEducation(): Promise<Education[]> {
  const [rows, orgs] = await Promise.all([documents("education"), organizations()]);

  return rows.map(({ id, data }) => {
    const organization = orgs.get(text(data.organization));
    return {
      id,
      school: organization?.name ?? "",
      degree: text(data.degree),
      href: organization?.website ?? null,
      logo: organization?.logo ?? null,
      start: text(data.start),
      end: optional(data.end),
      description: list(data.description),
    };
  });
}

export async function getAchievements(): Promise<Achievement[]> {
  return (await documents("achievement")).map(({ id, data }) => ({
    id,
    title: text(data.title),
    issuer: optional(data.issuer),
    dates: optional(data.dates),
    location: optional(data.location),
    description: text(data.description),
    image: optional(data.image),
    links: list<{ title: string; href: string }>(data.links),
  }));
}

export async function getMoments(): Promise<Moment[]> {
  return (
    (await documents("moment"))
      // A moment is its photograph, so one without an image has nothing to show.
      .filter(({ data }) => optional(data.image))
      .map(({ id, data }) => ({
        id,
        image: text(data.image),
        alt: text(data.alt),
        caption: optional(data.caption),
      }))
  );
}

export async function getQuotes(): Promise<Quote[]> {
  return (await documents("quote")).map(({ id, data }) => ({
    id,
    text: text(data.text),
    author: text(data.author),
    role: optional(data.role),
    image: optional(data.image),
  }));
}
