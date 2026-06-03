import { apiGet } from "@/lib/api/client"
import { activityReportsPublicListSchema } from "../_schemas/activity-report-public.schema"

const ENDPOINT = "/report-activities"

/**
 * Charge les rapports d'activité pour le site public (GET JSON + validation Zod).
 */
export async function fetchActivityReportsPublic(): Promise<
  ReturnType<typeof activityReportsPublicListSchema.parse>
> {
  const data = await apiGet<unknown[]>(ENDPOINT, {
    where: { isPublished: true },
    orderBy: { year: "desc" },
    select: { id: true, year: true, label: true },
  })
  return activityReportsPublicListSchema.parse(data)
}
