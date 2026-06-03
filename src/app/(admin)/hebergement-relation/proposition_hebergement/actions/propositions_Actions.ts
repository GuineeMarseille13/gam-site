"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"



// Récupère toutes les propositions d'hébergement
export async function getPropositions() {
  return prisma.propositionHebergement.findMany({
    orderBy: { createdAt: "desc" },
  })
}

// Met à jour le statut d'une proposition
export async function updateStatutProposition(
  id: string,
  statut: "EN_ATTENTE" | "VALIDE" | "OCCUPE" | "REFUSE" | "CLOTURE"

) {
  return prisma.propositionHebergement.update({
    where: { id },
    data: { statut },
  })
}

// Met à jour une proposition

export async function updateProposition(id: string, formData: FormData) {
  const prenom = formData.get("prenom") as string
  const nom = formData.get("nom") as string
  const email = formData.get("email") as string
  const telephone = formData.get("telephone") as string
  const adresse = formData.get("adresse") as string
  const statut = formData.get("statut") as "EN_ATTENTE" | "VALIDE" | "OCCUPE" | "REFUSE" | "CLOTURE"
  const description = (formData.get("description") as string) || null
  const notesAdmin = (formData.get("notesAdmin") as string | null)?.trim() || null

  

  await prisma.propositionHebergement.update({
    where: { id },
    data: {
      prenom,
      nom,
      email,
      telephone,
      adresse,
      statut,
      description,
      notesAdmin,
    },
  })
 
  // ces deux lignes permettent de forcer la révalidation de la page de liste et de rediriger vers la page de détail après la mise à jour   
  
    revalidatePath("/hebergement-relation/proposition_hebergement") // Redirige vers la page de détail de la proposition
    redirect(`/hebergement-relation/proposition_hebergement/${id}`) // Redirige vers la page de détail de la proposition
}

// Ajoute une note admin
export async function updateNotesAdmin(id: string, notesAdmin: string) {
  return prisma.propositionHebergement.update({
    where: { id },
    data: { notesAdmin },
  })
}

// Supprime une proposition
export async function deleteProposition(id: string) {
  return prisma.propositionHebergement.delete({
    where: { id },
  })
}

export async function getPropositionById(id: string) {
  return prisma.propositionHebergement.findUnique({ where: { id } })
}

