import type { Metadata } from "next";
import Image from "next/image";

import { LocalizedLink } from "@/components/layout/localized-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  DropletIcon,
  LabIcon,
  PackageIcon,
  ShieldIcon,
} from "@/components/ui/icons";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface ProductionPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProductionPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/production",
    title: dict.production.title,
    description: dict.production.subtitle,
  });
}

export default async function ProductionPage({ params }: ProductionPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale);

  const highlights = [
    { icon: ShieldIcon, title: dict.production.qualityTitle, text: dict.production.qualityText },
    { icon: LabIcon, title: dict.production.labTitle, text: dict.production.labText },
    { icon: PackageIcon, title: dict.production.packagingTitle, text: dict.production.packagingText },
  ];

  return (
    <>
      <section className="py-12 md:py-16 bg-surface border-b border-border">
        <Container>
          <Reveal>
            <span className="inline-flex px-3.5 py-1.5 rounded-full bg-primary-soft text-primary text-xs sm:text-sm font-semibold mb-4">
              {dict.nav.production}
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
              {dict.production.title}
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-muted">{dict.production.hero}</p>
          </Reveal>
        </Container>
      </section>

      {/* Production Process with Light Green background */}
      <section className="py-14 sm:py-20 bg-surface-soft/70 transition-colors duration-200">
        <Container>
          <SectionHeading
            title={dict.production.processTitle}
            subtitle={dict.production.processSubtitle}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
            {dict.production.processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80} className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center gap-3 p-6 rounded-[20px] border border-border bg-surface text-center h-full w-full shadow-xs">
                  <span className="inline-flex items-center justify-center size-12 rounded-xl bg-primary-soft text-primary font-display font-bold text-lg">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-sans font-semibold text-base text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
            {highlights.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <div className="flex flex-col items-start gap-3 p-6 sm:p-7 rounded-[20px] border border-border bg-surface shadow-xs h-full">
                  <span
                    className="inline-flex items-center justify-center size-12 rounded-xl bg-primary-soft text-primary"
                    aria-hidden="true"
                  >
                    <item.icon width={26} height={26} />
                  </span>
                  <h3 className="font-sans font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-surface border border-border text-primary text-sm mt-10 shadow-xs">
            <DropletIcon width={18} height={18} className="shrink-0 mt-0.5" />
            <p>{dict.production.note}</p>
          </div>
        </Container>
      </section>

      {/* Production Nature Gallery Feature */}
      <section className="py-14 sm:py-18 bg-background">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Reveal>
              <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden border border-border shadow-md">
                <Image
                  src="/images/nature/photo_2026-08-20_02-36-40.jpg"
                  alt={dict.production.natureImageAlt}
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {dict.production.natureBandEyebrow}
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                  {dict.production.natureBandTitle}
                </h2>
                <p className="text-muted leading-relaxed">
                  {dict.production.natureBandText}
                </p>
                <div className="pt-2">
                  <LocalizedLink
                    href="/products"
                    locale={locale}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-sm bg-primary text-white hover:bg-primary-dark shadow-xs transition-colors"
                  >
                    {dict.home.viewAll}
                  </LocalizedLink>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-16 bg-background">
        <Container>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-12 text-center text-white shadow-md">
            <div className="flex flex-col items-center gap-4 max-w-xl mx-auto">
              <h2 className="font-display font-bold text-white text-2xl sm:text-3xl">
                {dict.production.ctaTitle}
              </h2>
              <p className="text-white/85 text-base">{dict.production.ctaText}</p>
              <LocalizedLink
                href="/products"
                locale={locale}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-bold text-base bg-action-red text-white hover:bg-action-red-dark shadow-md transition-colors mt-2"
              >
                {dict.production.ctaButton}
              </LocalizedLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}