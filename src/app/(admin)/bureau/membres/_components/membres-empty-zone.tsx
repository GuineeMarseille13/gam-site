import type { ComponentType } from "react"
import type { IconProps } from "@tabler/icons-react"

interface MembresEmptyZoneProps {
  Icon: ComponentType<IconProps>
  title: string
  description: string
}

/** Zone en pointillés lorsqu'une section n'a aucune entrée. */
export function MembresEmptyZone({ Icon, title, description }: MembresEmptyZoneProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/20 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60">
        <Icon className="size-5 text-muted-foreground/50" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
