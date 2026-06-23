import sanitizeHtml from "sanitize-html";

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const ASSOCIATION_ALLOWED_TAGS = ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li"] as const;

/**
 * Indique si le contenu est du HTML (vs texte brut legacy).
 */
export function isAssociationHtmlContent(text: string): boolean {
  return HTML_TAG_PATTERN.test(text.trim());
}

/**
 * Nettoie le HTML association (balises limitées, sans attributs).
 */
export function sanitizeAssociationHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...ASSOCIATION_ALLOWED_TAGS],
    allowedAttributes: {},
  }).trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Convertit l'ancien format texte (`**gras**`, paragraphes par ligne vide) en HTML TipTap.
 */
export function legacyAssociationTextToHtml(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";

  if (isAssociationHtmlContent(trimmed)) {
    return sanitizeAssociationHtml(trimmed);
  }

  const paragraphs = trimmed
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return paragraphs
    .map((paragraph) => {
      const withBold = escapeHtml(paragraph).replace(
        /\*\*([^*]+)\*\*/g,
        "<strong>$1</strong>",
      );
      return `<p>${withBold}</p>`;
    })
    .join("");
}

/**
 * Prépare le contenu pour l'éditeur riche (HTML propre).
 */
export function normalizeAssociationContentForEditor(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return legacyAssociationTextToHtml(trimmed);
}

/**
 * Longueur du texte visible (hors balises HTML).
 */
export function getAssociationPlainTextLength(htmlOrText: string): number {
  const trimmed = htmlOrText.trim();
  if (!trimmed) return 0;

  if (isAssociationHtmlContent(trimmed)) {
    const sanitized = sanitizeAssociationHtml(trimmed);
    return sanitized
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim().length;
  }

  return trimmed.length;
}

/**
 * Vérifie si le contenu est vide une fois nettoyé.
 */
export function isAssociationContentEmpty(htmlOrText: string): boolean {
  return getAssociationPlainTextLength(htmlOrText) === 0;
}
