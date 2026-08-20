import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface OrdersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: OrdersPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/account/orders",
    title: dict.account.orders,
  });
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <Reveal>
          <EmptyState
            title={dict.account.ordersEmpty}
            hint={dict.account.ordersEmptyHint}
            actionHref="/products"
            actionLabel={dict.home.viewAll}
            locale={locale}
          />
        </Reveal>
      </Container>
    </section>
  );
}