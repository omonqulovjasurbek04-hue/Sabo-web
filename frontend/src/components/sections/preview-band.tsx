import { LocalizedLink } from "@/components/layout/localized-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";

interface PreviewBandProps {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  href: string;
  locale: Locale;
  className?: string;
  reverse?: boolean;
}

export function PreviewBand({
  icon,
  eyebrow,
  title,
  text,
  ctaLabel,
  href,
  locale,
  className,
}: PreviewBandProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between h-full p-7 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300",
        className
      )}
    >
      <div>
        <div
          className="flex items-center justify-center size-16 sm:size-18 rounded-2xl bg-secondary-soft text-secondary mb-6 group-hover:scale-105 transition-transform duration-300 shrink-0"
          aria-hidden="true"
        >
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
          {eyebrow}
        </span>
        <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground mt-2 mb-3">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          {text}
        </p>
      </div>

      <div className="pt-6 mt-auto">
        <LocalizedLink
          href={href}
          locale={locale}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-border bg-background/50 text-foreground group-hover:border-primary group-hover:text-primary transition-all duration-200"
        >
          <span>{ctaLabel}</span>
          <ArrowRightIcon width={16} height={16} className="group-hover:translate-x-1 transition-transform" />
        </LocalizedLink>
      </div>
    </div>
  );
}

export { PreviewBand as PreviewCard };