"use client"

import { createContext, useContext } from "react"
import type { DashboardPermissions } from "@/config/dashboard-permissions"

const BureauPermissionsContext = createContext<DashboardPermissions | null>(null)

interface BureauPermissionsProviderProps {
  permissions: DashboardPermissions
  children: React.ReactNode
}

/**
 * Expose les permissions bureau aux composants client (sidebar, actions, etc.).
 */
export function BureauPermissionsProvider({
  permissions,
  children,
}: BureauPermissionsProviderProps) {
  return (
    <BureauPermissionsContext.Provider value={permissions}>
      {children}
    </BureauPermissionsContext.Provider>
  )
}

/** Permissions bureau de la session courante (fournies par le layout). */
export function useBureauPermissions(): DashboardPermissions {
  const value = useContext(BureauPermissionsContext)
  if (!value) {
    throw new Error("useBureauPermissions doit être utilisé dans BureauPermissionsProvider")
  }
  return value
}

/** Variante sans erreur hors layout Bureau (ex. composants partagés Administration). */
export function useBureauPermissionsOptional(): DashboardPermissions | null {
  return useContext(BureauPermissionsContext)
}
