import Link from "next/link"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { fr } from "date-fns/locale"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  beneficiaryTrackingCardClassName,
  beneficiaryTrackingDetailGhostClassName,
  beneficiaryTrackingDetailLinkButtonClassName,
  beneficiaryTrackingTableBodyRowClassName,
  beneficiaryTrackingTableHeaderRowClassName,
  beneficiaryTrackingTableShellClassName,
} from "./beneficiary-suivi-form-classes"
import type { BeneficiaryTrackingListRow } from "../_schemas/beneficiary-tracking.schema"

interface BeneficiaryTrackingListProps {
  rows: BeneficiaryTrackingListRow[]
}

/**
 * Liste des fiches pour Suivi demande (table + cartes mobile).
 */
export function BeneficiaryTrackingList({ rows }: BeneficiaryTrackingListProps) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune fiche enregistrée pour le moment. Créez-en depuis la page Demande bénéficiaire.
      </p>
    )
  }

  return (
    <>
      <ul className="grid gap-3 md:hidden">
        {rows.map((r) => (
          <li key={r.id}>
            <Card className={beneficiaryTrackingCardClassName}>
              <CardContent className="space-y-2 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {format(parseISO(r.permanenceDate), "d MMM yyyy", { locale: fr })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {r.requestStatusLabel ?? "—"}
                  </span>
                </div>
                <p className="text-sm font-medium leading-snug break-words text-foreground">
                  {r.firstName} {r.lastName}
                </p>
                <p className="text-sm text-muted-foreground break-words">
                  {r.demandTypeLabels.length > 0 ? r.demandTypeLabels.join(" · ") : "—"}
                </p>
                {r.assignedResponsibleName && (
                  <p className="text-xs text-muted-foreground">{r.assignedResponsibleName}</p>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(beneficiaryTrackingDetailLinkButtonClassName, "mt-1 w-full")}
                >
                  <Link href={`/administration/suivi-demande/${r.id}`}>
                    Détail
                    <ChevronRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="relative hidden w-full md:block">
        <div className={beneficiaryTrackingTableShellClassName}>
          <Table>
          <TableHeader>
            <TableRow className={beneficiaryTrackingTableHeaderRowClassName}>
              <TableHead className="min-w-[100px]">Date perm.</TableHead>
              <TableHead className="min-w-[130px]">Bénéficiaire</TableHead>
              <TableHead className="min-w-[180px]">Types de demande</TableHead>
              <TableHead className="min-w-[100px]">Statut</TableHead>
              <TableHead className="min-w-[110px]">Responsable</TableHead>
              <TableHead className="w-[120px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className={beneficiaryTrackingTableBodyRowClassName}>
                <TableCell className="align-top font-medium whitespace-nowrap">
                  {format(parseISO(r.permanenceDate), "d MMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell className="align-top break-words">
                  {r.firstName} {r.lastName}
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground break-words">
                  {r.demandTypeLabels.length > 0 ? r.demandTypeLabels.join(" · ") : "—"}
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground break-words">
                  {r.requestStatusLabel ?? "—"}
                </TableCell>
                <TableCell className="align-top text-sm text-muted-foreground break-words">
                  {r.assignedResponsibleName ?? "—"}
                </TableCell>
                <TableCell className="align-top text-right">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className={beneficiaryTrackingDetailGhostClassName}
                  >
                    <Link href={`/administration/suivi-demande/${r.id}`}>
                      Détail
                      <ChevronRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </>
  )
}
