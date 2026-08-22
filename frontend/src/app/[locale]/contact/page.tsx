import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/ui/icons";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/locales";
import { generatePageMetadata } from "@/lib/seo";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return generatePageMetadata({
    locale,
    path: "/contact",
    title: dict.contact.title,
    description: dict.contact.subtitle,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const dict = getDictionary(locale);

  const infoItems = [
    { icon: PhoneIcon, label: dict.contact.phone },
    { icon: MailIcon, label: dict.contact.email },
    { icon: MapPinIcon, label: dict.contact.address },
    { icon: ClockIcon, label: dict.contact.hours },
  ];

  return (
    <>
      <section className="py-12 md:py-16 bg-surface border-b border-border">
        <Container>
          <Reveal>
            <span className="inline-flex px-3.5 py-1.5 rounded-full bg-secondary-soft text-secondary text-xs sm:text-sm font-semibold mb-4">
              {dict.nav.contact}
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
              {dict.contact.title}
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-muted">{dict.contact.subtitle}</p>
          </Reveal>
        </Container>
      </section>

      <section className="py-14 sm:py-18">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16">
            <div className="flex flex-col gap-6">
              <h2 className="font-sans font-bold text-2xl text-foreground">{dict.contact.infoTitle}</h2>

              <ul className="list-none p-0 flex flex-col gap-4">
                {infoItems.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-4 p-5 rounded-xl border border-border bg-surface shadow-xs"
                  >
                    <span
                      className="inline-flex items-center justify-center size-11 rounded-xl bg-secondary-soft text-secondary shrink-0"
                      aria-hidden="true"
                    >
                      <item.icon width={20} height={20} />
                    </span>
                    <div>
                      <h3 className="font-sans font-semibold text-base text-foreground mb-0.5">
                        {item.label}
                      </h3>
                      <p className="text-sm text-muted">{dict.contact.infoNote}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="flex items-start gap-3 p-4 sm:p-5 rounded-xl bg-surface-soft text-secondary text-sm">
                {dict.contact.infoNote}
              </p>
            </div>

            <Reveal>
              <div className="flex flex-col gap-4">
                <h2 className="font-sans font-bold text-2xl text-foreground">{dict.contact.formTitle}</h2>
                <ContactForm dict={dict} />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}