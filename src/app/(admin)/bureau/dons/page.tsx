import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { formatCurrency } from "@/helpers/format-currency"
import type { DonWithRelations } from "./_types/don-with-relations.type"
import { DonsBoard } from "./_components/dons-board"

export const metadata: Metadata = { title: "Dons" }

async function getDons(): Promise<DonWithRelations[]> {
  return prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
    include: { person: true, payment: true },
  })
}

export default async function DonsPage() {
  const dons = await getDons()

  const totalDons = dons.reduce((sum, d) => sum + d.amount, 0)

  return (
    <BureauContent
      title="Dons"
      description={`${dons.length} don${dons.length > 1 ? "s" : ""} — ${formatCurrency(totalDons, { maximumFractionDigits: 0 })} collectés au total`}
    >
      <DonsBoard dons={dons} />
    </BureauContent>
  )
}
