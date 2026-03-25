"use client"

import { Suspense } from "react"
import { AuthLoginView } from "@/components/auth/auth-login-view"

function ConnexionAdministrationContent() {
  return (
    <AuthLoginView
      defaultRedirect="/administration"
      title="Administration"
      description="Connectez-vous pour accéder au dashboard Administration"
      footnote="Rôles autorisés : administrateur, bureau et administration"
      haloClassName="bg-sky-400/10"
      submitButtonClassName="bg-sky-600 text-white shadow-md shadow-sky-500/20 hover:bg-sky-700"
      alternateLink={{
        href: "/connexion",
        label: "Connexion au bureau administratif →",
      }}
    />
  )
}

export default function ConnexionAdministrationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ConnexionAdministrationContent />
    </Suspense>
  )
}
