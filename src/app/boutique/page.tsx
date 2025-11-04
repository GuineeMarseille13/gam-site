import { BoutiqueView } from "./_components/boutique-view";

export const metadata = {
  title: "Boutique",
  description: "Découvrez les articles en vente et soutenez l'association.",
};

export default async function BoutiquePage() {
  return (
    <section className="py-6">
      <BoutiqueView />
    </section>
  );
}
