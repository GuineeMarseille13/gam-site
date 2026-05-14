import { prisma } from "@/lib/prisma"
import ContactsView from "./_components/contacts-view"

export const metadata = {
  title: "Contact",
  description: "Contactez l'association GAM pour toute question ou information.",
}

export default async function ContactsPage() {
  const [contact, socialMedias] = await Promise.all([
    prisma.contact.findFirst(),
    prisma.socialMedia.findMany({ orderBy: { order: "asc" } }),
  ])

  return (
    <section className="flex w-full min-w-0 justify-center">
      <ContactsView contact={contact} socialMedias={socialMedias} />
    </section>
  )
}
