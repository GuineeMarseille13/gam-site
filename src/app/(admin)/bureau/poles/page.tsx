import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { PolesList } from "./_components/poles-list"

export const metadata: Metadata = { title: "Pôles" }

async function getPoles() {
  return prisma.pole.findMany({ orderBy: { createdAt: "desc" } })
}

export default async function PolesPage() {
  const poles = await getPoles()

  return (
    <BureauContent
      title="Pôles"
      description={`${poles.length} pôle${poles.length > 1 ? "s" : ""} d'activité`}
      addHref="/bureau/poles/nouveau"
      addLabel="Nouveau pôle"
    >
      <PolesList poles={poles} />
    </BureauContent>
  )
}
