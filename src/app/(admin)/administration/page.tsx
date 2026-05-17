import type { Metadata } from "next"
import { headers } from "next/headers"

import { AdministrationOverviewGrid } from "@/app/(admin)/administration/_components/administration-overview-grid"
import { auth } from "@/lib/auth"

export const metadata: Metadata = { title: "Vue d'ensemble" }

export default async function AdministrationHomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const firstName = session?.user.name?.split(/\s+/)[0] ?? ""

  return <AdministrationOverviewGrid firstName={firstName} />
}
