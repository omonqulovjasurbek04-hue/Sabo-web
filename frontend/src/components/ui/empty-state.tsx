import { LinkButton } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  hint?: string;
  actionHref?: string;
  actionLabel?: string;
  locale?: Locale;
  className?: string;
}

export function EmptyState({
  title,
  hint,
  actionHref,
  actionLabel,
  locale,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 py-16 text-center",
        className
      )}
    >
      <h2 className="font-sans text-xl font-semibold">{title}</h2>
      {hint ? <p className="max-w-md text-muted">{hint}</p> : null}
      {actionHref && actionLabel ? (
        <LinkButton href={actionHref} locale={locale} variant="secondary" className="mt-2">
          {actionLabel}
        </LinkButton>
      ) : null}
    </div>
  );
}