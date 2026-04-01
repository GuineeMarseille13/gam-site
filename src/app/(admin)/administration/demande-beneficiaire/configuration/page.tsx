import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

import { BeneficiaryDemandTypeManager } from "../../_components/beneficiary-demand-type-manager"
import { BeneficiaryDocumentTypeManager } from "../../_components/beneficiary-document-type-manager"
import { getBeneficiaryDemandTypesAdmin } from "../../_services/get-beneficiary-demand-types-admin"
import { getBeneficiaryDocumentTypesAdmin } from "../../_services/get-beneficiary-document-types-admin"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Paramètres — demande bénéficiaire",
  description:
    "Configurer les types de demande et les documents fournis proposés dans le formulaire Demande bénéficiaire.",
}

/**
 * Page unique : types de demande + documents fournis (permanence administrative).
 */
export default async function DemandeBeneficiaireConfigurationPage() {
  const [demandRows, documentRows] = await Promise.all([
    getBeneficiaryDemandTypesAdmin(),
    getBeneficiaryDocumentTypesAdmin(),
  ])

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8 p-4 md:gap-10 md:p-6 lg:p-8">
      <header className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Paramètres de la demande bénéficiaire
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            Gérez les libellés du formulaire : menu « Type de demande » et cases « Documents fournis
            ». L’ordre et le statut actif s’appliquent partout sur le parcours de saisie et le suivi.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full shrink-0 gap-2 self-start border-sky-200/80 text-sky-800 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-950 sm:h-10 sm:w-auto lg:shrink-0 dark:border-sky-800 dark:text-sky-100 dark:hover:border-sky-500 dark:hover:bg-sky-950/50 dark:hover:text-sky-50"
        >
          <Link href="/administration/demande-beneficiaire">
            <IconArrowLeft className="size-4 shrink-0" aria-hidden />
            <span className="text-left leading-snug sm:text-center">Retour à la demande bénéficiaire</span>
          </Link>
        </Button>
      </header>

      <section className="min-w-0 space-y-3 md:space-y-4" aria-labelledby="cfg-demand-types-heading">
        <h2
          id="cfg-demand-types-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Types de demande
        </h2>
        <BeneficiaryDemandTypeManager initialRows={demandRows} />
      </section>

      <section className="min-w-0 space-y-3 md:space-y-4" aria-labelledby="cfg-doc-types-heading">
        <h2
          id="cfg-doc-types-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Documents fournis
        </h2>
        <BeneficiaryDocumentTypeManager initialRows={documentRows} />
      </section>
    </div>
  )
}
