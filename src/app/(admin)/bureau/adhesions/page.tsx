import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import type { AdhesionWithRelations } from "./_types/adhesion-with-relations.type"
import { AdhesionsBoard } from "./_components/adhesions-board"
import {
  adhesionsSearchParamsSchema,
  type AdhesionsSearchParams,
} from "./_schemas/adhesions-search-params.schema"
import { AdhesionsFilters } from "./_components/adhesions-filters"
import { CreateAdhesionDialog } from "./_components/create-adhesion-dialog"

export const metadata: Metadata = { title: "Adhésions" }

interface GetAdhesionsFilters {
  readonly year?: number
  readonly query?: string
}

function getDigits(value: string): string {
  return value.replace(/[^\d]/g, "")
}

function getFirstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") return value
  if (Array.isArray(value)) return value[0]
  return undefined
}

async function getAdhesions(
  filters: GetAdhesionsFilters,
): Promise<AdhesionWithRelations[]> {
  const where: Prisma.MemberShipWhereInput = {}

  if (filters.year !== undefined) {
    where.year = filters.year
  }

  const trimmedQuery = filters.query?.trim()
  if (trimmedQuery) {
    const phoneDigits = getDigits(trimmedQuery)
    const phoneFilter = phoneDigits
      ? [{ phone: { contains: phoneDigits, mode: "insensitive" as const } }]
      : []

    where.person = {
      is: {
        OR: [
          { firstName: { contains: trimmedQuery, mode: "insensitive" } },
          { lastName: { contains: trimmedQuery, mode: "insensitive" } },
          ...phoneFilter,
        ],
      },
    }
  }

  return prisma.memberShip.findMany({
    orderBy: { createdAt: "desc" },
    where,
    include: {
      person: true,
      payment: true,
    },
  })
}

async function getAvailableYears(): Promise<number[]> {
  const years = await prisma.memberShip.findMany({
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "desc" },
  })
  return years.map((y) => y.year)
}

function getSearchDefaults(input: AdhesionsSearchParams): {
  readonly year: string
  readonly q: string
} {
  const year = input.annee ? String(input.annee) : ""
  const q = input.q?.trim() ?? ""
  return { year, q }
}

export default async function AdhesionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const rawParams = await searchParams
  const parsed = adhesionsSearchParamsSchema.safeParse({
    annee: getFirstSearchParam(rawParams.annee),
    q: getFirstSearchParam(rawParams.q),
  })

  const searchValues: AdhesionsSearchParams = parsed.success ? parsed.data : {}
  const availableYears = await getAvailableYears()

  void getSearchDefaults(searchValues)
  const adhesions = await getAdhesions({
    year: searchValues.annee,
    query: searchValues.q,
  })

  return (
    <BureauContent
      title="Adhésions"
      description={`${adhesions.length} adhésion${adhesions.length > 1 ? "s" : ""} enregistrée${adhesions.length > 1 ? "s" : ""}`}
      actions={<CreateAdhesionDialog />}
    >
      <AdhesionsFilters availableYears={availableYears} />
      <AdhesionsBoard adhesions={adhesions} />
    </BureauContent>
  )
}
