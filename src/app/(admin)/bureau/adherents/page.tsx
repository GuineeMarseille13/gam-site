import type { Metadata } from "next"
import { AdminTablePagination } from "@/app/(admin)/_shared/_components/admin-table-pagination"
import { getFirstSearchParam } from "@/app/(admin)/_shared/_lib/search-params"
import {
  getAdherentAvailableYears,
  getAdherentsForDashboardPaginated,
  getAdherentsTotalCount,
} from "@/helpers/adherents"
import {
  adherentsSearchParamsSchema,
  type AdherentsSearchParams,
} from "./_schemas/adherents-search-params.schema"
import { AdherentsList } from "./_components/adherents-list"

export const metadata: Metadata = { title: "Adhérents" }

export default async function AdherentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const parsed = adherentsSearchParamsSchema.safeParse({
    page: getFirstSearchParam(rawParams.page),
    q: getFirstSearchParam(rawParams.q),
    annee: getFirstSearchParam(rawParams.annee),
    statut: getFirstSearchParam(rawParams.statut),
  })

  const searchValues: AdherentsSearchParams = parsed.success ? parsed.data : {}

  const [availableYears, adherentsResult, totalAdherents] = await Promise.all([
    getAdherentAvailableYears(),
    getAdherentsForDashboardPaginated({
      page: searchValues.page,
      search: searchValues.q,
      year: searchValues.annee,
      status: searchValues.statut ?? "tous",
    }),
    getAdherentsTotalCount(),
  ])

  return (
    <AdherentsList
      rows={adherentsResult.data}
      totalFiltered={adherentsResult.total}
      totalAdherents={totalAdherents}
      availableYears={availableYears}
      searchValues={searchValues}
      pagination={{
        page: adherentsResult.page,
        total: adherentsResult.total,
        searchParams: rawParams,
      }}
    />
  )
}
