/**
 * The few constants that are configuration rather than content.
 *
 * Everything a visitor reads lives in Sanity. What is left here is the origin, which
 * `metadataBase` needs synchronously at module scope, and the navigation, which is a map of
 * this application's routes rather than anything about the person.
 */
import {
  BotIcon,
  HomeIcon,
  MailIcon,
  NotebookIcon,
  TerminalIcon,
} from "lucide-react";
import { FaBusinessTime } from "react-icons/fa";

export const SITE_URL = "https://rahfi.pro";

export const navItems = [
  { href: "/", icon: HomeIcon, label: "Home", inDock: true },
  { href: "/experience", icon: FaBusinessTime, label: "Experience", inDock: true },
  { href: "/project", icon: TerminalIcon, label: "Project", inDock: true },
  { href: "/blog", icon: NotebookIcon, label: "Blog", inDock: true },
  { href: "/contact", icon: MailIcon, label: "Contact", inDock: true },
  // Header only. The dock is a row of icons, and a conversation is not a thing anyone
  // recognises from one.
  { href: "/chat", icon: BotIcon, label: "Chat", inDock: false },
];
