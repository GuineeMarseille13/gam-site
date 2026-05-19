import { z } from "zod"
import { HERBERGEMENT_RELATION_ACCESS_SCOPE } from "@/config/dashboard-access-scope"

export const herbergementRelationAccessRowSchema =
  HERBERGEMENT_RELATION_ACCESS_SCOPE.schemas.rowSchema
export type HerbergementRelationAccessRow = z.infer<typeof herbergementRelationAccessRowSchema>

export const createHerbergementRelationAccessSchema =
  HERBERGEMENT_RELATION_ACCESS_SCOPE.schemas.createSchema
export const updateHerbergementRelationAccessSchema =
  HERBERGEMENT_RELATION_ACCESS_SCOPE.schemas.updateSchema
