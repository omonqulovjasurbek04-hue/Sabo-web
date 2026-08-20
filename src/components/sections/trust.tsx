import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { HandshakeIcon, LeafIcon, ShieldIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";

const trustIcons = [ShieldIcon, LeafIcon, HandshakeIcon];

export function TrustSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="py-14 sm:py-18">
      <Container>
        <SectionHeading
          title={dict.home.trustTitle}
          subtitle={dict.home.trustSubtitle}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {dict.home.trustItems.map((item, index) => {
            const Icon = trustIcons[index % trustIcons.length];
            return (
              <Reveal key={item.title} delay={index * 80}>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-surface shadow-xs h-full">
                  <span
                    className="inline-flex items-center justify-center size-14 rounded-2xl bg-accent-soft text-accent mb-5"
                    aria-hidden="true"
                  >
                    <Icon width={28} height={28} />
                  </span>
                  <h3 className="font-sans font-semibold text-lg text-foreground mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}