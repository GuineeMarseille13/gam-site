import { Suspense } from "react";
import { ShopView } from "./_components/boutique-view";
import { BoutiqueSkeleton } from "@/components/skeletons";

export default async function BoutiquePage() {
  return (
    <section className="py-6">
      <Suspense fallback={<BoutiqueSkeleton />}>
        <ShopView />
      </Suspense>
    </section>
  );
}
