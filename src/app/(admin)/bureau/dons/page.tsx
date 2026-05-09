import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/helpers/format-currency"

export const metadata: Metadata = { title: "Dons" }

async function getDons() {
  return prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
    include: { person: true, payment: true },
  })
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase()
}

function avatarColor(name: string) {
  const c = ["bg-rose-100 text-rose-700","bg-amber-100 text-amber-700","bg-blue-100 text-blue-700","bg-emerald-100 text-emerald-700","bg-violet-100 text-violet-700"]
  return c[name.charCodeAt(0) % c.length]
}

export default async function DonsPage() {
  const dons = await getDons()

  const totalDons = dons.reduce((sum, d) => sum + d.amount, 0)

  return (
    <BureauContent
      title="Dons"
      description={`${dons.length} don${dons.length > 1 ? "s" : ""} — ${formatCurrency(totalDons, { maximumFractionDigits: 0 })} collectés au total`}
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Donateur</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="pr-6">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dons.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Aucun don enregistré
                  </TableCell>
                </TableRow>
              ) : (
                dons.map((don) => (
                  <TableRow key={don.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${don.person ? avatarColor(don.person.firstName) : "bg-gray-100 text-gray-500"}`}>
                          {don.person ? getInitials(don.person.firstName, don.person.lastName) : "?"}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {don.person ? `${don.person.firstName} ${don.person.lastName}` : "Anonyme"}
                          </div>
                          {don.person?.email && (
                            <div className="text-xs text-muted-foreground">{don.person.email}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{don.title}</TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(don.amount, { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                      {don.message ?? "—"}
                    </TableCell>
                    <TableCell className="pr-6 text-muted-foreground">
                      {formatDate(don.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </BureauContent>
  )
}
