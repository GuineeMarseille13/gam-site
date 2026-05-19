"use client"

import { ProfilForm } from "@/app/(admin)/bureau/profil/_components/profil-form"
import {
  changeOwnPasswordHerbergementRelation,
  updateProfil,
} from "@/app/(admin)/_shared/profile/_actions/profil-actions"

interface HerbergementRelationProfilFormProps {
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

/** Formulaire profil Hébergement — Server Actions importées côté client. */
export function HerbergementRelationProfilForm({
  defaultValues,
}: HerbergementRelationProfilFormProps) {
  return (
    <ProfilForm
      defaultValues={defaultValues}
      cancelHref="/hebergement-relation"
      updateAction={updateProfil}
      changePasswordAction={changeOwnPasswordHerbergementRelation}
    />
  )
}
