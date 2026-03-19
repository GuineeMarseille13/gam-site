"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconAlertCircle, IconLoader2, IconEye, IconEyeOff } from "@tabler/icons-react"
import { createUser, updateUser } from "../_actions/actions"
import { DASHBOARD_ROLES } from "./roles"

// ── Props ──────────────────────────────────────────────────────────────────────

interface UserFormProps {
  mode: "create" | "edit"
  defaultValues?: {
    userId: string
    name: string
    email: string
    role: string
  }
}

// ── Composant ─────────────────────────────────────────────────────────────────

export function UserForm({ mode, defaultValues }: UserFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState(defaultValues?.role ?? "bureau")
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set("role", role)

    startTransition(async () => {
      const result = mode === "create"
        ? await createUser(formData)
        : await updateUser(formData)

      if (result?.error) {
        setError(result.error)
        return
      }

      router.push("/bureau/utilisateurs")
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200/60 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400">
          <IconAlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* userId caché en mode édition */}
      {mode === "edit" && defaultValues && (
        <input type="hidden" name="userId" value={defaultValues.userId} />
      )}

      {/* Nom */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Nom complet
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Jean Dupont"
          defaultValue={defaultValues?.name}
          required
          autoFocus
          className="h-10 rounded-xl"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Adresse email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="jean@gam.fr"
          defaultValue={defaultValues?.email}
          required={mode === "create"}
          readOnly={mode === "edit"}
          className={`h-10 rounded-xl ${mode === "edit" ? "cursor-not-allowed bg-muted/50 text-muted-foreground" : ""}`}
        />
        {mode === "edit" && (
          <p className="text-[11px] text-muted-foreground/70">L&apos;adresse email ne peut pas être modifiée.</p>
        )}
      </div>

      {/* Mot de passe — création uniquement */}
      {mode === "create" && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Mot de passe
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 caractères"
              minLength={8}
              required
              className="h-10 rounded-xl pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Rôle */}
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Rôle
        </Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="h-auto rounded-xl px-4 py-3">
            <SelectValue placeholder="Choisir un rôle" />
          </SelectTrigger>
          <SelectContent position="popper" className="rounded-xl p-2 shadow-lg w-[var(--radix-select-trigger-width)]">
            {DASHBOARD_ROLES.map((r) => (
              <SelectItem
                key={r.value}
                value={r.value}
                className="rounded-lg px-3 py-2.5 focus:bg-amber-50 focus:text-amber-900 data-[state=checked]:bg-amber-50 data-[state=checked]:text-amber-900 dark:focus:bg-amber-950/40 dark:focus:text-amber-300"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{r.label}</span>
                  <span className="text-xs text-muted-foreground">{r.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Séparateur */}
      <div className="border-t" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={isPending}
          className="cursor-pointer gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm shadow-amber-500/20"
        >
          {isPending && <IconLoader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Créer l'utilisateur" : "Enregistrer"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/bureau/utilisateurs")}
          disabled={isPending}
          className="cursor-pointer rounded-xl text-muted-foreground hover:text-foreground"
        >
          Annuler
        </Button>
      </div>
    </form>
  )
}
