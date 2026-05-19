"use client"

import type { DashboardPermissions } from "@/config/dashboard-permissions"
import { useAdministrationPermissions } from "@/app/(admin)/administration/_components/administration-permissions-provider"
import { useBureauPermissions } from "@/app/(admin)/bureau/_components/bureau-permissions-provider"
import { useHerbergementRelationPermissions } from "@/app/(admin)/hebergement-relation/_components/hebergement-relation-permissions-provider"

interface PermissionGateProps {
  allow: (permissions: DashboardPermissions) => boolean
  children: React.ReactNode
}

/**
 * Affiche les enfants uniquement si la capacité Bureau est accordée (session courante).
 */
export function BureauPermissionGate({ allow, children }: PermissionGateProps) {
  const permissions = useBureauPermissions()
  if (!allow(permissions)) return null
  return children
}

/**
 * Affiche les enfants uniquement si la capacité Administration est accordée.
 */
export function AdministrationPermissionGate({ allow, children }: PermissionGateProps) {
  const permissions = useAdministrationPermissions()
  if (!allow(permissions)) return null
  return children
}

/**
 * Affiche les enfants uniquement si la capacité Hébergement est accordée.
 */
export function HerbergementRelationPermissionGate({ allow, children }: PermissionGateProps) {
  const permissions = useHerbergementRelationPermissions()
  if (!allow(permissions)) return null
  return children
}
