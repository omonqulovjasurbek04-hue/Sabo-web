import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { HandshakeIcon, LeafIcon, RocketIcon, ShieldIcon } from "@/components/ui/icons";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/about",
    title: dict.about.title,
    description: dict.about.subtitle,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale);

  const valueIcons = [ShieldIcon, HandshakeIcon, RocketIcon];

  return (
    <>
      <section className="py-12 md:py-16 bg-surface border-b border-border">
        <Container>
          <Reveal>
            <span className="inline-flex px-3.5 py-1.5 rounded-full bg-primary-soft text-primary text-xs sm:text-sm font-semibold mb-4">
              {dict.nav.about}
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
              {dict.about.title}
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-muted">{dict.about.subtitle}</p>
          </Reveal>
        </Container>
      </section>

      <section className="py-14 sm:py-20 bg-background">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
            <Reveal>
              <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden border border-border shadow-md">
                <Image
                  src="/images/nature/photo_2026-08-20_02-36-51.jpg"
                  alt={dict.about.storyImageAlt}
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>

            <div className="flex flex-col gap-6">
              <Reveal>
                <div className="flex flex-col gap-3 p-8 rounded-[20px] border border-border bg-surface shadow-xs">
                  <span
                    className="inline-flex items-center justify-center size-12 rounded-xl bg-primary-soft text-primary"
                    aria-hidden="true"
                  >
                    <LeafIcon width={24} height={24} />
                  </span>
                  <h2 className="font-display font-bold text-2xl text-foreground">{dict.about.storyTitle}</h2>
                  <p className="text-base text-muted leading-relaxed">{dict.about.storyText}</p>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="flex flex-col gap-3 p-8 rounded-[20px] border border-border bg-surface shadow-xs">
                  <span
                    className="inline-flex items-center justify-center size-12 rounded-xl bg-primary-soft text-primary"
                    aria-hidden="true"
                  >
                    <RocketIcon width={24} height={24} />
                  </span>
                  <h2 className="font-display font-bold text-2xl text-foreground">{dict.about.missionTitle}</h2>
                  <p className="text-base text-muted leading-relaxed">{dict.about.missionText}</p>
                </div>
              </Reveal>
            </div>
          </div>

          <SectionHeading
            title={dict.about.valuesTitle}
            className="mt-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {dict.about.values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <Reveal key={value.title} delay={index * 80}>
                  <div className="flex flex-col items-start gap-3 p-7 rounded-[20px] border border-border bg-surface shadow-xs h-full">
                    <span
                      className="inline-flex items-center justify-center size-12 rounded-xl bg-primary-soft text-primary"
                      aria-hidden="true"
                    >
                      <Icon width={26} height={26} />
                    </span>
                    <h3 className="font-sans font-semibold text-lg text-foreground">{value.title}</h3>
                    <p className="text-sm sm:text-base text-muted leading-relaxed">{value.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-8">
            <Reveal>
              <div className="flex flex-col items-start gap-3 p-7 rounded-[20px] border border-border bg-surface shadow-xs">
                <span
                  className="inline-flex items-center justify-center size-12 rounded-xl bg-primary-soft text-primary"
                  aria-hidden="true"
                >
                  <ShieldIcon width={26} height={26} />
                </span>
                <h3 className="font-sans font-semibold text-lg text-foreground">{dict.about.qualityTitle}</h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed">{dict.about.qualityText}</p>
              </div>
            </Reveal>
          </div>

          <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-surface border border-border text-primary text-sm mt-8 shadow-xs">
            <p>{dict.about.note}</p>
          </div>
        </Container>
      </section>
    </>
  );
}