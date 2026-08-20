import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-normal transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary-soft text-primary",
        primary: "bg-primary-soft text-primary",
        secondary: "bg-secondary-soft text-foreground",
        accent: "bg-accent-soft text-accent",
        red: "bg-red-50 text-action-red border border-red-100",
        neutral: "bg-surface text-muted border border-border",
        outline: "bg-transparent border border-border-strong text-foreground",
        destructive: "bg-red-100 text-action-red",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  tone?: "primary" | "secondary" | "accent" | "red" | "neutral" | "outline";
}

function Badge({ className, variant, tone, ...props }: BadgeProps) {
  const effectiveVariant = tone || variant || "default";
  return (
    <span
      className={cn(badgeVariants({ variant: effectiveVariant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
