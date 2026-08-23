import type { Metadata } from "next";

import { CertificatesGrid } from "@/components/certificates/certificates-grid";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface CertificatesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CertificatesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/certificates",
    title: dict.certificates.title,
    description: dict.certificates.subtitle,
  });
}

export default async function CertificatesPage({
  params,
}: CertificatesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale);

  return (
    <>
      <section className="py-12 md:py-16 bg-surface border-b border-border">
        <Container>
          <Reveal>
            <span className="inline-flex px-3.5 py-1.5 rounded-full bg-secondary-soft text-secondary text-xs sm:text-sm font-semibold mb-4">
              {dict.nav.certificates}
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
              {dict.certificates.title}
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-muted">{dict.certificates.subtitle}</p>
          </Reveal>
        </Container>
      </section>

      <section className="py-14 sm:py-18">
        <Container>
          <Reveal>
            <CertificatesGrid locale={locale} />
          </Reveal>

          <div className="flex items-start gap-3 p-5 rounded-2xl bg-surface-soft text-secondary text-sm mt-12 border border-secondary/20 shadow-xs">
            <p>{dict.certificates.note}</p>
          </div>
        </Container>
      </section>
    </>
  );
}