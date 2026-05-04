import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

import { AdministrativePermanenceCalendarManager } from "../_components/administrative-permanence-calendar-manager"
import {
  getAdministrativePermanenceSettings,
  getAdministrativePermanenceSlots,
} from "@/helpers/administrative-permanence/queries"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Calendrier des permanences",
  description:
    "Définir les dates et horaires affichés sur le pôle Démarche administrative — synchronisés avec le site public.",
}

/**
 * Configuration du calendrier des permanences (site public).
 */
export default async function CalendrierPermanencePage() {
  const [slots, settings] = await Promise.all([
    getAdministrativePermanenceSlots(),
    getAdministrativePermanenceSettings(),
  ])

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Calendrier des permanences
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            Ajoutez ou modifiez les jours d&apos;accueil (tous les jours de la semaine possibles) avec
            heure de début et de fin. Les visiteurs voient le même calendrier sur la page du pôle
            Démarche administrative.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full shrink-0 gap-2 border-sky-200/80 text-sky-800 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-950 sm:h-10 sm:w-auto dark:border-sky-800 dark:text-sky-100 dark:hover:border-sky-500 dark:hover:bg-sky-950/50 dark:hover:text-sky-50"
        >
          <Link href="/administration">
            <IconArrowLeft className="size-4" aria-hidden />
            Retour au tableau de bord
          </Link>
        </Button>
      </div>

      <AdministrativePermanenceCalendarManager
        initialSlots={slots}
        initialHorairesCardText={settings.horairesCardText}
      />
    </div>
  )
}
