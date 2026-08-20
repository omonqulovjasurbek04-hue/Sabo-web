import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/blog",
    title: dict.blog.title,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <Reveal>
          <EmptyState
            title={dict.blog.noArticle}
            hint={dict.blog.comingSoon}
            actionHref="/blog"
            actionLabel={dict.nav.blog}
            locale={locale}
          />
        </Reveal>
      </Container>
    </section>
  );
}