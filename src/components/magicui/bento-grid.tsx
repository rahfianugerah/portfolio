import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

// Magic UI's Bento Grid. The call to action is a plain link rather than the registry's Button,
// and the greys are the theme's. BentoGrid is also used on its own, as the frame the home page's
// signal cards are laid into.

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-4", className)} {...props}>
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-background dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="p-4">
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10">
        <Icon className="h-10 w-10 origin-left transform-gpu text-foreground/80 transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-xl font-semibold text-foreground">{name}</h3>
        <p className="max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden">
        <Link href={href} className="pointer-events-auto mt-2 inline-flex items-center text-sm font-medium underline-offset-4 hover:underline">
          {cta}
          <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>

    <div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
      <Link href={href} className="pointer-events-auto inline-flex items-center text-sm font-medium underline-offset-4 hover:underline">
        {cta}
        <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
      </Link>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-foreground/[0.03]" />
  </div>
);

export { BentoCard, BentoGrid };
