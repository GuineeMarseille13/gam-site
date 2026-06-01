import { DemandesTable } from "./components/demandeTable"
import { getDemandes } from "./actions/demande_actions"
import Link from "next/link"
import { IconPlus, IconUsers } from "@tabler/icons-react"

export const dynamic = "force-dynamic"

export default async function DemandesPage() {
  const demandes = await getDemandes()

  return (
    <div className="flex flex-1 flex-col gap-4 p-3 sm:gap-6 sm:p-4 md:p-6 lg:p-8">

      {/* En-tête responsive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          {/* Icône visible sur tous les écrans */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700">
            <IconUsers className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              Demandes d'hébergement
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 sm:text-sm">
              {demandes.length} demande{demandes.length > 1 ? "s" : ""}
              {" — "}
              <span className="hidden sm:inline">Personnes cherchant un hébergement</span>
              <span className="sm:hidden">En attente de traitement</span>
            </p>
          </div>
        </div>

        {/* Bouton — pleine largeur sur mobile */}
        <Link
          href="/hebergement-relation/demande_hebergement/nouveau"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors sm:shrink-0 sm:px-5 w-full sm:w-auto"
        >
          <IconPlus className="size-4" />
          <span>Nouvelle demande</span>
        </Link>
      </div>

      {/* Tableau */}
      <DemandesTable initialData={demandes} />
    </div>
  )
}