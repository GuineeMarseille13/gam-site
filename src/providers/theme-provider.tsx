"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { DASHBOARD_THEME_STORAGE_KEY } from "@/config/dashboard-theme"
import { isDashboardThemeRoute } from "@/lib/dashboard-theme-routes"

interface ThemeProviderProps {
  children: React.ReactNode
}

/**
 * Thème global : clair imposé hors dashboards (site public, auth, etc.).
 * Sur `/bureau` et `/administration` : préférence persistée (clair / sombre / système).
 * `attribute="class"` sur &lt;html&gt; — aligné avec Tailwind `dark:`.
 */
const LEGACY_THEME_STORAGE_KEY = "gam-ui-theme"

export function ThemeProvider({ children }: ThemeProviderProps) {
  const pathname = usePathname()
  const isDashboard = isDashboardThemeRoute(pathname)

  React.useEffect(() => {
    try {
      const legacy = localStorage.getItem(LEGACY_THEME_STORAGE_KEY)
      if (
        legacy &&
        localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY) == null
      ) {
        localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, legacy)
      }
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={isDashboard}
      forcedTheme={isDashboard ? undefined : "light"}
      disableTransitionOnChange
      storageKey={DASHBOARD_THEME_STORAGE_KEY}
    >
      {children}
    </NextThemesProvider>
  )
}
