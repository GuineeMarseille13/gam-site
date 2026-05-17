import {
  DASHBOARD_CAPABILITY,
  hasDashboardCapability,
} from "@/config/dashboard-permissions"

export function sessionCanAccessBureauContenu(role: string | null | undefined): boolean {
  return hasDashboardCapability(role, DASHBOARD_CAPABILITY.bureauContenu)
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
