import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { isBureauDashboardRole } from "@/helpers/dashboard-roles"
import { manualAdhesionPayloadSchema } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import { saveManualAdhesion } from "@/app/(public)/adhesion/_services/save-manual-adhesion"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const successResponseSchema = z
  .object({
    success: z.literal(true),
    data: z
      .object({
        paymentReference: z.string(),
        membershipYear: z.number().int(),
        totalAmountEur: z.number(),
      })
      .strict(),
  })
  .strict()

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !isBureauDashboardRole(session.user.role)) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = manualAdhesionPayloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const result = await saveManualAdhesion(parsed.data)
    revalidatePath("/bureau/adhesions")
    revalidatePath("/bureau/adherents")

    return NextResponse.json(
      successResponseSchema.parse({
        success: true,
        data: result,
      }),
    )
  } catch (err) {
    console.error("[bureau/adhesions/manual]", err)
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500 },
    )
  }
}
