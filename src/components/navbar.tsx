import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navItems } from "@/data/site";
import { useSiteContent } from "@/lib/use-site-content";
import { SOCIAL_ICON } from "@/components/social-icon";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar() {
  const content = useSiteContent();
  const social = (content?.profile?.social ?? []).filter((link) => link.inNavbar);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14 px-4">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock magnification={45} className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background transform-gpu">
        {navItems.filter((item) => item.inDock).map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-10 sm:size-12"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {social.map((link) => {
          const Icon = SOCIAL_ICON[link.icon] ?? SOCIAL_ICON.globe;
          return (
            <DockIcon key={link.name} className={cn(link.name === "CV" && "hidden sm:flex")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={link.url}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-10 sm:size-12"
                    )}
                  >
                    <Icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{link.name}</TooltipContent>
              </Tooltip>
            </DockIcon>
          );
        })}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle className="size-10 sm:size-12" />
            </TooltipTrigger>
            <TooltipContent>Theme</TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
}
