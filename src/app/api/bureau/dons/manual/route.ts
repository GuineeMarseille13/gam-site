import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { isBureauDashboardRole } from "@/helpers/dashboard-roles"
import { manualDonPayloadSchema } from "@/app/(public)/don/_schemas/don.schema"
import { saveManualDon } from "@/app/(public)/don/_services/save-manual-don"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const successResponseSchema = z
  .object({
    success: z.literal(true),
    data: z
      .object({
        paymentReference: z.string(),
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
  const parsed = manualDonPayloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const result = await saveManualDon(parsed.data)
    revalidatePath("/bureau/dons")

    return NextResponse.json(
      successResponseSchema.parse({
        success: true,
        data: result,
      }),
    )
  } catch (err) {
    console.error("[bureau/dons/manual]", err)
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500 },
    )
  }
}
