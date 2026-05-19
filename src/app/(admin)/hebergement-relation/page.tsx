import type { Metadata } from "next"
import { headers } from "next/headers"

import { HerbergementRelationOverviewGrid } from "@/app/(admin)/hebergement-relation/_components/hebergement-relation-overview-grid"
import { auth } from "@/lib/auth"

export const metadata: Metadata = { title: "Vue d'ensemble" }

export default async function HerbergementRelationHomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const firstName = session?.user.name?.split(/\s+/)[0] ?? ""

  return <HerbergementRelationOverviewGrid firstName={firstName} />
}
