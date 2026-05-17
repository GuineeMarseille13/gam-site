import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { getAdherentsForDashboard } from "@/helpers/adherents"
import { sessionCanAccessBureauAdminAdherents } from "@/helpers/api-dashboard-auth"

/**
 * Liste des adhérents pour le dashboard bureau (session requise, rôle admin ou bureau).
 */
export async function GET(): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || !sessionCanAccessBureauAdminAdherents(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const rows = await getAdherentsForDashboard()
  return NextResponse.json(rows)
}
