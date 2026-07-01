import { AdminTablePagination } from "@/app/(admin)/_shared/_components/admin-table-pagination"

interface MembresTablePaginationProps {
  pathname?: string
  total: number
  page: number
  searchParams: Record<string, string | string[] | undefined>
  pageParam?: string
}

/**
 * Pagination pour les tableaux de la page Membres (paramètre de page configurable).
 */
export function MembresTablePagination({
  pathname = "/bureau/membres",
  total,
  page,
  searchParams,
  pageParam = "page",
}: MembresTablePaginationProps) {
  return (
    <AdminTablePagination
      pathname={pathname}
      total={total}
      page={page}
      searchParams={searchParams}
      pageParam={pageParam}
      className="mt-3"
    />
  )
}
