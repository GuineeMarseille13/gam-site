"use client"

import { createContext, useContext } from "react"
import type { DashboardPermissions } from "@/config/dashboard-permissions"

const DashboardPermissionsContext = createContext<DashboardPermissions | null>(null)

interface DashboardPermissionsProviderProps {
  permissions: DashboardPermissions
  children: React.ReactNode
}

/**
 * Fournit les permissions dashboard aux composants client (sidebar, gates, etc.).
 */
export function DashboardPermissionsProvider({
  permissions,
  children,
}: DashboardPermissionsProviderProps) {
  return (
    <DashboardPermissionsContext.Provider value={permissions}>
      {children}
    </DashboardPermissionsContext.Provider>
  )
}

export function useDashboardPermissions(): DashboardPermissions {
  const value = useContext(DashboardPermissionsContext)
  if (!value) {
    throw new Error(
      "useDashboardPermissions doit être utilisé dans DashboardPermissionsProvider",
    )
  }
  return value
}

export function useDashboardPermissionsOptional(): DashboardPermissions | null {
  return useContext(DashboardPermissionsContext)
}
