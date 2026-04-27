"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconAlertCircle, IconLoader2, IconEye, IconEyeOff } from "@tabler/icons-react"
import { formatAuthSignInError } from "@/helpers/format-auth-sign-in-error"

export interface AuthLoginViewProps {
  /** Redirection si le paramètre `redirect` est absent */
  defaultRedirect: string
  title: string
  description: string
  footnote?: string
  haloClassName: string
  submitButtonClassName: string
  alternateLink?: { href: string; label: string }
}

/**
 * Écran de connexion partagé (Bureau / Administration) — même flux Better Auth.
 */
export function AuthLoginView({
  defaultRedirect,
  title,
  description,
  footnote,
  haloClassName,
  submitButtonClassName,
  alternateLink,
}: AuthLoginViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? defaultRedirect
  const isUnauthorized = searchParams.get("error") === "unauthorized"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(
    isUnauthorized ? "Accès non autorisé." : null,
  )
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const emailTrimmed = email.trim()
      const callbackURL =
        typeof window !== "undefined" && redirect.startsWith("/")
          ? `${window.location.origin}${redirect}`
          : redirect

      const result = await signIn.email({
        email: emailTrimmed,
        password,
        callbackURL,
      })

      if (!result.error) {
        router.push(redirect)
        router.refresh()
        return
      }

      setError(formatAuthSignInError(result.error))
    })
  }

  return (
    <div className="relative min-h-screen">
      <div className="background-logo background-logo-parallax pointer-events-none">
        <Image
          src="/images/gam-logo.png"
          alt=""
          width={1000}
          height={1000}
          className="block h-auto w-full"
          priority
          quality={75}
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </div>

      <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden>
        <div className={`size-[600px] rounded-full blur-3xl ${haloClassName}`} />
      </div>

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-background/30 p-8 shadow-xl shadow-black/5 backdrop-blur-xs">
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-400">
                <IconAlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="auth-email" className="text-sm font-medium">
                  Adresse email
                </Label>
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="prenom.nom@gam.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  className="h-11 bg-background/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="auth-password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-11 bg-background/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={`mt-2 h-11 w-full font-semibold transition-all duration-200 ${submitButtonClassName}`}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" />
                    Connexion…
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </div>

          {footnote && (
            <p className="mt-5 text-center text-xs text-muted-foreground">{footnote}</p>
          )}

          {alternateLink && (
            <p className="mt-3 text-center text-xs">
              <Link
                href={alternateLink.href}
                className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {alternateLink.label}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
