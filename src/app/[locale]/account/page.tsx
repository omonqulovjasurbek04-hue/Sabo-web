import type { Metadata } from "next";

import { LocalizedLink } from "@/components/layout/localized-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface AccountPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AccountPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/account",
    title: dict.account.title,
  });
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading title={dict.account.title} align="left" as="h1" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4 p-6 sm:p-7 rounded-2xl border border-border bg-surface shadow-xs">
            <h2 className="font-sans font-bold text-lg text-foreground">{dict.account.profile}</h2>
            <div className="flex justify-between gap-4 text-sm pb-2.5 border-b border-border">
              <span className="text-muted">{dict.contact.name}</span>
              <span className="font-semibold text-foreground">—</span>
            </div>
            <div className="flex justify-between gap-4 text-sm pb-2.5 border-b border-border">
              <span className="text-muted">{dict.contact.phone}</span>
              <span className="font-semibold text-foreground">—</span>
            </div>
            <div className="flex justify-between gap-4 text-sm pb-2.5 border-b border-border">
              <span className="text-muted">{dict.contact.email}</span>
              <span className="font-semibold text-foreground">—</span>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-soft text-secondary text-sm">
              <p>{dict.account.profileNote}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 sm:p-7 rounded-2xl border border-border bg-surface shadow-xs">
            <h2 className="font-sans font-bold text-lg text-foreground">{dict.account.orders}</h2>
            <p className="text-muted text-sm sm:text-base">{dict.account.ordersEmpty}</p>
            <p className="text-muted text-sm">{dict.account.ordersEmptyHint}</p>
            <LocalizedLink
              href="/account/orders"
              locale={locale}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-sm border border-border-strong bg-surface text-foreground hover:border-secondary hover:text-secondary transition-colors w-fit mt-auto"
            >
              {dict.account.orders}
            </LocalizedLink>
          </div>
        </div>
      </Container>
    </section>
  );
}