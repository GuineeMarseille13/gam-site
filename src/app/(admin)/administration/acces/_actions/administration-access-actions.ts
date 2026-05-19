"use server"

import { ADMINISTRATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { createDashboardAccessActions } from "@/app/(admin)/_shared/dashboard-access/_actions/create-dashboard-access-actions"

const {
  createAccess,
  updateAccess,
  banAccess,
  unbanAccess,
  revokeAccess,
} = createDashboardAccessActions(ADMINISTRATION_ACCESS_SCOPE)

export async function createAdministrationAccess(
  formData: FormData,
): ReturnType<typeof createAccess> {
  return createAccess(formData)
}

export async function updateAdministrationAccess(
  userId: string,
  formData: FormData,
): ReturnType<typeof updateAccess> {
  return updateAccess(userId, formData)
}

export async function banAdministrationAccess(userId: string): ReturnType<typeof banAccess> {
  return banAccess(userId)
}

export async function unbanAdministrationAccess(userId: string): ReturnType<typeof unbanAccess> {
  return unbanAccess(userId)
}

export async function revokeAdministrationAccess(userId: string): ReturnType<typeof revokeAccess> {
  return revokeAccess(userId)
}
