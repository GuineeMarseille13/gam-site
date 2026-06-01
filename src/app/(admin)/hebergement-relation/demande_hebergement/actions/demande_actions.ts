"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const BASE = "/hebergement-relation/demande_hebergement"

// Récupère toutes les demandes
export async function getDemandes() {
  return prisma.demandeHebergement.findMany({
    orderBy: { createdAt: "desc" },
  })
}

// Récupère une demande par ID
export async function getDemandeById(id: string) {
  return prisma.demandeHebergement.findUnique({ where: { id } })
}

// Met à jour une demande
export async function updateDemande(id: string, formData: FormData) {
  await prisma.demandeHebergement.update({
    where: { id },
    data: {
      prenom: formData.get("prenom") as string,
      nom: formData.get("nom") as string,
      telephone: formData.get("telephone") as string,
      email: formData.get("email") as string,
      adresse: formData.get("adresse") as string,
      statut: formData.get("statut") as "EN_ATTENTE" | "TRAITEE" | "REFUSEE",
      notesAdmin: (formData.get("notesAdmin") as string) || null,
    },
  })
  revalidatePath(BASE)
  redirect(`${BASE}/${id}`)
}

// Supprime une demande
export async function deleteDemande(id: string) {
  await prisma.demandeHebergement.delete({ where: { id } })
  revalidatePath(BASE)
}

// Crée une nouvelle demande
export async function createDemande(formData: FormData) {
  await prisma.demandeHebergement.create({
    data: {
      prenom: formData.get("prenom") as string,
      nom: formData.get("nom") as string,
      telephone: formData.get("telephone") as string,
      email: formData.get("email") as string,
      adresse: formData.get("adresse") as string,
      nbPersonnes: parseInt(formData.get("nbPersonnes") as string) || 1,
      dateArrivee: new Date(formData.get("dateArrivee") as string),
      dureeJours: parseInt(formData.get("dureeJours") as string) || 1,
      description: (formData.get("description") as string) || null,
      statut: "EN_ATTENTE",
    },
  })
  revalidatePath("/hebergement-relation/demande_hebergement")
  redirect("/hebergement-relation/demande_hebergement")
}