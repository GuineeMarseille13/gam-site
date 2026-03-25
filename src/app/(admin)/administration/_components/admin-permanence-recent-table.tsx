import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PermanenceAdminPresenceVolunteerRow } from "../_schemas/permanence-admin-presence-volunteer.schema"

interface AdminPermanenceRecentTableProps {
  rows: PermanenceAdminPresenceVolunteerRow[]
}

function formatHours(h: number): string {
  return Number.isInteger(h) ? String(h) : h.toFixed(1).replace(".", ",")
}

/**
 * Historique récent des présences enregistrées (même source que le formulaire).
 */
export function AdminPermanenceRecentTable({ rows }: AdminPermanenceRecentTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune présence enregistrée pour le moment. Utilisez le formulaire ci-dessus pour la première
        saisie.
      </p>
    )
  }

  return (
    <>
      {/* Mobile / étroit : cartes */}
      <ul className="grid gap-3 md:hidden">
        {rows.map((r) => (
          <li key={r.id}>
            <Card className="border-border/70 shadow-sm">
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {format(parseISO(r.permanenceDate), "d MMM yyyy", { locale: fr })}
                  </span>
                  <span className="text-lg font-bold tabular-nums text-sky-700 dark:text-sky-400">
                    {formatHours(r.hours)} h
                  </span>
                </div>
                <p className="text-sm font-medium leading-snug text-foreground break-words">
                  {r.memberFullName}
                </p>
                <p className="text-sm text-muted-foreground break-words">
                  {r.comment ? (
                    <span>{r.comment}</span>
                  ) : (
                    <span className="italic">Pas de commentaire</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Enregistré le{" "}
                  {format(parseISO(r.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {/* Tableau : md+ */}
      <div className="relative hidden w-full overflow-x-auto rounded-lg border border-border/80 md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Date permanence</TableHead>
              <TableHead className="min-w-[160px]">Membre</TableHead>
              <TableHead className="w-24 text-right">Heures</TableHead>
              <TableHead className="min-w-[200px]">Commentaire</TableHead>
              <TableHead className="min-w-[140px] whitespace-nowrap">Enregistré le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="align-top font-medium">
                  {format(parseISO(r.permanenceDate), "d MMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell className="align-top break-words">{r.memberFullName}</TableCell>
                <TableCell className="align-top text-right tabular-nums">
                  {formatHours(r.hours)}
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground break-words">
                  {r.comment ?? "—"}
                </TableCell>
                <TableCell className="align-top text-xs text-muted-foreground whitespace-nowrap">
                  {format(parseISO(r.createdAt), "d MMM yyyy HH:mm", { locale: fr })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
