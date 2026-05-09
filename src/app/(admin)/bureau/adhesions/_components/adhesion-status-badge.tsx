import { Badge } from "@/components/ui/badge"

export function AdhesionStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "border-emerald-200 bg-emerald-100 text-emerald-700"
          : "border-gray-200 bg-gray-100 text-gray-500"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  )
}
