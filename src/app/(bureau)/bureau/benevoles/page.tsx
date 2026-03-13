import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
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
import { deleteBenevole } from "./_actions/actions"

export const metadata: Metadata = { title: "Bénévoles" }

async function getBenevoles() {
  const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } })
  const personIds = volunteers.map((v) => v.personId)
  const persons = await prisma.person.findMany({ where: { id: { in: personIds } } })
  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  return volunteers.map((v) => ({ ...v, person: personsById[v.personId] ?? null }))
}

export default async function BenevolesPage() {
  const benevoles = await getBenevoles()

  return (
    <BureauDataPage
      title="Bénévoles"
      description={`${benevoles.length} bénévole${benevoles.length > 1 ? "s" : ""} — Nos héros du quotidien`}
      addHref="/bureau/benevoles/nouveau"
      addLabel="Nouveau bénévole"
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Prénom</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benevoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Aucun bénévole enregistré
                  </TableCell>
                </TableRow>
              ) : (
                benevoles.map((benevole) => (
                  <TableRow key={benevole.id}>
                    <TableCell className="pl-6 font-medium">{benevole.person?.firstName ?? "—"}</TableCell>
                    <TableCell className="font-medium">{benevole.person?.lastName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{benevole.person?.email ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{benevole.person?.phone ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{benevole.isActive ? "Actif" : "Inactif"}</TableCell>
                    <TableCell className="pr-6">
                      <RowActions
                        editHref={`/bureau/benevoles/${benevole.id}/modifier`}
                        onDelete={deleteBenevole.bind(null, benevole.id)}
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
