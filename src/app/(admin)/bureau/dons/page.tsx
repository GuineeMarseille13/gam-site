import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { formatCurrency } from "@/helpers/format-currency"
import { AdminTablePagination } from "@/app/(admin)/_shared/_components/admin-table-pagination"
import { getFirstSearchParam } from "@/app/(admin)/_shared/_lib/search-params"
import { parseAdminPage } from "@/app/(admin)/_shared/_lib/admin-pagination"
import { CreateDonDialog } from "./_components/create-don-dialog"
import { DonsBoard } from "./_components/dons-board"
import { getDonsPaginated, getDonsTotals } from "./_services/get-dons-paginated"

export const metadata: Metadata = { title: "Dons" }

export default async function DonsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const page = parseAdminPage(getFirstSearchParam(rawParams.page))

  const [donsResult, totals] = await Promise.all([
    getDonsPaginated(page),
    getDonsTotals(),
  ])

  return (
    <BureauContent
      title="Dons"
      description={`${totals.count} don${totals.count > 1 ? "s" : ""} — ${formatCurrency(totals.amount, { maximumFractionDigits: 0 })} collectés au total`}
      actions={<CreateDonDialog />}
    >
      <DonsBoard dons={donsResult.data} />
      <AdminTablePagination
        pathname="/bureau/dons"
        total={donsResult.total}
        page={donsResult.page}
        searchParams={rawParams}
        className="mt-4"
      />
    </BureauContent>
  )
}
