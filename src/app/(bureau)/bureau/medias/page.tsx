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
import Image from "next/image"

export const metadata: Metadata = { title: "Médias" }

async function getMedias() {
  return prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}

export default async function MediasPage() {
  const medias = await getMedias()

  return (
    <BureauDataPage
      title="Médias"
      description={`${medias.length} fichier${medias.length > 1 ? "s" : ""} média`}
    >
      {/* Grille de prévisualisation */}
      {medias.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Aucun média enregistré
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Aperçu</TableHead>
                  <TableHead>Nom / Alt</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="pr-6">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medias.map((media) => (
                  <TableRow key={media.id}>
                    <TableCell className="pl-6">
                      <Image
                        src={media.url}
                        alt={media.alt ?? media.id}
                        width={64}
                        height={48}
                        className="h-12 w-16 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate font-medium text-sm">
                        {media.alt ?? "Sans titre"}
                      </div>
                      <div className="max-w-xs truncate text-xs text-muted-foreground">
                        {media.url}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {media.format ?? "image"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700"
                      >
                        Actif
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </BureauDataPage>
  )
}
