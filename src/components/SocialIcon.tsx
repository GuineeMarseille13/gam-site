import { SOCIAL_PLATFORM_CONFIG, detectPlatform } from "@/lib/social-media-config"
import { Globe } from "lucide-react"

interface SocialIconProps {
  /** Valeur du champ `icon` en DB (ex: "facebook") */
  icon: string | null
  /** Nom du réseau (fallback si icon est null) */
  name: string
  className?: string
}

/**
 * Icône SVG d'un réseau social.
 * Source unique de vérité pour tous les affichages (contact, footer, etc.)
 */
export function SocialIcon({ icon, name, className = "w-6 h-6" }: SocialIconProps) {
  const platform = detectPlatform(icon, name)

  if (!platform) {
    return <Globe className={className} />
  }

  const { svgPaths } = SOCIAL_PLATFORM_CONFIG[platform]

  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {svgPaths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}
