import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { BeneficiaryTrackingDemandTypeFilter } from "../_components/beneficiary-tracking-demand-type-filter"
import { BeneficiaryTrackingList } from "../_components/beneficiary-tracking-list"
import { beneficiaryTrackingOutlineButtonClassName } from "../_components/beneficiary-suivi-form-classes"
import { suiviDemandeSearchParamsSchema } from "../_schemas/beneficiary-tracking.schema"
import { cn } from "@/helpers/utils"
import { getBeneficiariesForTracking } from "../_services/get-beneficiaries-for-tracking"
import { getBeneficiaryDemandTypeFilterOptions } from "../_services/get-beneficiary-demand-type-filter-options"

export const metadata: Metadata = {
  title: "Suivi demande — administration",
  description:
    "Liste des demandes bénéficiaires : consulter le détail et mettre à jour le statut de chaque dossier.",
}

export default async function SuiviDemandePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const queryParsed = suiviDemandeSearchParamsSchema.safeParse({ type: rawParams.type })
  const typeCandidate = queryParsed.success ? queryParsed.data.type : undefined

  const demandTypeOptions = await getBeneficiaryDemandTypeFilterOptions()
  const demandTypeId =
    typeCandidate && demandTypeOptions.some((o) => o.id === typeCandidate) ? typeCandidate : undefined

  const rows = await getBeneficiariesForTracking({ demandTypeId })

  const filterLabel = demandTypeId
    ? demandTypeOptions.find((o) => o.id === demandTypeId)?.label
    : undefined

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-sky-950 dark:text-sky-50 md:text-3xl">
            Suivi demande
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Consultez chaque fiche, le détail du dossier et le statut.
            {filterLabel ? (
              <>
                {" "}
                Liste filtrée&nbsp;: dossiers comportant au moins « {filterLabel} ».
              </>
            ) : null}{" "}
            Jusqu’à {rows.length} enregistrement(s) affiché(s) (les plus récents en premier).
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(beneficiaryTrackingOutlineButtonClassName, "h-10 w-full shrink-0 lg:w-auto")}
        >
          <Link href="/administration/demande-beneficiaire">
            <IconArrowLeft className="size-4" aria-hidden />
            Nouvelle fiche
          </Link>
        </Button>
      </div>

      <BeneficiaryTrackingDemandTypeFilter
        options={demandTypeOptions}
        selectedTypeId={demandTypeId}
        className="lg:max-w-xl"
      />

      <section className="space-y-3" aria-labelledby="suivi-demande-list-heading">
        <h2
          id="suivi-demande-list-heading"
          className="text-lg font-semibold tracking-tight text-sky-950 dark:text-sky-100"
        >
          Dossiers
        </h2>
        <BeneficiaryTrackingList rows={rows} />
      </section>
    </div>
  )
}
