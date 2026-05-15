import { formatAdhesionPaymentMethodLabel } from "../_utils/adhesion-display"

interface AdhesionPaymentRefProps {
  readonly paymentMethod?: string | null
  readonly paymentReference?: string | null
}

/**
 * Mode de règlement + référence technique (tronquée, titre au survol).
 */
export function AdhesionPaymentRef({
  paymentMethod,
  paymentReference,
}: AdhesionPaymentRefProps) {
  const methodLabel = formatAdhesionPaymentMethodLabel(paymentMethod)

  if (methodLabel === "—" && !paymentReference) {
    return <span className="text-muted-foreground">—</span>
  }

  const shortenedReference = paymentReference
    ? `${paymentReference.slice(0, 18)}…`
    : null

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-sm font-medium text-foreground">{methodLabel}</span>
      {paymentReference ? (
        <span
          className="truncate font-mono text-xs text-muted-foreground"
          title={paymentReference}
        >
          {shortenedReference}
        </span>
      ) : null}
    </div>
  )
}
