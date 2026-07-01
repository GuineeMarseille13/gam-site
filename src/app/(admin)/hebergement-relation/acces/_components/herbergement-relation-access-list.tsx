"use client"

import { HERBERGEMENT_RELATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { DashboardAccessList } from "@/app/(admin)/_shared/dashboard-access/_components/dashboard-access-list"
import type { HerbergementRelationAccessRow } from "../_schemas/herbergement-relation-access.schema"
import {
  banHerbergementRelationAccess,
  revokeHerbergementRelationAccess,
  unbanHerbergementRelationAccess,
} from "../_actions/herbergement-relation-access-actions"

interface HerbergementRelationAccessListProps {
  rows: HerbergementRelationAccessRow[]
  roleLabels: Record<string, string>
  isAdmin: boolean
  currentUserId: string
  showEmptyState?: boolean
}

/**
 * Liste des accès hébergement (wrapper du module partagé).
 */
export function HerbergementRelationAccessList({
  showEmptyState = true,
  ...props
}: HerbergementRelationAccessListProps) {
  return (
    <DashboardAccessList
      scope={HERBERGEMENT_RELATION_ACCESS_SCOPE}
      actions={{
        banAccess: banHerbergementRelationAccess,
        unbanAccess: unbanHerbergementRelationAccess,
        revokeAccess: revokeHerbergementRelationAccess,
      }}
      showEmptyState={showEmptyState}
      {...props}
    />
  )
}
