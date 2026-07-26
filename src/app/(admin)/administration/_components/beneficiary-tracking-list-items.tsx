import Link from "next/link"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/helpers/utils"

import {
  beneficiaryTrackingCardClassName,
  beneficiaryTrackingDetailGhostClassName,
  beneficiaryTrackingDetailLinkButtonClassName,
  beneficiaryTrackingTableBodyRowClassName,
} from "./beneficiary-suivi-form-classes"
import type { BeneficiaryTrackingListGroup } from "../_schemas/beneficiary-tracking.schema"

interface GroupItemProps {
  group: BeneficiaryTrackingListGroup
}

/**
 * Carte mobile d’un bénéficiaire (groupement multi-dossiers).
 */
export function BeneficiaryTrackingListMobileCard({ group: g }: GroupItemProps) {
  const detailHref = `/administration/suivi-demande/${g.latestFicheId}`

  return (
    <Card className={beneficiaryTrackingCardClassName}>
      <CardContent className="space-y-2 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            {format(parseISO(g.latestPermanenceDate), "d MMM yyyy", { locale: fr })}
          </span>
          <span className="text-xs text-muted-foreground">
            {g.latestRequestStatusLabel ?? "—"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium leading-snug break-words text-foreground">
            {g.firstName} {g.lastName}
          </p>
          {g.ficheCount > 1 ? (
            <Badge variant="secondary" className="shrink-0 tabular-nums">
              {g.ficheCount} dossiers
            </Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground break-words">
          {g.demandTypeLabels.length > 0 ? g.demandTypeLabels.join(" · ") : "—"}
        </p>
        {g.latestAssignedResponsibleName ? (
          <p className="text-xs text-muted-foreground">{g.latestAssignedResponsibleName}</p>
        ) : null}
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(beneficiaryTrackingDetailLinkButtonClassName, "mt-1 w-full")}
        >
          <Link href={detailHref}>
            Détail
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * Ligne desktop d’un bénéficiaire (groupement multi-dossiers).
 */
export function BeneficiaryTrackingListDesktopRow({ group: g }: GroupItemProps) {
  const detailHref = `/administration/suivi-demande/${g.latestFicheId}`

  return (
    <TableRow className={beneficiaryTrackingTableBodyRowClassName}>
      <TableCell className="align-top font-medium whitespace-nowrap">
        {format(parseISO(g.latestPermanenceDate), "d MMM yyyy", { locale: fr })}
      </TableCell>
      <TableCell className="align-top break-words">
        <div className="flex flex-wrap items-center gap-2">
          <span>
            {g.firstName} {g.lastName}
          </span>
          {g.ficheCount > 1 ? (
            <Badge variant="secondary" className="shrink-0 tabular-nums">
              {g.ficheCount}
            </Badge>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="align-top text-sm text-muted-foreground break-words">
        {g.demandTypeLabels.length > 0 ? g.demandTypeLabels.join(" · ") : "—"}
      </TableCell>
      <TableCell className="align-top text-sm text-muted-foreground break-words">
        {g.latestRequestStatusLabel ?? "—"}
      </TableCell>
      <TableCell className="align-top text-sm text-muted-foreground break-words">
        {g.latestAssignedResponsibleName ?? "—"}
      </TableCell>
      <TableCell className="align-top text-right">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={beneficiaryTrackingDetailGhostClassName}
        >
          <Link href={detailHref}>
            Détail
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}
