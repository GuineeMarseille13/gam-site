import { z } from "zod";

import { contactFormSchema, type ContactFormPayload } from "../_schemas/contact.schema";

const submitContactResponseSchema = z.object({ success: z.boolean() }).strict();

/**
 * Service: submitContact
 * Rôle: Envoyer le formulaire de contact via l’API interne /api/contact-submit.
 */
export async function submitContact(payload: ContactFormPayload): Promise<void> {
  const validatedPayload = contactFormSchema.parse(payload);

  const res = await fetch("/api/contact-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validatedPayload),
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      typeof json === "object" && json !== null && "error" in json
        ? String((json as { error?: unknown }).error ?? "")
        : "";
    throw new Error(message || "Erreur lors de l’envoi du message");
  }

  const parsed = submitContactResponseSchema.parse(json);
  if (!parsed.success) {
    throw new Error("Erreur lors de l’envoi du message");
  }
}

