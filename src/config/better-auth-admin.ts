import {
  adminAc,
  defaultAc,
  userAc,
} from "better-auth/plugins/admin/access"
import type { Role } from "better-auth/plugins/access"
/**
 * Lecture seule des comptes (liste membres) — aligné avec `requireBureau()`.
 */
const bureauReadAc = defaultAc.newRole({
  user: ["list", "get"],
  session: [],
})

/** Permissions complètes admin Better Auth — aligné avec `requireAdmin()`. */
const superAdminAc = adminAc

const noAdminAc = userAc

/**
 * Rôles Better Auth (plugin admin) : clés = valeurs `User.role` en base.
 * Obligatoire pour `auth.api.createUser`, `banUser`, `listUsers`, etc.
 */
export const betterAuthAdminRoles: Record<string, Role> = {
  "SUPER-ADMIN": superAdminAc,
  BUREAU: bureauReadAc,
  "INVITE-BUREAU": noAdminAc,
  "ADMIN-PERMADMIN": noAdminAc,
  PERMADMIN: noAdminAc,
  "INVITE-PERMADMIN": noAdminAc,
  admin: superAdminAc,
  user: noAdminAc,
}

export const betterAuthAdminPluginOptions = {
  defaultRole: "BUREAU",
  adminRoles: ["SUPER-ADMIN", "admin"] as string[],
  roles: betterAuthAdminRoles,
}
