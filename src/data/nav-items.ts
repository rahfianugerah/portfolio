// The site's own navigation, kept here rather than driven from the resume data.
// The resume describes a person; which pages exist is a property of the site, and the
// two drifted apart the moment a page existed that the resume had no field for.
export const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/project" },
  { label: "Services", href: "/service" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/contact" },
];

// Anchored sections on the home page, used by the hero jump links.
export const homeSections = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experiences" },
  { label: "Projects", href: "/#projects" },
];
