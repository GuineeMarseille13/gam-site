import { z } from "zod"

/** Paramètre d’URL ?annee=YYYY pour filtrer les adhérents ayant au moins une cotisation cette année-là */
export const adherentYearQuerySchema = z
  .string()
  .regex(/^\d{4}$/, "Format année attendu : AAAA")
  .transform((s) => Number.parseInt(s, 10))
  .pipe(z.number().int().min(2000).max(2100))
