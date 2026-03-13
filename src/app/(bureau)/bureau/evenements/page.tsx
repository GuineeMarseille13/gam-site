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
import { RowActions } from "@/components/bureau/row-actions"
import { deleteEvenement } from "./_actions/actions"

export const metadata: Metadata = { title: "Événements" }

async function getEvenements() {
  return prisma.event.findMany({ orderBy: { startDate: "desc" } })
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

export default async function EvenementsPage() {
  const evenements = await getEvenements()

  return (
    <BureauDataPage
      title="Événements"
      description={`${evenements.length} événement${evenements.length > 1 ? "s" : ""}`}
      addHref="/bureau/evenements/nouveau"
      addLabel="Nouvel événement"
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evenements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Aucun événement enregistré
                  </TableCell>
                </TableRow>
              ) : (
                evenements.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="pl-6">
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="max-w-xs truncate text-xs text-muted-foreground">
                          {event.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(event.startDate)}</TableCell>
                    <TableCell className="text-muted-foreground">{event.location ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          event.startDate && event.startDate > new Date()
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }
                      >
                        {event.startDate && event.startDate > new Date() ? "À venir" : "Passé"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <RowActions
                        editHref={`/bureau/evenements/${event.id}/modifier`}
                        onDelete={deleteEvenement.bind(null, event.id)}
                      />
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
