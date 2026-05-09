/**
 * Référence de paiement tronquée avec titre complet au survol.
 */
export function AdhesionPaymentRef({
  paymentReference,
}: {
  paymentReference?: string | null
}) {
  if (!paymentReference) {
    return <span className="text-muted-foreground">—</span>
  }
  const shortened = `${paymentReference.slice(0, 20)}…`
  return (
    <span className="font-mono text-xs text-muted-foreground" title={paymentReference}>
      {shortened}
    </span>
  )
}
