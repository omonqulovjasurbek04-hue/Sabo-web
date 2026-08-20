import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/lib/i18n/locales";

interface GallerySectionProps {
  locale: Locale;
}

const GALLERY_IMAGES = [
  {
    src: "/images/nature/photo_2026-08-20_02-35-47.jpg",
    title: { uz: "Tog' yaylovlari", ru: "Горные пастбища", en: "Mountain Pastures" },
    tag: { uz: "Tabiat", ru: "Природа", en: "Nature" },
    span: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    src: "/images/nature/photo_2026-08-20_02-36-37.jpg",
    title: { uz: "Toza havo va tabiat", ru: "Чистый воздух и природа", en: "Pure Alpine Air" },
    tag: { uz: "Tozalik", ru: "Чистота", en: "Purity" },
    span: "col-span-1",
  },
  {
    src: "/images/nature/photo_2026-08-20_02-36-40.jpg",
    title: { uz: "Yashil kengliklar", ru: "Зеленые просторы", en: "Green Expanses" },
    tag: { uz: "Yaylov", ru: "Пастбище", en: "Pasture" },
    span: "col-span-1",
  },
  {
    src: "/images/nature/photo_2026-08-20_02-38-16.jpg",
    title: { uz: "Tabiiy manba", ru: "Природный источник", en: "Natural Source" },
    tag: { uz: "Sut", ru: "Молоко", en: "Milk" },
    span: "col-span-1",
  },
  {
    src: "/images/nature/photo_2026-08-20_02-38-28.jpg",
    title: { uz: "Ekologik toza muhit", ru: "Экологически чистая среда", en: "Eco Environment" },
    tag: { uz: "Sifat", ru: "Качество", en: "Quality" },
    span: "col-span-1",
  },
];

export function GallerySection({ locale }: GallerySectionProps) {
  const titles = {
    uz: {
      eyebrow: "Fotogalereya",
      title: "Tabiat Qo'ynidan Lavhalar",
      subtitle: "SABO mahsulotlari tayyorlanadigan tabiiy yaylovlar va toza tog' etaklari.",
    },
    ru: {
      eyebrow: "Фотогалерея",
      title: "Кадры из лона природы",
      subtitle: "Природные пастбища и экологически чистые предгорья, где рождается продукция SABO.",
    },
    en: {
      eyebrow: "Photo Gallery",
      title: "Moments from Pure Nature",
      subtitle: "Pristine mountain pastures and foothills where SABO dairy begins.",
    },
  };

  const t = titles[locale] || titles.uz;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <Reveal>
            <span className="inline-flex px-3.5 py-1.5 rounded-full bg-primary-soft text-primary text-xs sm:text-sm font-semibold mb-3">
              {t.eyebrow}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-3">
              {t.title}
            </h2>
            <p className="text-muted text-base sm:text-lg">{t.subtitle}</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          {GALLERY_IMAGES.map((img, index) => (
            <Reveal
              key={img.src}
              delay={index * 70}
              className={`relative rounded-3xl overflow-hidden group border border-border shadow-xs ${img.span}`}
            >
              <div className="relative size-full min-h-[220px]">
                <Image
                  src={img.src}
                  alt={img.title[locale] || img.title.uz}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 text-white">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                      {img.tag[locale] || img.tag.uz}
                    </span>
                    <h3 className="font-display font-semibold text-base sm:text-lg text-white">
                      {img.title[locale] || img.title.uz}
                    </h3>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
