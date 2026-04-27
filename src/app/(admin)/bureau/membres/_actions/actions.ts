"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getRoleIdByCode } from "@/lib/association-role-helpers"
import { requireAdmin, requireBureau } from "@/lib/auth-guard"
import { uploadImage } from "@/lib/cloudinary"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"
import { deleteSupersededCloudinaryUrl } from "@/lib/cloudinary-replacement"
import type { MembreBureauRow } from "../_components/membres-team-table"

// ── Lister les utilisateurs ────────────────────────────────────────────────────

export async function listUsers() {
  await requireBureau()
  const result = await auth.api.listUsers({
    query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    headers: await headers(),
  })
  return result.users ?? []
}

// ── Lister les comptes avec rôle association (Person.role) ───────────────────

export async function listComptes() {
  await requireBureau()
  const authUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })
  if (authUsers.length === 0) return []

  const userIds = authUsers.map((u) => u.id)
  const persons = await prisma.person.findMany({
    where: { userId: { in: userIds } },
    include: { role: true },
  })
  const personIds = persons.map((p) => p.id)
  const teamMembers = personIds.length > 0
    ? await prisma.teamMember.findMany({ where: { personId: { in: personIds } } })
    : []

  return authUsers.map((u) => {
    const person = persons.find((p) => p.userId === u.id) ?? null
    const tm = person ? (teamMembers.find((tm) => tm.personId === person.id) ?? null) : null
    const imageFromTeamMember = tm?.imageId
      ? cloudinaryImageUrl(tm.imageId, "w_80,h_80,c_fill,q_auto,f_auto")
      : null
    const image = person?.image ?? imageFromTeamMember ?? u.image ?? null
    return { ...u, associationRoleLabel: person?.role?.labelFr ?? null, image }
  })
}

// ── Membres du bureau (table `team_members`, page Membres) ───────────────────

/**
 * Lignes `team_members` triées par `order`, avec personne, rôle GAM et compte d’accès optionnel.
 */
export async function listTeamMembersForMembresPage(): Promise<MembreBureauRow[]> {
  await requireBureau()
  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
    include: {
      person: { include: { role: true } },
    },
  })
  if (members.length === 0) return []

  const userIds = members.map((m) => m.person.userId).filter((id): id is string => id != null)
  const users =
    userIds.length > 0 ? await prisma.user.findMany({ where: { id: { in: userIds } } }) : []
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]))

  return members.map((tm) => {
    const person = tm.person
    const user = person.userId ? usersById[person.userId] ?? null : null
    const imageFromTeamMember = tm.imageId
      ? cloudinaryImageUrl(tm.imageId, "w_80,h_80,c_fill,q_auto,f_auto")
      : null
    const image = person.image ?? imageFromTeamMember ?? user?.image ?? null

    return {
      id: tm.id,
      personId: person.id,
      userId: person.userId,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email ?? user?.email ?? null,
      phone: person.phone,
      associationRoleLabel: person.role?.labelFr ?? null,
      image,
      dashboardRole: user?.role ?? null,
      banned: user?.banned === true,
    }
  })
}

// ── Créer un utilisateur ───────────────────────────────────────────────────────
// Flux : User (Better Auth) → Person → TeamMember

export async function createUser(formData: FormData) {
  try { await requireAdmin() } catch {
    return { error: "Accès réservé aux administrateurs." }
  }

  const firstName   = formData.get("firstName") as string
  const lastName    = formData.get("lastName")  as string
  const email       = formData.get("email")     as string
  const password    = formData.get("password")  as string
  const role        = (formData.get("role") as string)?.trim()
  const associationRoleCode = (formData.get("associationRoleCode") as string | null)?.trim() || null
  const phone       = (formData.get("phone") as string | null)?.trim() || ""
  const description = (formData.get("description") as string | null)?.trim() || null
  const showOnSite  = formData.get("showOnSite") !== "false"
  const imageFile   = formData.get("imageFile") as File | null

  if (!firstName || !lastName || !email || !password || !role || !associationRoleCode) {
    return { error: "Tous les champs obligatoires doivent être remplis." }
  }

  const associationRoleId = await getRoleIdByCode(prisma, associationRoleCode)
  if (!associationRoleId) {
    return { error: "Rôle association invalide." }
  }

  // 1. Créer le compte User (Better Auth)
  let createdUserId: string
  try {
    const created = await auth.api.createUser({
      body: { name: `${firstName} ${lastName}`, email, password, role: role as "admin" | "user" },
      headers: await headers(),
    })
    createdUserId = created.user.id
  } catch (err) {
    console.error("[createUser] Erreur Better Auth:", err)
    return { error: "Un compte avec cet email existe déjà." }
  }

  // 2. Créer la Person + TeamMember (avec rollback User si échec)
  try {
    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/users")
      imageUrl = result.url
    }

    const person = await prisma.person.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        userId: createdUserId,
        image: imageUrl,
        description,
        showOnSite,
        roleId: associationRoleId,
      },
    })

    await prisma.teamMember.create({
      data: { personId: person.id },
    })

    revalidatePath("/bureau/membres")
    revalidatePath("/bureau/equipe")
    return { success: true as const }
  } catch (err) {
    console.error("[createUser] Erreur Prisma:", err)
    try {
      await auth.api.removeUser({ body: { userId: createdUserId }, headers: await headers() })
    } catch { /* rollback non-bloquant */ }
    return { error: "Erreur lors de la création du compte. Vérifiez les données saisies." }
  }
}

// ── Modifier un utilisateur ────────────────────────────────────────────────────

export async function updateUser(userId: string, formData: FormData) {
  try { await requireAdmin() } catch {
    return { error: "Accès réservé aux administrateurs." }
  }

  const firstName   = formData.get("firstName") as string
  const lastName    = formData.get("lastName")  as string
  const role        = (formData.get("role") as string)?.trim()
  const associationRoleCode = (formData.get("associationRoleCode") as string | null)?.trim() || null
  const phone       = (formData.get("phone") as string | null)?.trim() || ""
  const description = (formData.get("description") as string | null)?.trim() || null
  const showOnSite  = formData.get("showOnSite") !== "false"
  const imageFile   = formData.get("imageFile") as File | null

  if (!userId || !firstName || !lastName || !role || !associationRoleCode) {
    return { error: "Tous les champs obligatoires doivent être remplis." }
  }

  const associationRoleId = await getRoleIdByCode(prisma, associationRoleCode)
  if (!associationRoleId) {
    return { error: "Rôle association invalide." }
  }

  try {
    // 1. Mettre à jour le nom + rôle dans Better Auth
    await auth.api.setRole({
      body: { userId, role: role as "admin" | "user" },
      headers: await headers(),
    })
    await prisma.user.update({
      where: { id: userId },
      data: { name: `${firstName} ${lastName}` },
    })

    // 2. Mettre à jour (ou créer) la Person liée
    let imageUrl: string | null | undefined = undefined
    if (imageFile && imageFile.size > 0) {
      const result = await uploadImage(imageFile, "gam/users")
      imageUrl = result.url
    }

    const existingPerson = await prisma.person.findUnique({ where: { userId } })
    let personId: string

    if (existingPerson) {
      await prisma.person.update({
        where: { userId },
        data: {
          firstName,
          lastName,
          phone,
          description,
          showOnSite,
          roleId: associationRoleId,
          ...(imageUrl !== undefined ? { image: imageUrl } : {}),
        },
      })
      personId = existingPerson.id
    } else {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      const newPerson = await prisma.person.create({
        data: {
          firstName,
          lastName,
          email: user?.email ?? "",
          phone,
          userId,
          description,
          showOnSite,
          image: imageUrl ?? null,
          roleId: associationRoleId,
        },
      })
      personId = newPerson.id
    }

    // 3. Ligne TeamMember si compte bureau (rôle métier = Person.role)
    const existingTm = await prisma.teamMember.findUnique({ where: { personId } })
    if (!existingTm) {
      await prisma.teamMember.create({ data: { personId } })
    }

    if (imageUrl !== undefined) {
      await deleteSupersededCloudinaryUrl({
        previousUrl: existingPerson?.image,
        nextUrl: imageUrl ?? null,
      })
    }

    revalidatePath("/bureau/membres")
    revalidatePath("/bureau/equipe")
    return { success: true as const }
  } catch (err) {
    console.error("[updateUser] Erreur:", err)
    return { error: "Erreur lors de la mise à jour. Vérifiez les données saisies." }
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
    // Supprimer le TeamMember et la Person liés si ils existent
    const person = await prisma.person.findUnique({ where: { userId } })
    if (person) {
      await prisma.teamMember.deleteMany({ where: { personId: person.id } })
      await prisma.person.delete({ where: { id: person.id } })
    }

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

// ── Lister les bénévoles (table `volunteers`) ────────────────────────────────

export async function listBenevoles() {
  await requireBureau()
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: "desc" },
    select: { personId: true },
  })

  const personIds = volunteers.map((v) => v.personId)
  if (personIds.length === 0) return []

  const persons = await prisma.person.findMany({
    where: { id: { in: personIds } },
  })

  const personsById = Object.fromEntries(persons.map((p) => [p.id, p]))
  return personIds
    .map((id) => personsById[id] ?? null)
    .filter((p): p is NonNullable<typeof p> => p != null)
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

    const volunteerRoleId = await getRoleIdByCode(prisma, "VOLUNTEER")
    if (!volunteerRoleId) {
      return { error: "Configuration des rôles incomplète (VOLUNTEER manquant)." }
    }

    await prisma.person.create({
      data: {
        firstName,
        lastName,
        email:      email || null,
        phone,
        roleId:     volunteerRoleId,
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

    if (imageUrl !== undefined) {
      await deleteSupersededCloudinaryUrl({
        previousUrl: existing.image,
        nextUrl: imageUrl ?? null,
      })
    }

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
    const existing = await prisma.person.findUnique({
      where: { id: personId },
      select: { image: true },
    })
    await prisma.person.delete({ where: { id: personId } })
    if (existing?.image) {
      await deleteSupersededCloudinaryUrl({
        previousUrl: existing.image,
        nextUrl: null,
      })
    }
    revalidatePath("/bureau/membres")
    return { success: true as const }
  } catch {
    return { error: "Erreur lors de la suppression du bénévole." }
  }
}
