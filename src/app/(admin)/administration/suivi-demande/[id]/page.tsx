import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { BeneficiaryTrackingDetailView } from "../../_components/beneficiary-tracking-detail-view"
import { beneficiaryTrackingGhostNavClassName } from "../../_components/beneficiary-suivi-form-classes"
import { cn } from "@/helpers/utils"
import { beneficiaryTrackingParamsSchema } from "../../_schemas/beneficiary-tracking.schema"
import { getBeneficiaryDetailForTracking } from "../../_services/get-beneficiary-detail-for-tracking"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const parsed = beneficiaryTrackingParamsSchema.safeParse({ id })
  if (!parsed.success) {
    return { title: "Fiche — administration" }
  }
  const detail = await getBeneficiaryDetailForTracking(parsed.data.id)
  if (!detail) {
    return { title: "Fiche introuvable" }
  }
  return {
    title: `${detail.firstName} ${detail.lastName} — Suivi demande`,
    description: `Détail du dossier et statut — ${detail.demandTypeLabels.join(", ") || "Demande bénéficiaire"}.`,
  }
}

export default async function SuiviDemandeDetailPage({ params }: PageProps) {
  const { id } = await params
  const parsed = beneficiaryTrackingParamsSchema.safeParse({ id })
  if (!parsed.success) {
    notFound()
  }

  const detail = await getBeneficiaryDetailForTracking(parsed.data.id)
  if (!detail) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={cn(beneficiaryTrackingGhostNavClassName, "-ml-2 h-9 gap-1 px-2")}
          >
            <Link href="/administration/suivi-demande">
              <IconArrowLeft className="size-4" aria-hidden />
              Retour à la liste
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-sky-950 dark:text-sky-50 md:text-3xl">
            {detail.firstName} {detail.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Détail du dossier — mise à jour du statut ci-dessous.
          </p>
        </div>
      </div>

      <BeneficiaryTrackingDetailView detail={detail} />
    </div>
  )
}
