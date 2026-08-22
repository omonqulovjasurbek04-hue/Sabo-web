import Link from "next/link";
import { Home, Package } from "lucide-react";

import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function RootNotFound() {
  const dict = getDictionary("uz");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <CartProvider>
        <Navbar dict={dict} locale="uz" />
        <main id="main-content" className="flex-1 flex items-center justify-center py-20 lg:py-28">
          <Container>
            <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
              {/* 404 Graphic Badge */}
              <div className="relative mb-6">
                <div className="text-8xl sm:text-9xl lg:text-[11rem] font-black tracking-tight text-primary/15 select-none font-display">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-extrabold text-sm sm:text-base uppercase tracking-widest shadow-xs">
                    Xatolik 404
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight font-display mb-4">
                Bunday sahifa mavjud emas
              </h1>
              <p className="text-muted text-base sm:text-lg max-w-lg mb-8 leading-relaxed font-medium">
                Siz tashrif buyurmoqchi bo&apos;lgan sahifa manzili noto&apos;g&apos;ri kiritilgan, o&apos;chirilgan yoki nomi o&apos;zgartirilgan bo&apos;lishi mumkin.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/uz"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm sm:text-base shadow-md hover:bg-primary-dark transition-all"
                >
                  <Home className="size-4" />
                  <span>Bosh sahifaga qaytish</span>
                </Link>

                <Link
                  href="/uz/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-surface border border-border text-foreground font-bold text-sm sm:text-base shadow-xs hover:border-primary hover:text-primary transition-all"
                >
                  <Package className="size-4" />
                  <span>Mahsulotlar katalogi</span>
                </Link>
              </div>
            </div>
          </Container>
        </main>
        <Footer dict={dict} locale="uz" />
      </CartProvider>
    </div>
  );
}
