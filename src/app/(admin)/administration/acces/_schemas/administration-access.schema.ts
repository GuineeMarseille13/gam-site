import { z } from "zod"
import { ADMINISTRATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"
import { permanenceAdminRoleCodeSchema } from "./permanence-admin-role.schema"

export const administrationAccessRowSchema = ADMINISTRATION_ACCESS_SCOPE.schemas.rowSchema
export type AdministrationAccessRow = z.infer<typeof administrationAccessRowSchema>

export const createAdministrationAccessSchema = ADMINISTRATION_ACCESS_SCOPE.schemas.createSchema
export const updateAdministrationAccessSchema = ADMINISTRATION_ACCESS_SCOPE.schemas.updateSchema

export { permanenceAdminRoleCodeSchema }
