/**
 * The few constants that are configuration rather than content.
 *
 * Everything a visitor reads lives in Sanity. What is left here is the origin, which
 * `metadataBase` needs synchronously at module scope, and the navigation, which is a map of
 * this application's routes rather than anything about the person.
 */
import {
  HomeIcon,
  MailIcon,
  NotebookIcon,
  TerminalIcon,
} from "lucide-react";
import { FaBusinessTime } from "react-icons/fa";

export const SITE_URL = "https://rahfi.pro";

export const navItems = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/experience", icon: FaBusinessTime, label: "Experience" },
  { href: "/project", icon: TerminalIcon, label: "Project" },
  { href: "/blog", icon: NotebookIcon, label: "Blog" },
  { href: "/contact", icon: MailIcon, label: "Contact" },
];
