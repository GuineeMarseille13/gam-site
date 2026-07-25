import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { volunteerSearchQuerySchema } from "@/app/(admin)/administration/_schemas/volunteer-search.schema"
import { searchActiveVolunteersByName } from "@/app/(admin)/administration/_services/search-active-volunteers"
import { isAdministrationDashboardRole } from "@/helpers/dashboard-roles"
import { auth } from "@/lib/auth"

/**
 * GET /api/administration/volunteers/search?q=…
 * Suggestions de bénévoles actifs pour l’autocomplete « Responsable ».
 */
export async function GET(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !isAdministrationDashboardRole(session.user.role)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const url = new URL(request.url)
  const parsed = volunteerSearchQuerySchema.safeParse({
    q: url.searchParams.get("q") ?? "",
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_INPUT", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  try {
    const results = await searchActiveVolunteersByName(parsed.data)
    return NextResponse.json({ results })
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "INVALID_INPUT", details: error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
