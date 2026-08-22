import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale: string }>;
}) {
  const resolved: { locale?: string } = (await params) ?? {};
  const locale = isLocale(resolved.locale) ? resolved.locale : "uz";
  const dict = getDictionary(locale);

  return (
    <section className="py-20 text-center">
      <Container>
        <div className="flex flex-col items-center gap-4">
          <span className="font-display text-7xl sm:text-8xl lg:text-9xl font-bold leading-none text-primary">
            404
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground">
            {dict.common.notFoundTitle}
          </h1>
          <p className="text-muted max-w-md">{dict.common.notFoundText}</p>
          <LinkButton href="/" locale={locale} size="lg" className="mt-4">
            {dict.common.goHome}
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}