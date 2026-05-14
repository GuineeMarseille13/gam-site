import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { RapportsActiviteManager } from "./_components/rapports-activite-manager"

export const metadata: Metadata = {
  title: "Rapports d'activité",
  description: "Gérer les rapports publiés sur la page Notre association",
}

/**
 * Gestion des rapports d'activité : liste côté serveur, envoi via Server Actions (bureau authentifié).
 */
export default async function RapportsActivitePage() {
  const reports = await prisma.reportActivity.findMany({
    orderBy: { year: "desc" },
    select: { id: true, year: true, label: true, pdfUrl: true, isPublished: true },
  })

  return (
    <BureauContent
      title="Rapports d'activité"
      description="Ajoutez ou remplacez les rapports affichés dans l’onglet « Rapport d'activité » du site public. Une seule entrée par année : un nouvel envoi remplace le fichier existant."
    >
      <RapportsActiviteManager reports={reports} />
    </BureauContent>
  )
}
