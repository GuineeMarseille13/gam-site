import { MISE_EN_RELATION_POLE_SLUG } from "@/config/pole-public-slugs"
import {
  DASHBOARD_CAPABILITY,
  hasDashboardCapability,
} from "@/config/dashboard-permissions"

export function sessionCanAccessBureauContenu(role: string | null | undefined): boolean {
  return hasDashboardCapability(role, DASHBOARD_CAPABILITY.bureauContenu)
}

export function sessionCanAccessHerbergementContenu(
  role: string | null | undefined,
): boolean {
  return hasDashboardCapability(role, DASHBOARD_CAPABILITY.hebergementContenu)
}

/** Contenu public du pôle `mise-en-relation` (Bureau ou dashboard dédié). */
export function sessionCanAccessMiseEnRelationPoleContent(
  role: string | null | undefined,
): boolean {
  return (
    sessionCanAccessBureauContenu(role) || sessionCanAccessHerbergementContenu(role)
  )
}

/** API `/api/bureau/poles/[poleSlug]/*` — Bureau ou Hébergement selon le slug. */
export function sessionCanAccessPoleApi(
  role: string | null | undefined,
  poleSlug: string,
): boolean {
  if (poleSlug === MISE_EN_RELATION_POLE_SLUG) {
    return sessionCanAccessMiseEnRelationPoleContent(role)
  }
  return sessionCanAccessBureauContenu(role)
}

export function sessionCanAccessBureauPaiements(role: string | null | undefined): boolean {
  return hasDashboardCapability(role, DASHBOARD_CAPABILITY.bureauPaiements)
}

export function sessionCanAccessBureauAdminAdherents(
  role: string | null | undefined,
): boolean {
  return hasDashboardCapability(role, DASHBOARD_CAPABILITY.bureauAdminAdherents)
}

export function sessionCanAccessBureauAdminMembres(
  role: string | null | undefined,
): boolean {
  return hasDashboardCapability(role, DASHBOARD_CAPABILITY.bureauAdminMembres)
}
