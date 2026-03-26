"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AvatarUploadSiteVisibilityProps {
  showOnSite: boolean
  onCheckedChange: (value: boolean) => void
  visibilitySubLabel?: string
  /** Couleur du rail « coché » : Administration (sky) vs défaut (primary). */
  administrationChrome?: boolean
}

/**
 * Toggle + champ caché `showOnSite` — isolé pour éviter que le bundler
 * ne retire l’import de `Switch` alors que le JSX y fait encore référence
 * (chunk partagé avec des parents comme le formulaire administration).
 */
export function AvatarUploadSiteVisibility({
  showOnSite,
  onCheckedChange,
  visibilitySubLabel,
  administrationChrome = false,
}: AvatarUploadSiteVisibilityProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Switch
        id="showOnSite"
        checked={showOnSite}
        onCheckedChange={onCheckedChange}
        className={cn(
          administrationChrome &&
            "data-[state=checked]:bg-sky-600 dark:data-[state=checked]:bg-sky-500",
        )}
      />
      <input type="hidden" name="showOnSite" value={showOnSite ? "true" : "false"} />
      <div>
        <Label
          htmlFor="showOnSite"
          className="cursor-pointer select-none text-xs text-muted-foreground"
        >
          Afficher sur le site
        </Label>
        {visibilitySubLabel && (
          <p className="text-[10px] leading-tight text-muted-foreground/60">{visibilitySubLabel}</p>
        )}
      </div>
    </div>
  )
}
