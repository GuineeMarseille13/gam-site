/**
 * Utilitaires pour la validation et le traitement des URLs vidéo (YouTube, Vimeo).
 */

const YOUTUBE_PATTERNS = [
  /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /^(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
]

const VIMEO_PATTERNS = [
  /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)(?:\/.*)?/,
  /^(?:https?:\/\/)?player\.vimeo\.com\/video\/(\d+)/,
]

export type VideoPlatform = "youtube" | "vimeo"

export interface ParsedVideoUrl {
  platform: VideoPlatform
  id: string
  embedUrl: string
  thumbnailUrl: string
}

/**
 * Valide et parse une URL YouTube ou Vimeo.
 * Retourne null si l'URL n'est pas valide.
 */
export function parseVideoUrl(url: string): ParsedVideoUrl | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  for (const regex of YOUTUBE_PATTERNS) {
    const match = trimmed.match(regex)
    if (match) {
      const id = match[1]
      return {
        platform: "youtube",
        id,
        embedUrl: `https://www.youtube.com/embed/${id}`,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      }
    }
  }

  for (const regex of VIMEO_PATTERNS) {
    const match = trimmed.match(regex)
    if (match) {
      const id = match[1]
      return {
        platform: "vimeo",
        id,
        embedUrl: `https://player.vimeo.com/video/${id}`,
        thumbnailUrl: `https://vumbnail.com/${id}.jpg`,
      }
    }
  }

  return null
}

/**
 * Vérifie si une URL est un lien YouTube ou Vimeo valide.
 */
export function isValidVideoUrl(url: string): boolean {
  return parseVideoUrl(url) !== null
}

/**
 * URL d’intégration pour lecture en lightbox (YouTube nocookie, Vimeo épuré).
 */
export function buildTestimonialEmbedUrl(url: string, origin?: string): string {
  const parsed = parseVideoUrl(url.trim())
  if (!parsed) return url

  if (parsed.platform === "youtube") {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      iv_load_policy: "3",
      cc_load_policy: "0",
    })
    if (origin) params.set("origin", origin)
    return `https://www.youtube-nocookie.com/embed/${parsed.id}?${params.toString()}`
  }

  const vimeoParams = new URLSearchParams({
    autoplay: "1",
    title: "0",
    byline: "0",
    portrait: "0",
  })
  return `${parsed.embedUrl}?${vimeoParams.toString()}`
}

/**
 * Miniature pour carte ou fond ambiant (custom > YouTube/Vimeo > null).
 */
export function getVideoThumbnailUrl(
  url: string,
  customThumbnail?: string | null,
): string | null {
  if (customThumbnail) return customThumbnail
  return parseVideoUrl(url)?.thumbnailUrl ?? null
}
