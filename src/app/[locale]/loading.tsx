import { Container } from "@/components/ui/container";
import { ProductGridSkeleton } from "@/components/product/product-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="py-14 sm:py-18">
      <Container>
        <Skeleton className="mb-4 h-10 w-64 rounded-xl" />
        <Skeleton className="mb-8 h-5 w-96 max-w-full rounded-lg" />
        <ProductGridSkeleton count={6} />
      </Container>
    </section>
  );
}