import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { LinkButton } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

export function CtaSection({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section className="py-14 sm:py-18">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-14 lg:p-18 text-center text-white shadow-md">
            <div className="relative z-10 flex flex-col items-center gap-5 max-w-xl mx-auto">
              <span className="px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider">
                SABO Dairy
              </span>
              <h2 className="font-display font-bold text-white text-2xl sm:text-3xl lg:text-4xl">
                {dict.home.ctaTitle}
              </h2>
              <p className="text-white/85 text-base sm:text-lg">
                {dict.home.ctaText}
              </p>
              <LinkButton
                href="/products"
                locale={locale}
                variant="primary"
                size="lg"
                className="mt-2 font-bold shadow-md"
              >
                {dict.home.ctaButton}
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}