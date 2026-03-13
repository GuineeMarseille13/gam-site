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
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { deleteMembreEquipe } from "./_actions/actions"

export const metadata: Metadata = { title: "Équipe" }

async function getEquipe() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } })
  const personIds = members.map((m) => m.personId)
  const persons = await prisma.person.findMany({ where: { id: { in: personIds } } })
  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  return members.map((m) => ({ ...m, person: personsById[m.personId] ?? null }))
}

export default async function EquipePage() {
  const membres = await getEquipe()

  return (
    <BureauDataPage
      title="Équipe"
      description={`${membres.length} membre${membres.length > 1 ? "s" : ""} de l'équipe`}
      addHref="/bureau/equipe/nouveau"
      addLabel="Nouveau membre"
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-14">Photo</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membres.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Aucun membre enregistré
                  </TableCell>
                </TableRow>
              ) : (
                membres.map((membre) => (
                  <TableRow key={membre.id}>
                    <TableCell className="pl-6">
                      <CloudinaryImage
                        imageId={membre.imageId}
                        alt={membre.person ? `${membre.person.firstName} ${membre.person.lastName}` : "Membre"}
                        thumbSize={40}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{membre.person?.firstName ?? "—"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{membre.person?.lastName ?? "—"}</div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {membre.description ?? "—"}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{membre.order}</TableCell>
                    <TableCell className="pr-6">
                      <RowActions
                        editHref={`/bureau/equipe/${membre.id}/modifier`}
                        onDelete={deleteMembreEquipe.bind(null, membre.id)}
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
