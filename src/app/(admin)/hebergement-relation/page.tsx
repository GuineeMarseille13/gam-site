import type { Metadata } from "next"
import { headers } from "next/headers"

import { HerbergementRelationOverviewGrid } from "@/app/(admin)/hebergement-relation/_components/hebergement-relation-overview-grid"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = { title: "Vue d'ensemble" }

export default async function HerbergementRelationHomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const firstName = session?.user.name?.split(/\s+/)[0] ?? ""

  // ceci est utilisé pour initialiser le toggle ou switch'affichage du formulaire d'hébergement sur la page publique du pôle hébergement et mise en relation
  const settings = await prisma.detailsPole.findFirst()

  return (
    <HerbergementRelationOverviewGrid
      firstName={firstName}
      initialShowHebergementForm={settings?.showHebergementForm ?? false}
    />
  )
}