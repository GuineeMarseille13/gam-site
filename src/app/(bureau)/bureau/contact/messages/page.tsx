import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ContactSubmissionStatus } from "@/lib/generated/prisma/enums"
import { SubmissionActions } from "./_components/submission-actions"

export const metadata: Metadata = { title: "Messages de contact" }

const STATUS_BADGE: Record<ContactSubmissionStatus, { label: string; className: string }> = {
  PENDING:  { label: "En attente", className: "bg-amber-100 text-amber-700" },
  READ:     { label: "Lu",         className: "bg-blue-100 text-blue-700" },
  REPLIED:  { label: "Répondu",    className: "bg-emerald-100 text-emerald-700" },
  ARCHIVED: { label: "Archivé",    className: "bg-gray-100 text-gray-500" },
}

export default async function MessagesPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <BureauDataPage
      title="Messages de contact"
      description={`${submissions.length} message${submissions.length > 1 ? "s" : ""} reçu${submissions.length > 1 ? "s" : ""}`}
    >
      <Card>
        <CardContent className="px-0">
          {submissions.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Aucun message reçu</p>
          ) : (
            <>
              {/* ── Mobile : cartes ── */}
              <div className="md:hidden divide-y">
                {submissions.map((sub) => {
                  const badge = STATUS_BADGE[sub.status]
                  return (
                    <div key={sub.id} className={`px-4 py-4 space-y-2 ${sub.status === "PENDING" ? "bg-amber-50/40" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`font-medium truncate ${sub.status === "PENDING" ? "font-semibold" : ""}`}>
                            {sub.firstName} {sub.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{sub.email}</p>
                        </div>
                        <Badge variant="secondary" className={`shrink-0 ${badge.className}`}>
                          {badge.label}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium truncate">{sub.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{sub.message}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">
                          {sub.createdAt.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                        <SubmissionActions id={sub.id} currentStatus={sub.status} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── Desktop : table ── */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Expéditeur</TableHead>
                      <TableHead>Sujet</TableHead>
                      <TableHead className="hidden lg:table-cell">Message</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="pr-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((sub) => {
                      const badge = STATUS_BADGE[sub.status]
                      return (
                        <TableRow key={sub.id} className={sub.status === "PENDING" ? "font-medium" : ""}>
                          <TableCell className="pl-6">
                            <div>{sub.firstName} {sub.lastName}</div>
                            <div className="text-xs text-muted-foreground">{sub.email}</div>
                            {sub.phone && <div className="text-xs text-muted-foreground">{sub.phone}</div>}
                          </TableCell>
                          <TableCell className="max-w-[12rem] truncate">{sub.subject}</TableCell>
                          <TableCell className="hidden lg:table-cell max-w-[20rem]">
                            <p className="truncate text-sm text-muted-foreground">{sub.message}</p>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground whitespace-nowrap">
                            {sub.createdAt.toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={badge.className}>
                              {badge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6">
                            <SubmissionActions id={sub.id} currentStatus={sub.status} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
