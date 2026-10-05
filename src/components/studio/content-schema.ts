import type { DocumentData } from "./api";

/**
 * Every content type the studio edits, and the one place a field is described.
 * The stored shape is the "Studio: Documents" table in API.md.
 */

interface FieldBase {
  name: string;
  label: string;
  help?: string;
  required?: boolean;
}

export interface Option {
  value: string;
  label: string;
}

export type ContentField = FieldBase &
  (
    | { kind: "text" | "textarea" | "number" | "url" | "image" | "file" | "boolean" }
    | { kind: "select"; options: Option[] }
    /** `pick` adds a button that appends an address chosen from Files. */
    | { kind: "stringList"; pick?: "image" }
    | { kind: "objectList"; itemLabel: string; fields: ContentField[] }
    /** Stores the id of a document of the named type. */
    | { kind: "reference"; to: string; titleField: string }
  );

export interface ContentType {
  type: string;
  label: string;
  /** One row, edited in place and created when absent. */
  singleton?: boolean;
  title: (data: DocumentData) => string;
  fields: ContentField[];
}

const text = (value: unknown) => (typeof value === "string" ? value : "");
const byField = (name: string) => (data: DocumentData) => text(data[name]);

const organization: ContentField = {
  name: "organization",
  label: "Organization",
  kind: "reference",
  to: "organization",
  titleField: "name",
  required: true,
};

export const CONTENT_TYPES: ContentType[] = [
  {
    type: "profile",
    label: "Profile",
    singleton: true,
    title: byField("name"),
    fields: [
      { name: "name", label: "Full name", kind: "text", required: true },
      { name: "initials", label: "Initials", kind: "text", help: "Shown when an avatar fails to load." },
      { name: "role", label: "Role", kind: "text", required: true, help: 'The one line under the name, for example "AI Software Engineer".' },
      { name: "summary", label: "Summary", kind: "textarea", help: "The About paragraph. Markdown is rendered." },
      { name: "location", label: "Location", kind: "text" },
      { name: "locationLink", label: "Location link", kind: "url" },
      { name: "avatar", label: "Portrait", kind: "image" },
      { name: "logo", label: "Site logo", kind: "image", help: "Shown in the header instead of the written wordmark. Leave empty to keep the wordmark." },
      {
        name: "social",
        label: "Social links",
        kind: "objectList",
        itemLabel: "Link",
        fields: [
          { name: "name", label: "Name", kind: "text", required: true },
          { name: "url", label: "URL", kind: "url", required: true },
          {
            name: "icon",
            label: "Icon",
            kind: "select",
            required: true,
            help: "Which icon the site draws for this link.",
            options: [
              { value: "github", label: "GitHub" },
              { value: "linkedin", label: "LinkedIn" },
              { value: "email", label: "Email" },
              { value: "file", label: "Document" },
              { value: "globe", label: "Website" },
            ],
          },
          { name: "inNavbar", label: "Show in the dock", kind: "boolean" },
        ],
      },
    ],
  },
  {
    type: "organization",
    label: "Organizations",
    title: byField("name"),
    fields: [
      { name: "name", label: "Name", kind: "text", required: true },
      { name: "website", label: "Website", kind: "url" },
      { name: "logo", label: "Logo", kind: "image", help: "Chosen once. Every role and every course here uses it." },
    ],
  },
  {
    type: "role",
    label: "Roles",
    title: byField("title"),
    fields: [
      {
        name: "kind",
        label: "Kind",
        kind: "select",
        required: true,
        options: [
          { value: "work", label: "Work" },
          { value: "leadership", label: "Leadership" },
        ],
      },
      { ...organization, help: "The place. Its name and logo live there, so they are written once." },
      { name: "title", label: "Position", kind: "text", required: true },
      { name: "location", label: "Location", kind: "text" },
      { name: "start", label: "Start", kind: "text", required: true, help: 'Written the way it should read, for example "Sep 2025".' },
      { name: "end", label: "End", kind: "text", help: "Leave empty for a position still held." },
      { name: "badges", label: "Badges", kind: "stringList" },
      { name: "description", label: "What the role covered", kind: "stringList", help: "One line per point." },
    ],
  },
  {
    type: "education",
    label: "Education",
    title: byField("degree"),
    fields: [
      { ...organization, help: "The school. Shared with any role held at the same place." },
      { name: "degree", label: "Degree or programme", kind: "text", required: true },
      { name: "start", label: "Start", kind: "text", required: true },
      { name: "end", label: "End", kind: "text", help: "Leave empty while still studying." },
      { name: "description", label: "Detail", kind: "stringList", help: "One line per point." },
    ],
  },
  {
    type: "achievement",
    label: "Achievements",
    title: byField("title"),
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "issuer", label: "Awarded by", kind: "text" },
      { name: "dates", label: "Date", kind: "text", help: 'Written the way it should read, for example "Jan 2026".' },
      { name: "location", label: "Location", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "image", label: "Photograph", kind: "image" },
      {
        name: "links",
        label: "Links",
        kind: "objectList",
        itemLabel: "Link",
        fields: [
          { name: "title", label: "Label", kind: "text", required: true },
          { name: "href", label: "URL", kind: "url", required: true },
        ],
      },
    ],
  },
  {
    type: "certificate",
    label: "Certificates",
    title: byField("title"),
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "issuer", label: "Issued by", kind: "text", required: true },
      {
        name: "kind",
        label: "Kind",
        kind: "select",
        required: true,
        options: [
          { value: "professional", label: "Professional certification" },
          { value: "learning", label: "Course completion" },
        ],
      },
      { name: "categories", label: "Categories", kind: "stringList" },
      { name: "fileUrl", label: "Certificate PDF", kind: "file", help: "Chosen here, the certificate is readable on the page itself." },
      { name: "externalUrl", label: "Certificate URL", kind: "url", help: "For a certificate that lives on the issuer's site. Used when no PDF is chosen." },
    ],
  },
  {
    type: "project",
    label: "Projects",
    title: byField("title"),
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "slug", label: "Slug", kind: "text", required: true },
      { name: "status", label: "Status", kind: "text", help: "Maintained, Archived, In Progress, and so on." },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "technologies", label: "Technologies", kind: "stringList" },
      { name: "image", label: "Preview image", kind: "image", help: "Shown on the project page. Landscape reads best." },
      { name: "video", label: "Preview video URL", kind: "url", help: "Plays in place of the image when set." },
      { name: "gallery", label: "Gallery", kind: "stringList", pick: "image", help: "One image address per line, as many as you like." },
      { name: "readmeRepo", label: "GitHub repository", kind: "text", help: "owner/repo, for example rahfianugerah/portfolio. Its README is rendered as the documentation. Leave empty to take it from the source link." },
      {
        name: "links",
        label: "Links",
        kind: "objectList",
        itemLabel: "Link",
        fields: [
          { name: "label", label: "Label", kind: "text", required: true, help: 'What the button says, for example "Source" or "Forked Source".' },
          {
            name: "icon",
            label: "Icon",
            kind: "select",
            required: true,
            options: [
              { value: "github", label: "Source code" },
              { value: "globe", label: "Website" },
            ],
          },
          { name: "href", label: "URL", kind: "url", required: true },
        ],
      },
    ],
  },
  {
    type: "skillGroup",
    label: "Skill groups",
    title: byField("title"),
    fields: [
      { name: "title", label: "Group", kind: "text", required: true, help: 'For example "Languages" or "Frameworks".' },
      { name: "items", label: "Technologies", kind: "stringList", required: true },
    ],
  },
  {
    type: "service",
    label: "Services",
    title: byField("title"),
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "description", label: "Description", kind: "textarea", required: true },
    ],
  },
  {
    type: "moment",
    label: "Moments",
    title: (data) => text(data.alt) || text(data.caption),
    fields: [
      { name: "image", label: "Photograph", kind: "image", required: true },
      { name: "alt", label: "Alternative text", kind: "text", required: true, help: "What the photograph shows, for anyone who cannot see it." },
      { name: "caption", label: "Caption", kind: "text", help: "Optional. Shown over the image." },
    ],
  },
  {
    type: "quote",
    label: "Quotes",
    title: byField("author"),
    fields: [
      { name: "text", label: "Quotation", kind: "textarea", required: true },
      { name: "author", label: "Author", kind: "text", required: true },
      { name: "role", label: "Role", kind: "text", help: 'Shown under the name, for example "CEO, NVIDIA".' },
      { name: "image", label: "Portrait", kind: "image" },
    ],
  },
  {
    type: "pageMeta",
    label: "Page metadata",
    title: (data) => `${text(data.site)} ${text(data.route)}`.trim(),
    fields: [
      {
        name: "site",
        label: "Site",
        kind: "select",
        required: true,
        options: [
          { value: "portfolio", label: "Portfolio" },
          { value: "consulting", label: "Consulting" },
        ],
      },
      { name: "route", label: "Route", kind: "text", required: true, help: "The path exactly as it appears in the address bar, for example /project." },
      { name: "title", label: "Browser title", kind: "text", required: true, help: "Shown in the tab and in search results, before the site name." },
      { name: "description", label: "Description", kind: "textarea", help: "The one sentence search engines and link previews show." },
      { name: "heading", label: "Heading", kind: "text", help: 'The visible title on the page. The accent punctuation is added by the site, so write "Projects" rather than "Rahfi\'s | Projects."' },
      { name: "subtitle", label: "Subtitle", kind: "textarea", help: "The paragraph under the heading." },
    ],
  },
  {
    type: "clientProject",
    label: "Client engagements",
    title: byField("client"),
    fields: [
      { name: "client", label: "Client", kind: "text", required: true },
      { name: "sector", label: "Sector", kind: "text" },
      { name: "year", label: "Year", kind: "text", help: "A year or a range, written the way it should read." },
      { name: "summary", label: "Summary", kind: "textarea", help: "What the engagement set out to solve, in the client's terms." },
      { name: "services", label: "Services", kind: "stringList" },
      { name: "outcome", label: "Outcome", kind: "textarea", help: "The measurable result the client agreed to." },
      { name: "image", label: "Preview image", kind: "image" },
    ],
  },
  {
    type: "counter",
    label: "Counters",
    title: (data) => `${text(data.label)} ${data.value ?? ""}${text(data.suffix)}`.trim(),
    fields: [
      { name: "label", label: "Label", kind: "text", required: true, help: "What the number counts, for example Clients served." },
      { name: "value", label: "Value", kind: "number", required: true },
      { name: "suffix", label: "Suffix", kind: "text", help: "Shown right after the number, for example +." },
    ],
  },
  {
    type: "pricingTier",
    label: "Consulting pricing",
    title: (data) => `${text(data.name)} ${text(data.price)}`.trim(),
    fields: [
      { name: "name", label: "Name", kind: "text", required: true, help: "The engagement, for example Technical Audit." },
      { name: "price", label: "Price", kind: "text", required: true, help: "Written the way it should read, for example $2,500 or Custom. The assistant quotes it as written." },
      { name: "cycle", label: "Billing", kind: "text", help: "Shown beside the price, for example one-time or per month." },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "features", label: "What is included", kind: "stringList" },
      { name: "recommended", label: "Mark as popular", kind: "boolean" },
    ],
  },
  {
    type: "consultingService",
    label: "Consulting services",
    title: byField("title"),
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "body", label: "Description", kind: "textarea", required: true },
      {
        name: "icon",
        label: "Icon",
        kind: "select",
        required: true,
        help: "Which icon the consulting site draws beside the service.",
        options: [
          { value: "code", label: "Code" },
          { value: "zap", label: "Lightning" },
          { value: "brain", label: "Brain" },
          { value: "chart", label: "Chart" },
          { value: "database", label: "Database" },
          { value: "cloud", label: "Cloud" },
        ],
      },
    ],
  },
  {
    type: "principle",
    label: "Consulting principles",
    title: byField("title"),
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "body", label: "Description", kind: "textarea", required: true },
    ],
  },
  {
    type: "processStep",
    label: "Consulting process",
    title: (data) => `${text(data.step)} ${text(data.title)}`.trim(),
    fields: [
      { name: "step", label: "Step", kind: "text", required: true, help: "Written the way it should read, for example 01." },
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "body", label: "Description", kind: "textarea", required: true },
    ],
  },
];

export function findContentType(type: string): ContentType | undefined {
  return CONTENT_TYPES.find((candidate) => candidate.type === type);
}
