import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locales";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-[15px] leading-tight whitespace-nowrap border transition-all duration-200 ease-out cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-55 disabled:pointer-events-none active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-action-red border-action-red text-white hover:bg-action-red-dark hover:border-action-red-dark shadow-xs",
        secondary:
          "bg-primary border-primary text-white hover:bg-primary-dark hover:border-primary-dark shadow-xs",
        tertiary:
          "bg-transparent border-primary text-primary hover:bg-primary-soft",
        outline:
          "bg-surface border-border-strong text-foreground hover:border-primary hover:text-primary",
        ghost:
          "bg-transparent border-transparent text-foreground hover:bg-primary-soft hover:text-primary",
        destructive:
          "bg-red-100 border-red-100 text-red-700 hover:bg-red-200",
        link:
          "bg-transparent border-transparent text-action-red underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "px-6 py-3",
        xs: "px-2.5 py-1 text-xs rounded-lg",
        sm: "px-4 py-2 text-sm rounded-lg",
        md: "px-6 py-3",
        lg: "px-8 py-3.5 text-base",
        icon: "size-10 p-0 rounded-full",
        "icon-xs": "size-6 p-0 rounded-md",
        "icon-sm": "size-8 p-0 rounded-lg",
        "icon-lg": "size-12 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/* ---- Button ---- */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  ariaLabel?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ariaLabel, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={ariaLabel}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

/* ---- LinkButton (locale-aware) ---- */
export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string;
  locale?: Locale;
}

function LinkButton({
  href,
  locale,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: LinkButtonProps) {
  const resolvedHref = locale ? `/${locale}${href === "/" ? "" : href}` : href;
  return (
    <Link
      href={resolvedHref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Link>
  );
}

/* ---- Icon Button ---- */
export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, active, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center size-10 rounded-full border border-border bg-surface text-muted transition-colors duration-200 cursor-pointer",
        "hover:border-primary hover:text-primary hover:bg-primary-soft",
        active && "border-primary text-primary bg-primary-soft",
        className
      )}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";

export { Button, LinkButton, IconButton, buttonVariants };
