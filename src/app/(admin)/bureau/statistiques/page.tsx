import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
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
import { deleteStatistique } from "./_actions/actions"

export const metadata: Metadata = { title: "Statistiques" }

async function getStatistiques() {
  return prisma.achievement.findMany({ orderBy: { order: "asc" } })
}

export default async function StatistiquesPage() {
  const stats = await getStatistiques()

  return (
    <BureauContent
      title="Statistiques"
      description={`${stats.length} statistique${stats.length > 1 ? "s" : ""}`}
      addHref="/bureau/statistiques/nouveau"
      addLabel="Nouvelle statistique"
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Libellé</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Icône</TableHead>
                <TableHead>Couleur</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Aucune statistique enregistrée
                  </TableCell>
                </TableRow>
              ) : (
                stats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="pl-6 font-medium">{stat.label ?? "—"}</TableCell>
                    <TableCell className="tabular-nums">{stat.value ?? "—"}</TableCell>
                    <TableCell>{stat.icon ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{stat.color ?? "—"}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{stat.order}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={stat.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}
                      >
                        {stat.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <RowActions
                        editHref={`/bureau/statistiques/${stat.id}/modifier`}
                        onDelete={deleteStatistique.bind(null, stat.id)}
                      />
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
