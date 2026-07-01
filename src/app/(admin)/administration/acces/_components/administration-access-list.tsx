"use client"

import { ADMINISTRATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { DashboardAccessList } from "@/app/(admin)/_shared/dashboard-access/_components/dashboard-access-list"
import type { AdministrationAccessRow } from "../_schemas/administration-access.schema"
import {
  banAdministrationAccess,
  revokeAdministrationAccess,
  unbanAdministrationAccess,
} from "../_actions/administration-access-actions"

interface AdministrationAccessListProps {
  rows: AdministrationAccessRow[]
  roleLabels: Record<string, string>
  isAdmin: boolean
  currentUserId: string
  showEmptyState?: boolean
}

/**
 * Liste des accès administration (wrapper du module partagé).
 */
export function AdministrationAccessList({
  showEmptyState = true,
  ...props
}: AdministrationAccessListProps) {
  return (
    <DashboardAccessList
      scope={ADMINISTRATION_ACCESS_SCOPE}
      actions={{
        banAccess: banAdministrationAccess,
        unbanAccess: unbanAdministrationAccess,
        revokeAccess: revokeAdministrationAccess,
      }}
      showEmptyState={showEmptyState}
      {...props}
    />
  )
}
