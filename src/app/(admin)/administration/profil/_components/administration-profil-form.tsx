"use client"

import { ProfilForm } from "@/app/(admin)/bureau/profil/_components/profil-form"
import {
  changeOwnPasswordAdministration,
  updateProfil,
} from "@/app/(admin)/_shared/profile/_actions/profil-actions"

interface AdministrationProfilFormProps {
  defaultValues: {
    firstName: string
    lastName: string
    email: string
    phone: string
    role?: string | null
    poste?: string | null
    image?: string | null
  }
}

/**
 * Formulaire profil Administration — importe les Server Actions directement
 * (évite les IDs d’action obsolètes après re-export / HMR).
 */
export function AdministrationProfilForm({ defaultValues }: AdministrationProfilFormProps) {
  return (
    <ProfilForm
      defaultValues={defaultValues}
      cancelHref="/administration"
      updateAction={updateProfil}
      changePasswordAction={changeOwnPasswordAdministration}
    />
  )
}
