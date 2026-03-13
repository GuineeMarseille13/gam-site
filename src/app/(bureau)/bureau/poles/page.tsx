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
import { deletePole } from "./_actions/actions"

export const metadata: Metadata = { title: "Pôles" }

async function getPoles() {
  return prisma.pole.findMany({ orderBy: { createdAt: "desc" } })
}

export default async function PolesPage() {
  const poles = await getPoles()

  return (
    <BureauDataPage
      title="Pôles"
      description={`${poles.length} pôle${poles.length > 1 ? "s" : ""} d'activité`}
      addHref="/bureau/poles/nouveau"
      addLabel="Nouveau pôle"
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-14">Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    Aucun pôle enregistré
                  </TableCell>
                </TableRow>
              ) : (
                poles.map((pole) => (
                  <TableRow key={pole.id}>
                    <TableCell className="pl-6">
                      <CloudinaryImage imageId={pole.imageId} alt={pole.name} thumbSize={40} />
                    </TableCell>
                    <TableCell className="font-medium">{pole.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {pole.description ?? "—"}
                    </TableCell>
                    <TableCell className="pr-6">
                      <RowActions
                        editHref={`/bureau/poles/${pole.id}/modifier`}
                        onDelete={deletePole.bind(null, pole.id)}
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
