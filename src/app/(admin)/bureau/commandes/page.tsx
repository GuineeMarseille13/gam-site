import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { formatCurrency } from "@/helpers/format-currency"
import type { OrderWithRelations } from "./_types/order-with-relations.type"
import { CommandesBoard } from "./_components/commandes-board"

export const metadata: Metadata = { title: "Commandes" }

async function getCommandes(): Promise<OrderWithRelations[]> {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      person: true,
      payment: true,
      items: { include: { product: true } },
    },
  })
}

export default async function CommandesPage() {
  const commandes = await getCommandes()

  const totalCA = commandes.reduce((sum, c) => sum + c.totalAmount, 0)

  return (
    <BureauContent
      title="Commandes"
      description={`${commandes.length} commande${commandes.length > 1 ? "s" : ""} · ${formatCurrency(totalCA, { unit: "cent", maximumFractionDigits: 0 })} de chiffre d'affaires`}
    >
      <CommandesBoard commandes={commandes} />
    </BureauContent>
  )
}
