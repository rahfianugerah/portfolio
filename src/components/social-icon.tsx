import { Icons } from "@/components/icons";

/**
 * Maps a social link's `icon` discriminator to a component.
 *
 * The link used to carry the component itself, which is what kept the profile out of a
 * database: a React element does not serialise. The document stores a string and this table
 * turns it back into something renderable.
 */
export const SOCIAL_ICON: Record<string, (props: { className?: string }) => React.JSX.Element> = {
  github: Icons.github,
  linkedin: Icons.linkedin,
  email: Icons.email,
  file: Icons.file,
  globe: Icons.globe,
};
