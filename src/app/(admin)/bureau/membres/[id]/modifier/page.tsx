import { redirect } from "next/navigation"

/** Édition d'un accès dashboard — page dédiée `/bureau/acces`. */
export default async function ModifierUtilisateurRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/bureau/acces/${id}/modifier`)
}
