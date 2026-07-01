import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { AdminTablePagination } from "@/app/(admin)/_shared/_components/admin-table-pagination"
import { getFirstSearchParam } from "@/app/(admin)/_shared/_lib/search-params"
import { AdhesionsBoard } from "./_components/adhesions-board"
import {
  adhesionsSearchParamsSchema,
  type AdhesionsSearchParams,
} from "./_schemas/adhesions-search-params.schema"
import { AdhesionsFilters } from "./_components/adhesions-filters"
import { CreateAdhesionDialog } from "./_components/create-adhesion-dialog"
import {
  getAdhesionAvailableYears,
  getAdhesionsPaginated,
} from "./_services/get-adhesions-paginated"

export const metadata: Metadata = { title: "Adhésions" }

export default async function AdhesionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const parsed = adhesionsSearchParamsSchema.safeParse({
    annee: getFirstSearchParam(rawParams.annee),
    q: getFirstSearchParam(rawParams.q),
    page: getFirstSearchParam(rawParams.page),
  })

  const searchValues: AdhesionsSearchParams = parsed.success ? parsed.data : {}
  const [availableYears, adhesionsResult] = await Promise.all([
    getAdhesionAvailableYears(),
    getAdhesionsPaginated({
      year: searchValues.annee,
      query: searchValues.q,
      page: searchValues.page,
    }),
  ])

  const { data: adhesions, total } = adhesionsResult

  return (
    <BureauContent
      title="Adhésions"
      description={`${total} adhésion${total > 1 ? "s" : ""} enregistrée${total > 1 ? "s" : ""}`}
      actions={<CreateAdhesionDialog />}
    >
      <AdhesionsFilters availableYears={availableYears} />
      <AdhesionsBoard adhesions={adhesions} />
      <AdminTablePagination
        pathname="/bureau/adhesions"
        total={total}
        page={adhesionsResult.page}
        searchParams={rawParams}
        className="mt-4"
      />
    </BureauContent>
  )
}
