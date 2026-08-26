import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Square, hairline-bordered, wide-tracked: the small uppercase chip the consulting site
// uses for tags and markers. No fill for emphasis and no shadow.
const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white",
  {
    variants: {
      variant: {
        default: "border-white bg-white text-black hover:bg-zinc-300",
        secondary:
          "border-zinc-700 bg-transparent text-zinc-300 hover:border-white hover:text-white",
        destructive: "border-white bg-transparent text-white",
        outline: "border-zinc-700 text-zinc-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
