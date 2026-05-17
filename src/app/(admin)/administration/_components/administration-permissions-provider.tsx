"use client"

import { createContext, useContext } from "react"
import type { DashboardPermissions } from "@/config/dashboard-permissions"

const AdministrationPermissionsContext = createContext<DashboardPermissions | null>(null)

interface AdministrationPermissionsProviderProps {
  permissions: DashboardPermissions
  children: React.ReactNode
}

/**
 * Expose les permissions Administration aux composants client.
 */
export function AdministrationPermissionsProvider({
  permissions,
  children,
}: AdministrationPermissionsProviderProps) {
  return (
    <AdministrationPermissionsContext.Provider value={permissions}>
      {children}
    </AdministrationPermissionsContext.Provider>
  )
}

export function useAdministrationPermissions(): DashboardPermissions {
  const value = useContext(AdministrationPermissionsContext)
  if (!value) {
    throw new Error(
      "useAdministrationPermissions doit être utilisé dans AdministrationPermissionsProvider",
    )
  }
  return value
}

export function useAdministrationPermissionsOptional(): DashboardPermissions | null {
  return useContext(AdministrationPermissionsContext)
}
