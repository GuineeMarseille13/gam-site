/**
 * Ligne liste accès dashboard (structure commune administration / hébergement).
 */
export interface DashboardAccessRow {
  userId: string
  email: string
  name: string
  role: string
  banned: boolean
  createdAt: string
  person: {
    id: string
    firstName: string
    lastName: string
    phone: string
    email?: string | null
    image?: string | null
    profileKind: string
  } | null
}

export type DashboardAccessActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export interface DashboardAccessListActions {
  banAccess: (userId: string) => Promise<DashboardAccessActionResult>
  unbanAccess: (userId: string) => Promise<DashboardAccessActionResult>
  revokeAccess: (userId: string) => Promise<DashboardAccessActionResult>
}
