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
        <main
          id="main-content"
          className="flex-1 relative flex items-center justify-center py-20 sm:py-28 lg:py-36 overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/image-060.jpg')",
          }}
        >
          {/* Blurred Atmospheric Background Overlay */}
          <div className="absolute inset-0 bg-background/85 dark:bg-black/85 backdrop-blur-md pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60 pointer-events-none" />

          <Container className="relative z-10">
            <div className="max-w-2xl mx-auto text-center flex flex-col items-center p-8 sm:p-12 rounded-3xl bg-surface/85 dark:bg-black/60 backdrop-blur-xl border border-border/80 shadow-2xl">
              {/* 404 Number */}
              <div className="mb-3">
                <div className="text-8xl sm:text-9xl lg:text-[10rem] font-black tracking-tight text-primary font-display leading-none drop-shadow-sm select-none">
                  404
                </div>
              </div>

              {/* Title & Description */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight font-display mb-3">
                Bunday sahifa mavjud emas
              </h1>
              <p className="text-muted text-sm sm:text-base max-w-md mb-8 leading-relaxed font-medium">
                Siz tashrif buyurmoqchi bo&apos;lgan sahifa manzili noto&apos;g&apos;ri kiritilgan, o&apos;chirilgan yoki nomi o&apos;zgartirilgan bo&apos;lishi mumkin.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href="/uz"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-dark transition-all cursor-pointer"
                >
                  <Home className="size-4" />
                  <span>Bosh sahifaga qaytish</span>
                </Link>

                <Link
                  href="/uz/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-surface/90 border border-border text-foreground font-bold text-sm shadow-xs hover:border-primary hover:text-primary transition-all cursor-pointer"
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
