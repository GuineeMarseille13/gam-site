"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schéma de validation du formulaire
const hebergementSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(120),
  prenom: z.string().min(1, "Le prénom est requis").max(120),
  email: z.string().email("Email invalide").max(254),
  telephone: z.string().min(6, "Téléphone invalide").max(30),
  adresse: z.string().min(5, "Adresse requise").max(300),
  nbPersonnes: z.coerce.number().int().min(1).max(20),
  //description: z.string().max(500).optional(),
  dateDebut: z.string().min(1, "Date de début requise"),
  dureeJours: z.coerce.number().int().min(1).max(365),
})

// Type de l'état du formulaire
export type HebergementFormState =
  | { kind: "idle" }
  | { kind: "success" }
  | { kind: "error"; message: string }

export async function submitHebergement(
  _prevState: HebergementFormState,
  formData: FormData,
): Promise<HebergementFormState> {

  // Validation des données
  const parsed = hebergementSchema.safeParse({
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    adresse: formData.get("adresse"),
    nbPersonnes: formData.get("nbPersonnes"),
    //description: formData.get("description"),
    dateDebut: formData.get("dateDebut"),
    dureeJours: formData.get("dureeJours"),
  })

  if (!parsed.success) {
    return {
      kind: "error",
      message: parsed.error.issues[0]?.message ?? "Données invalides.",
    }
  }

  const { dateDebut, ...rest } = parsed.data

  try {
    // // Vérifie si un hébergement existe déjà pour cet email
    // const existing = await prisma.propositionHebergement.findUnique({
    //   where: { email: rest.email },
    // })

    // if (existing) {
    //   return {
    //     kind: "error",
    //     message: "Une proposition existe déjà pour cet email.",
    //   }
    // }

    // Enregistre la proposition en base
    await prisma.propositionHebergement.create({
      data: {
        ...rest,
        dateDebut: new Date(dateDebut),
      },
    })

    return { kind: "success" }

  } catch (error) {
    console.error("Erreur submit hébergement:", error)
    return {
      kind: "error",
      message: "Une erreur est survenue. Réessayez dans quelques instants.",
    }
  }
}