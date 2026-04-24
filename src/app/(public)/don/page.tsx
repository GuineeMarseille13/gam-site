import DonationView from "./_components/don-view";

export const metadata = {
  title: "Faire un don",
  description: "Faites un don à notre association et soutenez nos actions pour la communauté.",
};

export default async function DonPage() {
  return (
    <section className="py-6">
      <DonationView />
    </section>
  );
}
