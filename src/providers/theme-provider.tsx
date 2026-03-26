"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
}

/**
 * Thème global clair / sombre / système.
 * `attribute="class"` sur &lt;html&gt; — cohérent avec les utilitaires Tailwind `dark:`.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="gam-ui-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
