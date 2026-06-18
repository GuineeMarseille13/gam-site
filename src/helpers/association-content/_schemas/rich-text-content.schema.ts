import { z } from "zod";

import {
  getAssociationPlainTextLength,
  sanitizeAssociationHtml,
} from "@/lib/format/association-content-format";

interface RichTextFieldOptions {
  min: number;
  max: number;
  minMessage: string;
  maxMessage: string;
}

/**
 * Schéma Zod pour un champ rich text association (HTML sanitisé + limites sur le texte brut).
 */
export function associationRichTextSchema({
  min,
  max,
  minMessage,
  maxMessage,
}: RichTextFieldOptions) {
  return z
    .string()
    .transform((value) => sanitizeAssociationHtml(value))
    .superRefine((value, ctx) => {
      const length = getAssociationPlainTextLength(value);

      if (length < min) {
        ctx.addIssue({ code: "custom", message: minMessage });
      }

      if (length > max) {
        ctx.addIssue({ code: "custom", message: maxMessage });
      }
    });
}
