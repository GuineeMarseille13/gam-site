import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

import { beneficiaryAutofillParamsSchema } from "@/app/(admin)/administration/_schemas/beneficiary-identity-search.schema"
import { getBeneficiaryAutofillById } from "@/app/(admin)/administration/_services/get-beneficiary-autofill"
import { isAdministrationDashboardRole } from "@/helpers/dashboard-roles"
import { auth } from "@/lib/auth"

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/administration/beneficiaries/[id]/autofill
 * Données complètes pour préremplir l’étape Fiche (admin uniquement).
 */
export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !isAdministrationDashboardRole(session.user.role)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const { id } = await context.params
  const parsed = beneficiaryAutofillParamsSchema.safeParse({ id })
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 })
  }

  try {
    const data = await getBeneficiaryAutofillById(parsed.data.id)
    if (!data) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 })
    }
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
