"use client"

import * as React from "react"
import { QueryProvider } from "@/providers/QueryProvider"
import { ThemeProvider } from "@/providers/theme-provider"

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * Providers racine : thème (next-themes) puis TanStack Query.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  )
}
