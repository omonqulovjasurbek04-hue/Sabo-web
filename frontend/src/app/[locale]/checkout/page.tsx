import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/checkout",
    title: dict.checkout.title,
    description: dict.checkout.subtitle,
  });
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading
          title={dict.checkout.title}
          subtitle={dict.checkout.subtitle}
          align="left"
          as="h1"
        />
        <CheckoutForm dict={dict} locale={locale} />
      </Container>
    </section>
  );
}