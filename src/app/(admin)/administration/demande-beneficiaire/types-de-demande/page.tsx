import { permanentRedirect } from "next/navigation"

/**
 * Ancienne URL : redirection permanente vers la page de paramètres unifiée.
 */
export default function TypesDeDemandeLegacyRedirect() {
  permanentRedirect("/administration/demande-beneficiaire/configuration")
}
