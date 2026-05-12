import { Badge } from "@/components/ui/badge"
import { COMMANDE_STATUS_CONFIG } from "../_utils/commande-display"

interface CommandeStatusBadgeProps {
  readonly paymentStatus: string | undefined
}

export function CommandeStatusBadge({ paymentStatus }: CommandeStatusBadgeProps) {
  const s = COMMANDE_STATUS_CONFIG[paymentStatus ?? ""]
  return (
    <Badge
      variant="outline"
      className={`text-xs ${s?.className ?? "border-gray-200 bg-gray-100 text-gray-500"}`}
    >
      {s?.label ?? "—"}
    </Badge>
  )
}
