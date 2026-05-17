import { redirect } from "next/navigation"

/** Ancienne route « compte d'accès » — redirigée vers la page Accès dédiée. */
export default function NouvelUtilisateurRedirectPage() {
  redirect("/bureau/acces/nouveau")
}
