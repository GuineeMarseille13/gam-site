import type { Metadata } from "next"
import Link from "next/link"
import { IconClipboardList, IconList } from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BeneficiarySuiviRecentTable } from "../_components/beneficiary-suivi-recent-table"
import { BeneficiarySuiviWizard } from "../_components/beneficiary-suivi-wizard"
import { getActiveBeneficiaryDemandTypes } from "../_services/get-beneficiary-demand-types"
import { getActiveBeneficiaryDocumentTypes } from "../_services/get-active-beneficiary-document-types"
import { getRecentBeneficiaries } from "../_services/get-recent-beneficiaries"
import { getAdministrativePermanenceSlots } from "@/lib/administrative-permanence/queries"

export const metadata: Metadata = {
  title: "Demande bénéficiaire — permanence administrative",
  description:
    "Enregistrement des demandes bénéficiaires à la permanence administrative (ex-Google Form suivi).",
}

export default async function DemandeBeneficiairePage() {
  const [recentRows, demandTypes, documentTypes, permanenceSlots] = await Promise.all([
    getRecentBeneficiaries(),
    getActiveBeneficiaryDemandTypes(),
    getActiveBeneficiaryDocumentTypes(),
    getAdministrativePermanenceSlots(),
  ])

  const permanenceSlotDates = permanenceSlots.map((s) => s.date)

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Demande bénéficiaire
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Permanence administrative — saisie et suivi des dossiers reçus à l’accueil.
        </p>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-2 h-10 gap-2 border-sky-200/80 text-sky-800 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-950 dark:border-sky-800 dark:text-sky-100 dark:hover:border-sky-500 dark:hover:bg-sky-950/50 dark:hover:text-sky-50"
        >
          <Link href="/administration/demande-beneficiaire/configuration">
            <IconList className="size-4" aria-hidden />
            Paramètres (types & documents)
          </Link>
        </Button>
      </div>

      <Card className="min-w-0 border-border/60 border-sky-200/50 bg-sky-50/20 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/15">
        <CardHeader className="pb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/15">
            <IconClipboardList className="size-5 text-sky-600" aria-hidden />
          </div>
          <CardTitle className="text-lg">Nouvelle fiche</CardTitle>
          <CardDescription>
            Cinq étapes : date de permanence, type(s) de demande, dossier (documents, statut,
            responsable, paiement), fiche identité et comptes, puis validation et notes.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pt-0 sm:px-6">
          <BeneficiarySuiviWizard
            demandTypes={demandTypes}
            documentTypes={documentTypes}
            permanenceSlotDates={permanenceSlotDates}
          />
        </CardContent>
      </Card>

      <section className="space-y-3" aria-labelledby="ben-suivi-recent-heading">
        <h2 id="ben-suivi-recent-heading" className="text-lg font-semibold tracking-tight">
          Dernières fiches
        </h2>
        <p className="text-sm text-muted-foreground">
          Aperçu des {recentRows.length} enregistrements les plus récents.
        </p>
        <BeneficiarySuiviRecentTable rows={recentRows} />
      </section>
    </div>
  )
}
