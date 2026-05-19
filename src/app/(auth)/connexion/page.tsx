"use client"

import { Suspense } from "react"
import { AuthLoginView } from "@/components/auth/auth-login-view"

function ConnexionContent() {
  return (
    <AuthLoginView
      accessTarget="bureau"
      defaultRedirect="/bureau"
      title="Bureau GAM"
      description="Connectez-vous pour accéder au dashboard"
      footnote="Accès réservé aux membres du bureau GAM"
      unauthorizedMessage="Ce compte n’a pas accès à l’espace Bureau GAM. Si vous êtes permanent(e) administrative, utilisez la connexion Administration ci-dessous."
      haloClassName="bg-amber-400/10"
      submitButtonClassName="bg-amber-500 text-white shadow-md shadow-amber-500/20 hover:bg-amber-600"
      alternateLinks={[
        { href: "/connexion-administration", label: "Connexion Administration →" },
        {
          href: "/connexion-hebergement-relation",
          label: "Connexion Hébergement & relation →",
        },
      ]}
    />
  )
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ConnexionContent />
    </Suspense>
  )
}
