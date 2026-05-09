import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { prisma } from "@/lib/prisma"
import type { AdhesionWithRelations } from "./_types/adhesion-with-relations.type"
import { AdhesionsBoard } from "./_components/adhesions-board"

export const metadata: Metadata = { title: "Adhésions" }

async function getAdhesions(): Promise<AdhesionWithRelations[]> {
  return prisma.memberShip.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      person: true,
      payment: true,
    },
  })
}

export default async function AdhesionsPage() {
  const adhesions = await getAdhesions()

  return (
    <BureauContent
      title="Adhésions"
      description={`${adhesions.length} adhésion${adhesions.length > 1 ? "s" : ""} enregistrée${adhesions.length > 1 ? "s" : ""}`}
    >
      <AdhesionsBoard adhesions={adhesions} />
    </BureauContent>
  )
}
