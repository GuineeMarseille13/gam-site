"use server"

import {
  mutateChangeOwnPassword,
  mutateUpdateProfil,
} from "../_services/profil-mutations"

/** Mise à jour du profil — espace Bureau. */
export async function updateProfilBureau(formData: FormData) {
  return mutateUpdateProfil(formData, "bureau")
}

/** Mise à jour du profil — espace Administration. */
export async function updateProfilAdministration(formData: FormData) {
  return mutateUpdateProfil(formData, "administration")
}

/** Mise à jour du profil — espace Hébergement et mise en relation. */
export async function updateProfilHerbergementRelation(formData: FormData) {
  return mutateUpdateProfil(formData, "hebergement-relation")
}

/** Changement de mot de passe — espace Bureau. */
export async function changeOwnPasswordBureau(currentPassword: string, newPassword: string) {
  return mutateChangeOwnPassword(currentPassword, newPassword, "bureau")
}

/** Changement de mot de passe — espace Administration. */
export async function changeOwnPasswordAdministration(
  currentPassword: string,
  newPassword: string,
) {
  return mutateChangeOwnPassword(currentPassword, newPassword, "administration")
}

/** Changement de mot de passe — espace Hébergement et mise en relation. */
export async function changeOwnPasswordHerbergementRelation(
  currentPassword: string,
  newPassword: string,
) {
  return mutateChangeOwnPassword(currentPassword, newPassword, "hebergement-relation")
}
