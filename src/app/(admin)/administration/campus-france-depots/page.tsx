import type { Metadata } from "next"

import {
  administrationCardClassName,
  administrationIconBadgeClassName,
} from "@/config/administration-dashboard-theme"
import { cn } from "@/lib/utils"
import { IconSchool } from "@tabler/icons-react"
import { Card } from "@/components/ui/card"

import { CampuceFranceDepotsView } from "../_components/campuce-france-depots-view"
import { getCampuceFranceSubmissionsAdmin } from "../_services/get-campuce-france-submissions-admin"

export const metadata: Metadata = {
  title: "Campus France — dépôts étudiants",
  description:
    "Liste des dossiers envoyés depuis le formulaire Campus France du site public.",
}

export default async function CampusFranceDepotsAdminPage() {
  const submissions = await getCampuceFranceSubmissionsAdmin()

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Campus France — dépôts étudiants
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Liste des coordonnées et pièces jointes transmises depuis le formulaire du
          pôle Démarche administrative. Consultez ou téléchargez les fichiers
          (images ou PDF).
        </p>
      </div>

      <Card className={cn(administrationCardClassName, "min-w-0 overflow-hidden p-0")}>
        <div className="flex flex-wrap items-start gap-3 border-b border-border/60 px-4 py-4 md:px-6 md:py-5">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              administrationIconBadgeClassName,
            )}
          >
            <IconSchool className="size-5 text-sky-600" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {submissions.length} dépôt
              {submissions.length !== 1 ? "s" : ""} enregistré
              {submissions.length !== 1 ? "s" : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              Les pièces sont stockées sur Cloudinary ; l’aperçu PDF utilise le
              livrable brut (raw).
            </p>
          </div>
        </div>
        <div className="px-4 py-6 md:px-6">
          <CampuceFranceDepotsView submissions={submissions} />
        </div>
      </Card>
    </div>
  )
}
