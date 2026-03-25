import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | GAM",
    default: "Espace réservé | GAM",
  },
  robots: { index: false, follow: false },
}

/**
 * Groupe de routes back-office : enfants définissent le shell (Bureau ou Administration).
 */
export default function AdminRoutesLayout({ children }: { children: React.ReactNode }) {
  return children
}
