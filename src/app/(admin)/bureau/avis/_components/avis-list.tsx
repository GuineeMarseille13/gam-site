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
import { deleteAvis } from "../_actions/actions"
import { AvisPersonCell } from "./avis-person-cell"
import { AvisMobileCard } from "./avis-mobile-card"
import type { AvisListRow } from "../_types/avis-list-row"

export type { AvisListRow }

function siteBadgeClass(isActive: boolean) {
  return isActive
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
    : "bg-muted text-muted-foreground"
}

function verifiedBadgeClass(isVerified: boolean) {
  return isVerified
    ? "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300"
    : "bg-amber-50 text-amber-800 dark:bg-amber-950/35 dark:text-amber-300"
}

interface AvisListProps {
  rows: AvisListRow[]
}

/**
 * Liste des avis : cartes empilées sur viewport &lt; md, tableau à partir de md (défilement horizontal si besoin).
 */
export function AvisList({ rows }: AvisListProps) {
  if (rows.length === 0) {
    return (
      <Card className="rounded-2xl border-dashed">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Aucun avis. Ajoutez-en pour alimenter la page d’accueil.
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4 md:hidden">
        {rows.map((r) => (
          <AvisMobileCard key={r.id} row={r} />
        ))}
      </div>

      <Card className="hidden rounded-2xl md:block">
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[12rem] pl-6">Personne</TableHead>
                  <TableHead className="min-w-[7rem]">Rôle affiché</TableHead>
                  <TableHead className="min-w-[6rem]">Pays</TableHead>
                  <TableHead className="min-w-[4rem]">Note</TableHead>
                  <TableHead className="min-w-[4rem]">Ordre</TableHead>
                  <TableHead className="min-w-[5rem]">Site</TableHead>
                  <TableHead className="min-w-[5rem]">Validé</TableHead>
                  <TableHead className="min-w-[8rem] pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="pl-6 align-middle">
                      <AvisPersonCell
                        firstName={r.firstName}
                        lastName={r.lastName}
                        avatarUrl={r.avatarUrl}
                        isActive={r.isActive}
                      />
                    </TableCell>
                    <TableCell>{r.role.labelFr}</TableCell>
                    <TableCell className="max-w-[140px] truncate text-muted-foreground">
                      {r.country ?? "—"}
                    </TableCell>
                    <TableCell className="tabular-nums">{r.rating}/5</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{r.order}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={siteBadgeClass(r.isActive)}>
                        {r.isActive ? "Visible" : "Masqué"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={verifiedBadgeClass(r.isVerified)}>
                        {r.isVerified ? "Oui" : "Non"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <RowActions
                        editHref={`/bureau/avis/${r.id}/modifier`}
                        onDelete={deleteAvis.bind(null, r.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
