import type { BenevoleFormInput } from "../_schemas/benevole-form.schema"

/** Extrait les champs texte du formulaire bénévole pour validation Zod. */
export function parseBenevoleFormFields(formData: FormData): BenevoleFormInput {
  return {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    showOnSite: formData.get("showOnSite") !== "false",
    address: String(formData.get("address") ?? "").trim(),
    zipCode: String(formData.get("zipCode") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    country: String(formData.get("country") ?? "France").trim() || "France",
  }
}
