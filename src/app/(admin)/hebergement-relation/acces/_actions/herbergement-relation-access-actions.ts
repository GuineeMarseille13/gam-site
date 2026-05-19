"use server"

import { HERBERGEMENT_RELATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { createDashboardAccessActions } from "@/app/(admin)/_shared/dashboard-access/_actions/create-dashboard-access-actions"

const {
  createAccess,
  updateAccess,
  banAccess,
  unbanAccess,
  revokeAccess,
} = createDashboardAccessActions(HERBERGEMENT_RELATION_ACCESS_SCOPE)

export async function createHerbergementRelationAccess(
  formData: FormData,
): ReturnType<typeof createAccess> {
  return createAccess(formData)
}

export async function updateHerbergementRelationAccess(
  userId: string,
  formData: FormData,
): ReturnType<typeof updateAccess> {
  return updateAccess(userId, formData)
}

export async function banHerbergementRelationAccess(
  userId: string,
): ReturnType<typeof banAccess> {
  return banAccess(userId)
}

export async function unbanHerbergementRelationAccess(
  userId: string,
): ReturnType<typeof unbanAccess> {
  return unbanAccess(userId)
}

export async function revokeHerbergementRelationAccess(
  userId: string,
): ReturnType<typeof revokeAccess> {
  return revokeAccess(userId)
}
