import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

import { BeneficiaryDemandTypeManager } from "../../_components/beneficiary-demand-type-manager"
import { getBeneficiaryDemandTypesAdmin } from "../../_services/get-beneficiary-demand-types-admin"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Types de demande — suivi permanence",
  description: "Configurer les libellés proposés dans le formulaire de suivi des demandeurs.",
}

export default async function TypesDeDemandePage() {
  const rows = await getBeneficiaryDemandTypesAdmin()

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Types de demande
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Définissez les libellés du menu « Type de demande » du suivi permanence. Vous pouvez
            exiger une précision (texte libre) pour certains cas.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full shrink-0 gap-2 border-sky-200/80 text-sky-800 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-950 sm:h-10 sm:w-auto dark:border-sky-800 dark:text-sky-100 dark:hover:border-sky-500 dark:hover:bg-sky-950/50 dark:hover:text-sky-50"
        >
          <Link href="/administration/suivi-permanence">
            <IconArrowLeft className="size-4" aria-hidden />
            Retour au suivi
          </Link>
        </Button>
      </div>

      <BeneficiaryDemandTypeManager initialRows={rows} />
    </div>
  )
}
