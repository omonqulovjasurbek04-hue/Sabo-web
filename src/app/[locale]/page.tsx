import type { Metadata } from "next";

import { CategoriesSection } from "@/components/sections/categories";
import { CtaSection } from "@/components/sections/cta";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { GallerySection } from "@/components/sections/gallery-section";
import { Hero } from "@/components/sections/hero";
import { NatureSection } from "@/components/sections/nature";
import { PreviewBand } from "@/components/sections/preview-band";
import { TrustSection } from "@/components/sections/trust";
import { Container } from "@/components/ui/container";
import {
  DocumentIcon,
  FactoryIcon,
  ShieldIcon,
} from "@/components/ui/icons";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return generatePageMetadata({ locale, path: "/" });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;

  const dict = getDictionary(locale);

  return (
    <>
      <Hero dict={dict} locale={locale} />
      <CategoriesSection dict={dict} locale={locale} />
      <FeaturedProducts dict={dict} locale={locale} />
      <NatureSection dict={dict} />
      <GallerySection locale={locale} />

      <section className="py-14 sm:py-18">
        <Container>
          <PreviewBand
            icon={<FactoryIcon width={56} height={56} />}
            eyebrow={dict.nav.production}
            title={dict.home.productionTitle}
            text={dict.home.productionText}
            ctaLabel={dict.home.productionCta}
            href="/production"
            locale={locale}
          />
          <PreviewBand
            icon={<ShieldIcon width={56} height={56} />}
            eyebrow={dict.nav.about}
            title={dict.home.aboutTitle}
            text={dict.home.aboutText}
            ctaLabel={dict.home.aboutCta}
            href="/about"
            locale={locale}
            reverse
          />
          <PreviewBand
            icon={<DocumentIcon width={56} height={56} />}
            eyebrow={dict.nav.certificates}
            title={dict.home.certTitle}
            text={dict.home.certText}
            ctaLabel={dict.home.certCta}
            href="/certificates"
            locale={locale}
          />
        </Container>
      </section>

      <TrustSection dict={dict} />
      <CtaSection dict={dict} locale={locale} />
    </>
  );
}