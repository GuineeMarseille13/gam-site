import Link from "next/link"
import { IconHome } from "@tabler/icons-react"
import { getPropositions } from "./actions/propositions_Actions"
import { PropositionsTable } from "./components/propositionsTable"

export const dynamic = "force-dynamic"

export default async function PropositionsPage() {
  const propositions = await getPropositions()

  // Compte les propositions par statut pour les badges
  const enAttente = propositions.filter(p => p.statut === "EN_ATTENTE").length
  const valides = propositions.filter(p => p.statut === "VALIDE").length
  const occupes = propositions.filter(p => p.statut === "OCCUPE").length

  return (
    <div className="flex flex-1 flex-col gap-4 p-3 sm:gap-6 sm:p-4 md:p-6 lg:p-8">

      {/* En-tête responsive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700">
            <IconHome className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              Propositions d'hébergement
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 sm:text-sm">
              {propositions.length} proposition{propositions.length > 1 ? "s" : ""}
              {" — "}
              <span className="hidden sm:inline">Hébergeurs disponibles</span>
              <span className="sm:hidden">Total</span>
            </p>
          </div>
        </div>
      </div>

      

      {/* Tableau */}
      <PropositionsTable initialData={propositions} />
    </div>
  )
}