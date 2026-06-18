/**
 * Découpe un texte association en paragraphes (séparés par une ou plusieurs lignes vides).
 */
export function splitAssociationParagraphs(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim()
  if (!normalized) return []

  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean)
}
