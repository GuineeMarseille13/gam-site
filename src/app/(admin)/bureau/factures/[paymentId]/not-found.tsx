import Link from "next/link"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"

/**
 * Paiement introuvable ou identifiant invalide pour la facture.
 */
export default function FactureNotFound() {
  return (
    <BureauContent title="Facture introuvable" description="Ce paiement n’existe pas ou n’a pas de données associées.">
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Vérifiez le lien ou ouvrez la facture depuis la liste des dons, adhésions ou commandes.
        </p>
        <Button asChild variant="outline" className="w-fit rounded-xl">
          <Link href="/bureau">Retour au bureau</Link>
        </Button>
      </div>
    </BureauContent>
  )
}
