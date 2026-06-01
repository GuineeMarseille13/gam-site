import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"  
import { updateDemande } from "../../actions/demande_actions"
import { DemandeForm } from "../../components/demandeForm"
export default async function ModifierDemandePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const demande = await prisma.demandeHebergement.findUnique({ where: { id } })
  if (!demande) notFound()

  const action = updateDemande.bind(null, demande.id)

  return (
    <BureauContent
      title="Modifier la demande"
      description={`${demande.prenom} ${demande.nom}`}
    >
      <Card>
        <CardContent className="pt-6">
          <DemandeForm
            action={action}
            submitLabel="Enregistrer les modifications"
            cancelHref={`/hebergement-relation/demande_hebergement/${id}`}
            defaultValues={{
              prenom: demande.prenom,
              nom: demande.nom,
              email: demande.email,
              telephone: demande.telephone,
              adresse: demande.adresse,
              statut: demande.statut,
              notesAdmin: demande.notesAdmin,
            }}
          />
        </CardContent>
      </Card>
    </BureauContent>
  )
}