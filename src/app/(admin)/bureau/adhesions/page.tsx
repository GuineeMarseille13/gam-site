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

export const metadata: Metadata = { title: "Adhésions" }

async function getAdhesions() {
  return prisma.memberShip.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      person: true,
      payment: true,
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
  const c = ["bg-amber-100 text-amber-700","bg-blue-100 text-blue-700","bg-emerald-100 text-emerald-700","bg-violet-100 text-violet-700","bg-rose-100 text-rose-700"]
  return c[name.charCodeAt(0) % c.length]
}

export default async function AdhesionsPage() {
  const adhesions = await getAdhesions()

  return (
    <BureauDataPage
      title="Adhésions"
      description={`${adhesions.length} adhésion${adhesions.length > 1 ? "s" : ""} enregistrée${adhesions.length > 1 ? "s" : ""}`}
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Adhérent</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="pr-6">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adhesions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Aucune adhésion enregistrée
                  </TableCell>
                </TableRow>
              ) : (
                adhesions.map((adhesion) => (
                  <TableRow key={adhesion.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        {adhesion.person && (
                          <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(adhesion.person.firstName)}`}>
                            {getInitials(adhesion.person.firstName, adhesion.person.lastName)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-sm">
                            {adhesion.person ? `${adhesion.person.firstName} ${adhesion.person.lastName}` : "—"}
                          </div>
                          {adhesion.person?.email && (
                            <div className="text-xs text-muted-foreground">{adhesion.person.email}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{adhesion.year}</TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(adhesion.amount)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {adhesion.payment?.paymentReference?.slice(0, 20)}…
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          adhesion.isActive
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }
                      >
                        {adhesion.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-muted-foreground">
                      {formatDate(adhesion.createdAt)}
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
