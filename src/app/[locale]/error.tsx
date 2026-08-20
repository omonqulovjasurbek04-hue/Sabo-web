"use client";

import { ErrorState } from "@/components/ui/error-state";
import { Container } from "@/components/ui/container";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="py-20">
      <Container>
        <ErrorState
          title="Ma'lumotni yuklashda xatolik yuz berdi"
          text="Iltimos, qayta urinib ko'ring."
          onRetry={reset}
          retryLabel="Qayta urinish"
        />
      </Container>
    </section>
  );
}