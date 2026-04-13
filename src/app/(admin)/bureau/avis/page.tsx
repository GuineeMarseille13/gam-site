import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { AvisList } from "./_components/avis-list"

export const metadata: Metadata = {
  title: "Avis",
  description: "Témoignages affichés sur la page d’accueil",
}

async function listAvis() {
  return prisma.review.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { role: { select: { labelFr: true, code: true } } },
  })
}

export default async function AvisBureauPage() {
  const rows = await listAvis()

  return (
    <BureauDataPage
      title="Avis"
      description={`${rows.length} témoignage${rows.length > 1 ? "s" : ""} — section d’accueil`}
      addHref="/bureau/avis/nouveau"
      addLabel="Nouvel avis"
    >
      <AvisList rows={rows} />
    </BureauDataPage>
  )
}
