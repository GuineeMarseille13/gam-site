import type { Metadata } from "next"
import { IconCalendarCheck } from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminPermanenceRecentTable } from "../_components/admin-permanence-recent-table"
import { AdminPermanenceWizard } from "../_components/admin-permanence-wizard"
import { getRecentPermanenceAdminPresenceVolunteers } from "../_services/get-recent-permanence-admin-presence-volunteers"

export const metadata: Metadata = {
  title: "Permanence administrative",
  description:
    "Liste de présence des bénévoles à la permanence administrative — équivalent au formulaire historique.",
}

export default async function PermanenceAdministrativePage() {
  const recentRows = await getRecentPermanenceAdminPresenceVolunteers()

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Permanence administrative
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
          Enregistrez la présence d&apos;un membre à la permanence ADM (date, durée, commentaire
          optionnel). Les données remplacent l&apos;ancien Google Form pour une saisie centralisée sur
          le tableau de bord.
        </p>
      </div>

      <Card className="min-w-0 border-border/60 border-sky-200/50 bg-sky-50/20 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/15">
        <CardHeader className="pb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/15">
            <IconCalendarCheck className="size-5 text-sky-600" aria-hidden />
          </div>
          <CardTitle className="text-lg">Nouvelle saisie</CardTitle>
          <CardDescription>
            Quatre étapes : date de permanence, membre, durée (2 h ou autre), puis validation et
            commentaire.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pt-0 sm:px-6">
          <AdminPermanenceWizard />
        </CardContent>
      </Card>

      <section className="space-y-3" aria-labelledby="adm-perm-recent-heading">
        <h2 id="adm-perm-recent-heading" className="text-lg font-semibold tracking-tight">
          Dernières saisies
        </h2>
        <p className="text-sm text-muted-foreground">
          Aperçu des {recentRows.length} enregistrements les plus récents.
        </p>
        <AdminPermanenceRecentTable rows={recentRows} />
      </section>
    </div>
  )
}
