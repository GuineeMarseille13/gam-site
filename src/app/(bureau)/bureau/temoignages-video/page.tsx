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
import { Badge } from "@/components/ui/badge"
import { RowActions } from "@/components/bureau/row-actions"
import { deleteVideoTemoignage } from "./_actions/actions"

export const metadata: Metadata = { title: "Témoignages vidéo" }

async function getVideoTemoignages() {
  return prisma.video.findMany({
    where: { page: "HOME", section: "REVIEW" },
    orderBy: { order: "asc" },
  })
}

export default async function VideoTemoignagesPage() {
  const videos = await getVideoTemoignages()

  return (
    <BureauDataPage
      title="Témoignages vidéo"
      description={`${videos.length} vidéo${videos.length > 1 ? "s" : ""}`}
      addHref="/bureau/temoignages-video/nouveau"
      addLabel="Ajouter une vidéo"
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Titre</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Aucun témoignage vidéo enregistré
                  </TableCell>
                </TableRow>
              ) : (
                videos.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="pl-6 font-medium">
                      {v.title ?? <span className="text-muted-foreground italic">Sans titre</span>}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate block max-w-[280px]"
                      >
                        {v.url}
                      </a>
                    </TableCell>
                    <TableCell>{v.order}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={v.isActive ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}
                      >
                        {v.isActive ? "Visible" : "Masqué"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <RowActions
                        editHref={`/bureau/temoignages-video/${v.id}/modifier`}
                        onDelete={deleteVideoTemoignage.bind(null, v.id)}
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
