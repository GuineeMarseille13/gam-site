import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Payment, Person } from "@/lib/generated/prisma/client"
import { formatCurrency } from "@/helpers/format-currency"

interface PaymentWithPerson extends Payment {
  person: Person
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-amber-100 text-amber-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

const typeConfig: Record<string, { label: string; className: string }> = {
  adhesion: { label: "Adhésion", className: "bg-amber-100 text-amber-700 border-amber-200" },
  donation: { label: "Don", className: "bg-rose-100 text-rose-700 border-rose-200" },
  order: { label: "Commande", className: "bg-blue-100 text-blue-700 border-blue-200" },
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: "Payé", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  PENDING: { label: "En attente", className: "bg-amber-100 text-amber-700 border-amber-200" },
  FAILED: { label: "Échoué", className: "bg-red-100 text-red-700 border-red-200" },
  CANCELLED: { label: "Annulé", className: "bg-gray-100 text-gray-600 border-gray-200" },
  REFUNDED: { label: "Remboursé", className: "bg-blue-100 text-blue-700 border-blue-200" },
  EXPIRED: { label: "Expiré", className: "bg-gray-100 text-gray-500 border-gray-200" },
}

export function BureauRecentPayments({ payments }: { payments: PaymentWithPerson[] }) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Paiements récents</CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Les {payments.length} derniers paiements enregistrés
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 w-56">Personne</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="pr-6 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  Aucun paiement enregistré
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => {
                const type = typeConfig[payment.type]
                const status = statusConfig[payment.status]
                const initials = getInitials(payment.person.firstName, payment.person.lastName)
                const avatarColor = getAvatarColor(payment.person.firstName)

                return (
                  <TableRow key={payment.id} className="group">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor}`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-sm">
                            {payment.person.firstName} {payment.person.lastName}
                          </div>
                          {payment.person.email && (
                            <div className="truncate text-xs text-muted-foreground">
                              {payment.person.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${type?.className ?? ""}`}>
                        {type?.label ?? payment.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold tabular-nums text-sm">
                      {formatCurrency(payment.amount, { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${status?.className ?? ""}`}>
                        {status?.label ?? payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right text-xs text-muted-foreground tabular-nums">
                      {formatDate(payment.paymentDate)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
