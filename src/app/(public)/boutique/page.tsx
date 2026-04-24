import { Suspense } from "react";
import { ShopView } from "./_components/boutique-view";

export const metadata = {
  title: "Boutique",
  description: "Découvrez les articles en vente et soutenez l'association.",
};

export default async function BoutiquePage() {
  return (
    <section className="py-6">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
        </div>
      }>
        <ShopView />
      </Suspense>
    </section>
  );
}
