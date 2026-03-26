import { permanentRedirect } from "next/navigation"

/**
 * Ancienne URL : redirection vers la route renommée.
 */
export default function SuiviPermanenceConfigurationLegacyRedirect() {
  permanentRedirect("/administration/demande-beneficiaire/configuration")
}
