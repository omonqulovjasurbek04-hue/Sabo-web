import Image from "next/image";

import { LocalizedLink } from "@/components/layout/localized-link";
import { Container } from "@/components/ui/container";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TelegramIcon,
} from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const links: Array<{ href: string; label: string }> = [
    { href: "/products", label: dict.nav.products },
    { href: "/production", label: dict.nav.production },
    { href: "/about", label: dict.nav.about },
    { href: "/certificates", label: dict.nav.certificates },
    { href: "/contact", label: dict.nav.contact },
    { href: "/account", label: dict.account.title },
  ];

  const contactItems = [
    { icon: PhoneIcon, label: dict.contact.phone, value: null },
    { icon: MailIcon, label: dict.contact.email, value: null },
    { icon: MapPinIcon, label: dict.contact.address, value: null },
    { icon: ClockIcon, label: dict.contact.hours, value: null },
  ];

  const socials = [TelegramIcon, InstagramIcon, FacebookIcon];

  return (
    <footer className="border-t border-border bg-surface mt-auto transition-colors duration-200">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 py-14">
          <div className="flex flex-col">
            <span className="inline-flex items-center">
              <Image
                src="/images/logo.png"
                alt="SABO"
                width={1230}
                height={678}
                className="w-auto h-10 object-contain"
              />
            </span>
            <p className="mt-4 text-sm sm:text-base text-muted max-w-xs">{dict.footer.description}</p>
            <div className="flex gap-2 mt-5">
              {socials.map((Icon, index) => (
                <span
                  key={index}
                  className="inline-flex items-center justify-center size-10 rounded-full border border-border bg-surface text-muted hover:border-secondary hover:text-secondary hover:bg-secondary-soft transition-colors cursor-pointer"
                  aria-hidden="true"
                  title={dict.contact.infoNote}
                >
                  <Icon width={18} height={18} />
                </span>
              ))}
            </div>
          </div>

          <nav className="flex flex-col" aria-label={dict.footer.navTitle}>
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground mb-4">
              {dict.footer.navTitle}
            </h4>
            <ul className="list-none p-0 flex flex-col gap-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    locale={locale}
                    className="text-muted text-[15px] hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col">
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground mb-4">
              {dict.footer.contactTitle}
            </h4>
            <ul className="list-none p-0 flex flex-col gap-2.5">
              {contactItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-muted text-sm leading-normal">
                  <item.icon width={16} height={16} className="mt-0.5 shrink-0 text-secondary" />
                  <span>
                    {item.label}:{" "}
                    <span className="text-muted opacity-85">{dict.contact.infoNote}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-5 border-t border-border text-center text-xs sm:text-sm text-muted">
          <p>
            © {new Date().getFullYear()} SABO. {dict.footer.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}