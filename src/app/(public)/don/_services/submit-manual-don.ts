import { manualDonPayloadSchema, type ManualDonPayload } from "../_schemas/don.schema"
import type { SaveManualDonResult } from "./save-manual-don"

/**
 * Enregistre un don manuel via l’API bureau (espèces / virement).
 */
export async function submitManualDon(payload: ManualDonPayload): Promise<SaveManualDonResult> {
  const validatedPayload = manualDonPayloadSchema.parse(payload)

  const res = await fetch("/api/bureau/dons/manual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validatedPayload),
  })

  const json: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      typeof json === "object" && json !== null && "error" in json
        ? String((json as { error?: unknown }).error ?? "")
        : ""
    throw new Error(message || "Erreur lors de l'enregistrement du don")
  }

  if (
    typeof json !== "object" ||
    json === null ||
    !("success" in json) ||
    (json as { success?: boolean }).success !== true ||
    !("data" in json)
  ) {
    throw new Error("Réponse invalide du serveur")
  }

  return (json as { data: SaveManualDonResult }).data
}
