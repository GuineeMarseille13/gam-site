import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createAvis } from "../_actions/actions"
import { AvisForm } from "../_components/avis-form"

export const metadata: Metadata = {
  title: "Nouvel avis",
  description: "Ajouter un témoignage sur la page d’accueil",
}

async function getRoles() {
  return prisma.role.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { code: true, labelFr: true },
  })
}

export default async function NouvelAvisPage() {
  const roles = await getRoles()

  return (
    <BureauContent
      title="Nouvel avis"
      description="Le témoignage apparaît sur la page d’accueil lorsque « Visible » est coché."
      backHref="/bureau/avis"
    >
      <Card>
        <CardContent className="pt-6">
          <AvisForm action={createAvis} roles={roles} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
