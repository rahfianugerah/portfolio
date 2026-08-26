import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

// The consulting button: square, bordered, uppercase and wide-tracked, and it changes
// on hover by moving its border and fill rather than by lifting on a shadow.
// Focus is an outline, not a ring: a spread shadow reads as depth, which this design
// reserves for genuine overlays.
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border text-xs font-bold uppercase tracking-[0.18em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-white bg-white text-black hover:border-zinc-300 hover:bg-zinc-300",
        destructive:
          "border-white bg-transparent text-white hover:bg-white hover:text-black",
        outline:
          "border-zinc-600 bg-black/50 text-white hover:border-white hover:bg-white hover:text-black",
        secondary:
          "border-zinc-700 bg-zinc-900 text-white hover:border-white",
        // Kept borderless: this is what the navigation dock icons use, and a hover
        // border on a 40px icon target reads as a box rather than as a highlight.
        ghost:
          "border-transparent bg-transparent text-zinc-200 hover:bg-white/10 hover:text-white",
        link: "border-transparent bg-transparent text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-3",
        sm: "h-9 px-3 text-[10px]",
        lg: "h-12 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
