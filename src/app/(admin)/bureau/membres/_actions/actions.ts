"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { Role } from "@/lib/generated/prisma/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireBureau } from "@/lib/auth-guard"
import { uploadImage } from "@/lib/cloudinary"

// ── Lister les utilisateurs ────────────────────────────────────────────────────

export async function listUsers() {
  await requireBureau()
  const result = await auth.api.listUsers({
    query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    headers: await headers(),
  })
  return result.users ?? []
}

// ── Créer un utilisateur ───────────────────────────────────────────────────────
// Flux : User (Better Auth) → Person

export async function createUser(formData: FormData) {
  await requireAdmin()

  const firstName   = formData.get("firstName") as string
  const lastName    = formData.get("lastName")  as string
  const email       = formData.get("email")     as string
  const password    = formData.get("password")  as string
  const role        = formData.get("role")      as string
  const phone       = (formData.get("phone")       as string | null)?.trim() || ""
  const description = (formData.get("description") as string | null)?.trim() || null
  const showOnSite  = formData.get("showOnSite") !== "false"
  const imageFile   = formData.get("imageFile") as File | null

  if (!firstName || !lastName || !email || !password || !role) {
    return { error: "Tous les champs obligatoires doivent être remplis." }
  }

  // 1. Créer le compte User (Better Auth)
  let createdUserId: string
  try {
    const created = await auth.api.createUser({
      body: { name: `${firstName} ${lastName}`, email, password, role: role as "admin" | "user" },
      headers: await headers(),
    })
    createdUserId = created.user.id
  } catch {
    return { error: "Un utilisateur avec cet email existe déjà." }
  }

  // 2. Créer la Person liée (avec rollback si échec)
  try {
    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/users")
      imageUrl = result.url
    }

    await prisma.person.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || "",
        userId: createdUserId,
        image: imageUrl,
        description,
        showOnSite,
      },
    })

    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    try {
      await auth.api.removeUser({ body: { userId: createdUserId }, headers: await headers() })
    } catch { /* non-bloquant */ }
    return { error: "Erreur lors de la création de l'utilisateur." }
  }
}

// ── Modifier un utilisateur ────────────────────────────────────────────────────

export async function updateUser(formData: FormData) {
  await requireAdmin()

  const userId    = formData.get("userId")    as string
  const firstName = formData.get("firstName") as string
  const lastName  = formData.get("lastName")  as string
  const role      = formData.get("role")      as string
  const phone       = (formData.get("phone")       as string | null)?.trim() || ""
  const description = (formData.get("description") as string | null)?.trim() || null
  const showOnSite  = formData.get("showOnSite") !== "false"
  const imageFile   = formData.get("imageFile") as File | null

  if (!userId || !firstName || !lastName || !role) {
    return { error: "Données invalides." }
  }

  try {
    // Mettre à jour le nom + rôle dans Better Auth
    await auth.api.setRole({
      body: { userId, role: role as "admin" | "user" },
      headers: await headers(),
    })
    await prisma.user.update({
      where: { id: userId },
      data: { name: `${firstName} ${lastName}` },
    })

    // Mettre à jour (ou créer) la Person liée
    const existingPerson = await prisma.person.findUnique({ where: { userId } })

    let imageUrl: string | null | undefined = undefined
    if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/users")
      imageUrl = result.url
    }

    if (existingPerson) {
      await prisma.person.update({
        where: { userId },
        data: {
          firstName,
          lastName,
          phone,
          description,
          showOnSite,
          ...(imageUrl !== undefined ? { image: imageUrl } : {}),
        },
      })
    } else {
      await prisma.person.create({
        data: {
          firstName,
          lastName,
          email: (await prisma.user.findUnique({ where: { id: userId } }))?.email ?? "",
          phone,
          userId,
          description,
          showOnSite,
          image: imageUrl ?? null,
        },
      })
    }

    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la mise à jour." }
  }
}

// ── Modifier le rôle ───────────────────────────────────────────────────────────

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin()

  await auth.api.setRole({
    body: { userId, role: role as "admin" | "user" },
    headers: await headers(),
  })
  revalidatePath("/bureau/membres")
}

// ── Bannir / débannir ──────────────────────────────────────────────────────────

export async function banUser(userId: string) {
  await requireAdmin()
  await auth.api.banUser({
    body: { userId },
    headers: await headers(),
  })
  revalidatePath("/bureau/membres")
}

export async function unbanUser(userId: string) {
  await requireAdmin()
  await auth.api.unbanUser({
    body: { userId },
    headers: await headers(),
  })
  revalidatePath("/bureau/membres")
}

// ── Supprimer un utilisateur ───────────────────────────────────────────────────

export async function deleteUser(userId: string) {
  const session = await requireAdmin()
  if (session.user.id === userId) {
    return { error: "Vous ne pouvez pas supprimer votre propre compte." }
  }

  try {
    // Supprimer la Person liée si elle existe
    await prisma.person.deleteMany({ where: { userId } })

    await auth.api.removeUser({
      body: { userId },
      headers: await headers(),
    })
    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la suppression." }
  }
}

// ── Lister les bénévoles (table Person) ───────────────────────────────────────

export async function listBenevoles() {
  await requireBureau()
  return prisma.person.findMany({
    where: { roles: { has: Role.VOLUNTEER } },
    orderBy: { createdAt: "desc" },
  })
}

// ── Créer un bénévole (table Person) ──────────────────────────────────────────

export async function createBenevole(formData: FormData) {
  await requireAdmin()

  const firstName = formData.get("firstName") as string
  const lastName  = formData.get("lastName")  as string
  const email     = formData.get("email")     as string | null
  const phone     = formData.get("phone")     as string

  const address    = (formData.get("address")  as string | null)?.trim() || null
  const zipCode    = (formData.get("zipCode")  as string | null)?.trim() || null
  const city       = (formData.get("city")     as string | null)?.trim() || null
  const country    = (formData.get("country")  as string | null)?.trim() || "France"
  const showOnSite = formData.get("showOnSite") !== "false"
  const imageFile  = formData.get("imageFile") as File | null

  if (!firstName || !lastName || !phone) {
    return { error: "Le prénom, le nom et le téléphone sont requis." }
  }

  const hasAddress = !!(address && zipCode && city)
  if ((address || zipCode || city) && !hasAddress) {
    return { error: "Pour enregistrer l'adresse, renseignez la rue, le code postal et la ville." }
  }

  try {
    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/persons")
      imageUrl = result.url
    }

    const addressRecord = hasAddress
      ? await prisma.address.create({
          data: {
            address: address!,
            zipCode: zipCode!,
            city:    city!,
            country,
            state:       "",
            countryCode: country.toLowerCase() === "france" ? "FR" : country.slice(0, 2).toUpperCase(),
          },
        })
      : null

    await prisma.person.create({
      data: {
        firstName,
        lastName,
        email:      email || null,
        phone,
        roles:      ["VOLUNTEER"],
        addressId:  addressRecord?.id ?? null,
        image:      imageUrl,
        showOnSite,
      },
    })

    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la création du bénévole." }
  }
}

// ── Modifier un bénévole (table Person) ───────────────────────────────────────

export async function updateBenevole(personId: string, formData: FormData) {
  await requireAdmin()

  const firstName = formData.get("firstName") as string
  const lastName  = formData.get("lastName")  as string
  const email     = formData.get("email")     as string | null
  const phone     = formData.get("phone")     as string

  const address    = (formData.get("address")  as string | null)?.trim() || null
  const zipCode    = (formData.get("zipCode")  as string | null)?.trim() || null
  const city       = (formData.get("city")     as string | null)?.trim() || null
  const country    = (formData.get("country")  as string | null)?.trim() || "France"
  const showOnSite = formData.get("showOnSite") !== "false"
  const imageFile  = formData.get("imageFile") as File | null
  const removeImage = formData.get("removeImage") === "true"

  if (!firstName || !lastName || !phone) {
    return { error: "Le prénom, le nom et le téléphone sont requis." }
  }

  const hasAddress = !!(address && zipCode && city)
  if ((address || zipCode || city) && !hasAddress) {
    return { error: "Pour enregistrer l'adresse, renseignez la rue, le code postal et la ville." }
  }

  try {
    const existing = await prisma.person.findUnique({
      where: { id: personId },
      include: { address: true },
    })
    if (!existing) return { error: "Bénévole introuvable." }

    let imageUrl: string | null | undefined = undefined
    if (removeImage) {
      imageUrl = null
    } else if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/persons")
      imageUrl = result.url
    }

    let addressId: string | null = existing.addressId
    if (hasAddress) {
      if (existing.addressId) {
        await prisma.address.update({
          where: { id: existing.addressId },
          data: { address: address!, zipCode: zipCode!, city: city!, country,
            countryCode: country.toLowerCase() === "france" ? "FR" : country.slice(0, 2).toUpperCase() },
        })
      } else {
        const addressRecord = await prisma.address.create({
          data: {
            address: address!, zipCode: zipCode!, city: city!, country, state: "",
            countryCode: country.toLowerCase() === "france" ? "FR" : country.slice(0, 2).toUpperCase(),
          },
        })
        addressId = addressRecord.id
      }
    } else {
      addressId = null
    }

    await prisma.person.update({
      where: { id: personId },
      data: {
        firstName,
        lastName,
        email:     email || null,
        phone,
        showOnSite,
        addressId,
        ...(imageUrl !== undefined ? { image: imageUrl } : {}),
      },
    })

    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la mise à jour du bénévole." }
  }
}

// ── Supprimer un bénévole (table Person) ──────────────────────────────────────

export async function deleteBenevole(personId: string) {
  await requireAdmin()
  try {
    await prisma.person.delete({ where: { id: personId } })
    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la suppression du bénévole." }
  }
}
