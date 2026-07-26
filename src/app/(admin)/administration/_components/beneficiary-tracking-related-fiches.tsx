import Link from "next/link"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/helpers/utils"

import {
  beneficiaryTrackingSectionClassName,
  beneficiaryTrackingSectionTitleClassName,
} from "./beneficiary-suivi-form-classes"
import type { BeneficiaryTrackingRelatedFiche } from "../_schemas/beneficiary-tracking.schema"

interface BeneficiaryTrackingRelatedFichesProps {
  currentFicheId: string
  fiches: BeneficiaryTrackingRelatedFiche[]
}

/**
 * Historique des dossiers d’un même bénéficiaire (navigation entre fiches).
 */
export function BeneficiaryTrackingRelatedFiches({
  currentFicheId,
  fiches,
}: BeneficiaryTrackingRelatedFichesProps) {
  if (fiches.length <= 1) return null

  return (
    <section
      className={beneficiaryTrackingSectionClassName}
      aria-labelledby="track-related-fiches"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="track-related-fiches" className={beneficiaryTrackingSectionTitleClassName}>
          Dossiers de ce bénéficiaire
        </h2>
        <Badge variant="secondary" className="tabular-nums">
          {fiches.length} dossiers
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Toutes les demandes enregistrées pour cette personne. Sélectionnez un dossier pour
        consulter son détail et son statut.
      </p>
      <ul className="grid gap-2">
        {fiches.map((fiche) => (
          <RelatedFicheItem
            key={fiche.id}
            fiche={fiche}
            isCurrent={fiche.id === currentFicheId}
          />
        ))}
      </ul>
    </section>
  )
}

const RelatedFicheItem = ({
  fiche,
  isCurrent,
}: {
  fiche: BeneficiaryTrackingRelatedFiche
  isCurrent: boolean
}) => {
  const dateLabel = format(parseISO(fiche.permanenceDate), "d MMM yyyy", { locale: fr })
  const types =
    fiche.demandTypeLabels.length > 0 ? fiche.demandTypeLabels.join(" · ") : "Sans type"
  const status = fiche.requestStatusLabel ?? "Sans statut"

  if (isCurrent) {
    return (
      <li
        className={cn(
          "rounded-lg border border-sky-400/70 bg-sky-100/70 px-3 py-3",
          "dark:border-sky-600 dark:bg-sky-950/50",
        )}
        aria-current="page"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-sky-950 dark:text-sky-50">
            {dateLabel}
          </span>
          <Badge className="bg-sky-600 text-white hover:bg-sky-600">En cours</Badge>
        </div>
        <p className="mt-1 text-sm break-words text-foreground">{types}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {status}
          {fiche.assignedResponsibleName ? ` · ${fiche.assignedResponsibleName}` : ""}
        </p>
      </li>
    )
  }

  return (
    <li>
      <Link
        href={`/administration/suivi-demande/${fiche.id}`}
        className={cn(
          "flex items-start justify-between gap-3 rounded-lg border border-sky-200/60 bg-background px-3 py-3",
          "transition-[border-color,background-color,box-shadow]",
          "hover:border-sky-300 hover:bg-sky-50/60 hover:shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30",
          "dark:border-sky-900/50 dark:hover:border-sky-700 dark:hover:bg-sky-950/35",
        )}
      >
        <div className="min-w-0 space-y-0.5">
          <span className="text-sm font-medium text-foreground">{dateLabel}</span>
          <p className="text-sm break-words text-muted-foreground">{types}</p>
          <p className="text-xs text-muted-foreground">
            {status}
            {fiche.assignedResponsibleName ? ` · ${fiche.assignedResponsibleName}` : ""}
          </p>
        </div>
        <ChevronRight
          className="mt-0.5 size-4 shrink-0 text-sky-700 dark:text-sky-300"
          aria-hidden
        />
      </Link>
    </li>
  )
}
