import { LocalizedLink } from "@/components/layout/localized-link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
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
  reverse = false,
}: PreviewBandProps) {
  return (
    <Reveal>
      <section
        className={cn(
          "grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-8 py-10 border-b border-border",
          reverse && "md:grid-cols-[1fr_120px]"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center size-28 rounded-3xl bg-secondary-soft text-secondary shrink-0",
            reverse && "md:order-last justify-self-center md:justify-self-end"
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="flex flex-col items-start gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            {eyebrow}
          </span>
          <h3 className="font-display font-bold text-2xl text-foreground">{title}</h3>
          <p className="text-base text-muted max-w-2xl">{text}</p>
          <LocalizedLink
            href={href}
            locale={locale}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-border-strong bg-surface text-foreground hover:border-secondary hover:text-secondary transition-colors mt-2"
          >
            {ctaLabel}
            <ArrowRightIcon width={16} height={16} />
          </LocalizedLink>
        </div>
      </section>
    </Reveal>
  );
}