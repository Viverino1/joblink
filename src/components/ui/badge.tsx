import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/25",
        secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/25",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/25",
        outline: "border border-input bg-background/50 hover:bg-accent hover:text-accent-foreground",
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