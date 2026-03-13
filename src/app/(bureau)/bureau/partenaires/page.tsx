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
import { deletePartenaire } from "./_actions/actions"

export const metadata: Metadata = { title: "Partenaires" }

async function getPartenaires() {
  return prisma.partner.findMany({ orderBy: { createdAt: "desc" } })
}

export default async function PartenairesPage() {
  const partenaires = await getPartenaires()

  return (
    <BureauDataPage
      title="Partenaires"
      description={`${partenaires.length} partenaire${partenaires.length > 1 ? "s" : ""}`}
      addHref="/bureau/partenaires/nouveau"
      addLabel="Nouveau partenaire"
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-16">Logo</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Site web</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partenaires.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Aucun partenaire enregistré
                  </TableCell>
                </TableRow>
              ) : (
                partenaires.map((partenaire) => (
                  <TableRow key={partenaire.id}>
                    <TableCell className="pl-6">
                      <CloudinaryImage imageId={partenaire.imageId} alt={partenaire.name} thumbSize={40} />
                    </TableCell>
                    <TableCell className="font-medium">{partenaire.name}</TableCell>
                    <TableCell>
                      {partenaire.url ? (
                        <a
                          href={partenaire.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {partenaire.url}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {partenaire.description ?? "—"}
                    </TableCell>
                    <TableCell className="pr-6">
                      <RowActions
                        editHref={`/bureau/partenaires/${partenaire.id}/modifier`}
                        onDelete={deletePartenaire.bind(null, partenaire.id)}
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
