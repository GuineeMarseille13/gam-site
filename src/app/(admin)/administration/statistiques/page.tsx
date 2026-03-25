import type { Metadata } from "next"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { IconChartBar } from "@tabler/icons-react"

export const metadata: Metadata = { title: "Statistiques" }

export default function AdministrationStatistiquesPage() {
  return (
    <BureauDataPage
      title="Statistiques"
      description="Indicateurs et tableaux de bord — contenu à venir"
    >
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/15 px-6 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500/10">
          <IconChartBar className="size-7 text-sky-600" />
        </div>
        <div className="max-w-md space-y-2">
          <p className="text-sm font-semibold text-foreground">Page en construction</p>
          <p className="text-sm text-muted-foreground">
            Les statistiques seront affichées ici lorsque les indicateurs auront été définis.
          </p>
        </div>
      </div>
    </BureauDataPage>
  )
}
