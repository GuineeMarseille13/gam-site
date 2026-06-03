// src/app/(bureau)/hebergement-relation/proposition_hebergement/[id]/modifier/page.tsx

import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { updateProposition } from "../../actions/propositions_Actions"
import { PropositionForm } from "../../components/proposition-form"

export default async function ModifierPropositionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const proposition = await prisma.propositionHebergement.findUnique({
    where: { id },
  })
  if (!proposition) notFound()

  const action = updateProposition.bind(null, proposition.id)

  return (
    <BureauContent
      title="Modifier la proposition"
      description={`${proposition.prenom} ${proposition.nom}`}
    >
      <Card>
        <CardContent className="pt-6">
          <PropositionForm
            action={action}
            submitLabel="Enregistrer les modifications"
            cancelHref={`/hebergement-relation/proposition_hebergement/${id}`}
            defaultValues={{
              prenom:      proposition.prenom,
              nom:         proposition.nom,
              email:       proposition.email,
              telephone:   proposition.telephone,
              adresse:     proposition.adresse,
              nbPersonnes: proposition.nbPersonnes,
              dureeJours:  proposition.dureeJours,
              dateDebut:   proposition.dateDebut,
              statut:      proposition.statut,
             description: proposition.description ?? undefined,
              notesAdmin:  proposition.notesAdmin,
            }}
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}