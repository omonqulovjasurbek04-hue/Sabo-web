import Image from "next/image";

import { MilkDropAnimation } from "@/components/3d/milk-drop-animation";
import { ParallaxNature } from "@/components/3d/parallax-nature";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { LeafIcon, ShieldIcon, DropletIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/lib/i18n/dictionary";

interface NatureSectionProps {
  dict: Dictionary;
}

const PILLAR_ICONS = [LeafIcon, DropletIcon, ShieldIcon];

export function NatureSection({ dict }: NatureSectionProps) {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden transition-colors duration-200">
      <Container>
        <div className="relative rounded-[28px] overflow-hidden border border-border shadow-md">
          <ParallaxNature className="absolute inset-0" speed={0.05}>
            <Image
              src="/images/nature/photo_2026-08-20_02-36-37.jpg"
              alt={dict.home.natureImageAlt}
              fill
              className="object-cover scale-[1.06]"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </ParallaxNature>
          <div className="absolute inset-0 bg-gradient-to-br from-surface/95 via-surface/85 to-surface/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative flex flex-col items-start gap-8 p-6 sm:p-10 lg:p-14 max-w-2xl">
            <Reveal>
              <span className="flex items-center gap-3">
                <MilkDropAnimation className="size-10" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">
                  {dict.home.natureEyebrow}
                </span>
              </span>
              <h2 className="font-display font-bold text-foreground mt-3 mb-4">
                {dict.home.natureTitle}
              </h2>
              <p className="text-muted text-base sm:text-lg leading-relaxed">
                {dict.home.natureText}
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {dict.home.naturePillars.map((item, index) => {
                const Icon = PILLAR_ICONS[index] ?? LeafIcon;
                return (
                  <Reveal key={item.title} delay={index * 60}>
                    <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border/60 shadow-xs h-full">
                      <span className="inline-flex items-center justify-center size-10 rounded-xl bg-primary-soft text-primary">
                        <Icon width={20} height={20} />
                      </span>
                      <h3 className="font-display font-semibold text-sm sm:text-base text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted leading-relaxed">{item.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}