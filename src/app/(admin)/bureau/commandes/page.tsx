import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { formatCurrency } from "@/helpers/format-currency"
import { AdminTablePagination } from "@/app/(admin)/_shared/_components/admin-table-pagination"
import { getFirstSearchParam } from "@/app/(admin)/_shared/_lib/search-params"
import { parseAdminPage } from "@/app/(admin)/_shared/_lib/admin-pagination"
import { CommandesBoard } from "./_components/commandes-board"
import {
  getCommandesPaginated,
  getCommandesTotals,
} from "./_services/get-commandes-paginated"

export const metadata: Metadata = { title: "Commandes" }

export default async function CommandesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const page = parseAdminPage(getFirstSearchParam(rawParams.page))

  const [commandesResult, totals] = await Promise.all([
    getCommandesPaginated(page),
    getCommandesTotals(),
  ])

  return (
    <BureauContent
      title="Commandes"
      description={`${totals.count} commande${totals.count > 1 ? "s" : ""} · ${formatCurrency(totals.amount, { unit: "cent", maximumFractionDigits: 0 })} de chiffre d'affaires`}
    >
      <CommandesBoard commandes={commandesResult.data} />
      <AdminTablePagination
        pathname="/bureau/commandes"
        total={commandesResult.total}
        page={commandesResult.page}
        searchParams={rawParams}
        className="mt-4"
      />
    </BureauContent>
  )
}
