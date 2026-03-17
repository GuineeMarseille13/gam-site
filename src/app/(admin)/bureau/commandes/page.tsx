import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = { title: "Commandes" }

async function getCommandes() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      person: true,
      payment: true,
      items: { include: { product: true } },
    },
  })
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100)
}

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase()
}

function avatarColor(name: string) {
  const c = ["bg-blue-100 text-blue-700","bg-amber-100 text-amber-700","bg-violet-100 text-violet-700","bg-emerald-100 text-emerald-700","bg-rose-100 text-rose-700"]
  return c[name.charCodeAt(0) % c.length]
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: "Payée", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  PENDING: { label: "En attente", className: "bg-amber-100 text-amber-700 border-amber-200" },
  FAILED: { label: "Échouée", className: "bg-red-100 text-red-700 border-red-200" },
  CANCELLED: { label: "Annulée", className: "bg-gray-100 text-gray-600 border-gray-200" },
  REFUNDED: { label: "Remboursée", className: "bg-blue-100 text-blue-700 border-blue-200" },
}

export default async function CommandesPage() {
  const commandes = await getCommandes()

  const totalCA = commandes.reduce((sum, c) => sum + c.totalAmount, 0)

  return (
    <BureauDataPage
      title="Commandes"
      description={`${commandes.length} commande${commandes.length > 1 ? "s" : ""} · ${formatCurrency(totalCA)} de chiffre d'affaires`}
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="pr-6">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commandes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Aucune commande enregistrée
                  </TableCell>
                </TableRow>
              ) : (
                commandes.map((commande) => (
                  <TableRow key={commande.id}>
                    <TableCell className="pl-6 font-mono text-xs">
                      {commande.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(commande.person.firstName)}`}>
                          {getInitials(commande.person.firstName, commande.person.lastName)}
                        </div>
                        <span className="font-medium text-sm">{commande.person.firstName} {commande.person.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {commande.items.length} article{commande.items.length > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(commande.totalAmount)}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const s = statusConfig[commande.payment?.status ?? ""]
                        return (
                          <Badge variant="outline" className={`text-xs ${s?.className ?? "bg-gray-100 text-gray-500"}`}>
                            {s?.label ?? "—"}
                          </Badge>
                        )
                      })()}
                    </TableCell>
                    <TableCell className="pr-6 text-muted-foreground">
                      {formatDate(commande.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
