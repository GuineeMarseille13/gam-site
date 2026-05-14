/**
 * Ligne rapport telle que chargée côté bureau (sous-ensemble Prisma).
 */
export interface BureauActivityReportRow {
  id: string
  year: number
  label: string | null
  pdfUrl: string
  /** Affiché sur la page publique « Notre association ». */
  isPublished: boolean
}
