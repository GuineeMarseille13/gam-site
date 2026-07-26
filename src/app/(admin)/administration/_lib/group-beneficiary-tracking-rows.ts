import { buildBeneficiaryIdentityKey } from "./beneficiary-identity-key"
import {
  beneficiaryTrackingListGroupSchema,
  type BeneficiaryTrackingListGroup,
  type BeneficiaryTrackingListRow,
} from "../_schemas/beneficiary-tracking.schema"

interface TrackingRowForGrouping extends BeneficiaryTrackingListRow {
  birthDate: string | null
}

/**
 * Regroupe les fiches par identité soft (plus récent en premier dans chaque groupe).
 * L’ordre des groupes suit la fiche la plus récente de chaque bénéficiaire.
 */
export function groupBeneficiaryTrackingRows(
  rows: TrackingRowForGrouping[],
): BeneficiaryTrackingListGroup[] {
  const buckets = new Map<string, TrackingRowForGrouping[]>()

  for (const row of rows) {
    const key = buildBeneficiaryIdentityKey({
      firstName: row.firstName,
      lastName: row.lastName,
      birthDate: row.birthDate,
      phone: row.phone,
    })
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.push(row)
      continue
    }
    buckets.set(key, [row])
  }

  const groups: BeneficiaryTrackingListGroup[] = []

  // Insertion Map = 1ère occurrence dans `rows` déjà triés desc → ordre « plus récent ».
  for (const [identityKey, fiches] of buckets) {
    const sorted = [...fiches].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const latest = sorted[0]
    if (!latest) continue

    const demandTypeLabels = [
      ...new Set(sorted.flatMap((f) => f.demandTypeLabels)),
    ].sort((a, b) => a.localeCompare(b, "fr"))

    groups.push(
      beneficiaryTrackingListGroupSchema.parse({
        identityKey,
        latestFicheId: latest.id,
        firstName: latest.firstName,
        lastName: latest.lastName,
        ficheCount: sorted.length,
        latestPermanenceDate: latest.permanenceDate,
        demandTypeLabels,
        latestRequestStatus: latest.requestStatus,
        latestRequestStatusLabel: latest.requestStatusLabel,
        latestAssignedResponsibleName: latest.assignedResponsibleName,
      }),
    )
  }

  return groups
}
