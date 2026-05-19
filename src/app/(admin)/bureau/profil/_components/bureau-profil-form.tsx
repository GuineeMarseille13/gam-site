"use client"

import { ProfilForm } from "./profil-form"
import {
  changeOwnPasswordBureau,
  updateProfil,
} from "@/app/(admin)/_shared/profile/_actions/profil-actions"

interface BureauProfilFormProps {
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

/** Formulaire profil Bureau — Server Actions importées côté client. */
export function BureauProfilForm({ defaultValues }: BureauProfilFormProps) {
  return (
    <ProfilForm
      defaultValues={defaultValues}
      cancelHref="/bureau"
      updateAction={updateProfil}
      changePasswordAction={changeOwnPasswordBureau}
    />
  )
}
