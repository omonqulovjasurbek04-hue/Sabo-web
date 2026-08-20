import type { Metadata } from "next";

import { CartClient } from "@/components/cart/cart-client";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CartPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/cart",
    title: dict.cart.title,
  });
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading title={dict.cart.title} align="left" as="h1" />
        <CartClient dict={dict} locale={locale} />
      </Container>
    </section>
  );
}