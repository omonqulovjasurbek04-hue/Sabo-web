import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center py-20 md:py-28 lg:py-36 bg-background overflow-hidden">
      {/* High-Clarity Continuous Looping Milk Video Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover opacity-85 dark:opacity-75 transition-opacity duration-700"
        >
          <source
            src="/video/Milk_pouring_into_glass_202608200354.mp4"
            type="video/mp4"
          />
        </video>
        {/* Soft natural gradient ensuring text readability on the left while video is fully visible and clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="max-w-2xl lg:max-w-3xl flex flex-col items-start">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface/85 backdrop-blur-md text-foreground text-xs sm:text-sm font-bold mb-6 border border-border shadow-xs">
              <span className="size-2.5 rounded-full bg-action-red animate-pulse" />
              {dict.hero.eyebrow}
            </div>

            <h1 className="font-display font-bold text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 drop-shadow-xs">
              {dict.hero.title}
            </h1>

            <p className="text-base sm:text-xl text-foreground/85 max-w-xl mb-10 leading-relaxed font-medium">
              {dict.hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <LinkButton
                href="/products"
                locale={locale}
                variant="primary"
                size="lg"
                className="font-bold shadow-md text-base sm:text-lg px-8 py-4"
              >
                {dict.hero.ctaPrimary}
              </LinkButton>
              <LinkButton
                href="/about"
                locale={locale}
                variant="secondary"
                size="lg"
                className="bg-surface/85 backdrop-blur-md hover:bg-surface text-foreground font-semibold border border-border shadow-xs text-base sm:text-lg px-8 py-4"
              >
                {dict.hero.ctaSecondary}
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}