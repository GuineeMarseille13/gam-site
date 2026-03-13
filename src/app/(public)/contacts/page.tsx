import ContactsView from "./_components/contacts-view";

export const metadata = {
  title: "Contact",
  description: "Contactez l'association GAM pour toute question ou information.",
};

export default async function ContactsPage() {
  return (
    <section className="py-6">
      <ContactsView />
    </section>
  );
}

