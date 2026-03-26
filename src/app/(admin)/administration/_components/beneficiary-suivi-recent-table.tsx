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

import type { BeneficiaryPermanenceRow } from "../_schemas/beneficiary-permanence.schema"

interface BeneficiarySuiviRecentTableProps {
  rows: BeneficiaryPermanenceRow[]
}

function requestSummary(row: BeneficiaryPermanenceRow): string {
  const types = row.demandTypeLabels.join(" · ")
  if (row.requestDetail) {
    return `${types} — ${row.requestDetail}`
  }
  return types
}

/**
 * Historique récent des fiches suivi permanence (même source que le formulaire).
 */
export function BeneficiarySuiviRecentTable({ rows }: BeneficiarySuiviRecentTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune fiche pour le moment. Utilisez le formulaire ci-dessus pour la première saisie.
      </p>
    )
  }

  return (
    <>
      <ul className="grid gap-3 md:hidden">
        {rows.map((r) => (
          <li key={r.id}>
            <Card className="border-border/70 shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {format(parseISO(r.permanenceDate), "d MMM yyyy", { locale: fr })}
                  </span>
                </div>
                <p className="text-sm font-medium leading-snug text-foreground break-words">
                  {r.firstName} {r.lastName}
                </p>
                <p className="text-sm text-muted-foreground break-words">{requestSummary(r)}</p>
                {(r.requestStatusLabel || r.assignedResponsibleName) && (
                  <p className="text-xs text-muted-foreground">
                    {[r.requestStatusLabel, r.assignedResponsibleName].filter(Boolean).join(" · ")}
                  </p>
                )}
                {(r.phone || r.email) && (
                  <p className="text-xs text-muted-foreground break-all">
                    {[r.phone, r.email].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enregistré le {format(parseISO(r.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="relative hidden w-full overflow-x-auto rounded-lg border border-border/80 md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[110px]">Date perm.</TableHead>
              <TableHead className="min-w-[140px]">Demandeur</TableHead>
              <TableHead className="min-w-[200px]">Types de demande</TableHead>
              <TableHead className="min-w-[120px]">Contact</TableHead>
              <TableHead className="min-w-[100px]">Statut</TableHead>
              <TableHead className="min-w-[120px]">Responsable</TableHead>
              <TableHead className="min-w-[130px] whitespace-nowrap">Enregistré le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="align-top font-medium whitespace-nowrap">
                  {format(parseISO(r.permanenceDate), "d MMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell className="align-top break-words">
                  {r.firstName} {r.lastName}
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground break-words">
                  {requestSummary(r)}
                </TableCell>
                <TableCell className="align-top text-sm break-all">
                  {[r.phone, r.email].filter(Boolean).join(" · ") || "—"}
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground break-words">
                  {r.requestStatusLabel ?? "—"}
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground break-words">
                  {r.assignedResponsibleName ?? "—"}
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
