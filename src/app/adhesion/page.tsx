import AdhesionView from "./_components/adhesion-view";

export const metadata = {
  title: "Adhésion",
  description: "Adhérez à notre association (10€ / personne) et soutenez nos actions.",
};

export default async function AdhesionPage() {
  return (
    <section className="py-6">
      <AdhesionView />
    </section>
  );
}
