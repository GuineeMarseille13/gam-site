import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connexion — Administration",
  description:
    "Connexion à l'espace administration GAM — administrateurs, bureau et profils administration",
  robots: { index: false, follow: false },
}

export default function ConnexionAdministrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
