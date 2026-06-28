import { Suspense } from "react";
import { ShopView } from "./_components/boutique-view";

export default async function BoutiquePage() {
  return (
    <section className="py-6">
      <Suspense fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full min-w-0 max-w-lg space-y-4 text-center">
            <div className="mx-auto h-14 w-[min(100%,20rem)] animate-pulse rounded-2xl border border-amber-500/30 bg-muted sm:h-16 sm:w-96" />
            <div className="mx-auto h-[2px] w-40 animate-pulse rounded-full bg-muted" />
            <div className="mx-auto h-5 w-[min(100%,20rem)] animate-pulse rounded bg-muted sm:w-96" />
          </div>
        </div>
      }>
        <ShopView />
      </Suspense>
    </section>
  );
}
