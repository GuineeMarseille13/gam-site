"use client"

import { Suspense } from "react"
import { AuthLoginView } from "@/components/auth/auth-login-view"

function ConnexionHerbergementRelationContent() {
  return (
    <AuthLoginView
      accessTarget="hebergement-relation"
      defaultRedirect="/hebergement-relation"
      title="Hébergement et mise en relation"
      unauthorizedMessage="Ce compte n’a pas accès à cet espace. Utilisez la connexion Bureau ou Administration si vous êtes rattaché(e)."
      description="Connectez-vous pour accéder au dashboard"
      footnote="Page réservée à l’équipe Hébergement et mise en relation"
      haloClassName="bg-emerald-400/10"
      submitButtonClassName="bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700"
      alternateLinks={[
        { href: "/connexion", label: "Connexion Bureau GAM →" },
        { href: "/connexion-administration", label: "Connexion Administration →" },
      ]}
    />
  )
}

export default function ConnexionHerbergementRelationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ConnexionHerbergementRelationContent />
    </Suspense>
  )
}
