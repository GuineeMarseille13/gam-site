"use client"

import { useCallback, useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Loader2, RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"

import type { AdhesionWithRelations } from "../_types/adhesion-with-relations.type"
import type { Member } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import { PRICE_PER_MEMBER_EUR } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import StripePaymentForm from "@/app/(public)/adhesion/_components/stripe-payment-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RenewalIntentResponse {
  readonly clientSecret: string
  readonly paymentIntentId: string
  readonly nextYear: number
}

async function createRenewalPaymentIntent(
  memberShipId: string,
): Promise<RenewalIntentResponse> {
  const res = await fetch("/api/payment_intents/adhesion-renewal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberShipId }),
  })

  const json: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    const message =
      typeof json === "object" && json !== null && "error" in json
        ? String((json as { error?: unknown }).error ?? "")
        : ""
    throw new Error(message || "Erreur lors de la création du paiement")
  }

  if (
    typeof json !== "object" ||
    json === null ||
    !("clientSecret" in json) ||
    !("paymentIntentId" in json) ||
    !("nextYear" in json)
  ) {
    throw new Error("Réponse invalide du serveur")
  }

  const data = json as {
    clientSecret: string
    paymentIntentId: string
    nextYear: number
  }

  return {
    clientSecret: data.clientSecret,
    paymentIntentId: data.paymentIntentId,
    nextYear: data.nextYear,
  }
}

interface AdhesionRenewalDialogProps {
  readonly adhesion: AdhesionWithRelations
}

/**
 * Action Bureau : renouveler une adhésion (paiement Stripe) pour l’année suivante.
 */
export function AdhesionRenewalDialog({ adhesion }: AdhesionRenewalDialogProps) {
  const person = adhesion.person
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [nextYear, setNextYear] = useState<number | null>(null)

  const members = useMemo<Member[]>(
    () =>
      person
        ? [
            {
              firstName: person.firstName,
              lastName: person.lastName,
              phone: person.phone,
              email: person.email ?? "",
            },
          ]
        : [],
    [person],
  )

  const total = PRICE_PER_MEMBER_EUR

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: async () => createRenewalPaymentIntent(adhesion.id),
    onSuccess: (data) => {
      setClientSecret(data.clientSecret)
      setNextYear(data.nextYear)
    },
  })

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen) {
        setClientSecret(null)
        setNextYear(null)
        reset()
      }
    },
    [reset],
  )

  const handleStart = useCallback(() => {
    if (!person) return
    mutate()
  }, [mutate, person])

  if (!person) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCcw />
          Renouveler
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Renouveler l’adhésion</DialogTitle>
          <DialogDescription>
            {person.firstName} {person.lastName} · année actuelle {adhesion.year}
            {nextYear ? ` → ${nextYear}` : ""}
          </DialogDescription>
        </DialogHeader>

        {!clientSecret ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Confirmer le renouvellement pour l’année{" "}
              <span className="font-semibold text-foreground">
                {adhesion.year + 1}
              </span>
              .
            </p>

            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error.message}
              </div>
            ) : null}

            <DialogFooter className="pt-2">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleStart} disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : null}
                Confirmer
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <StripePaymentForm
            clientSecret={clientSecret}
            members={members}
            message=""
            total={total}
            onSuccess={() => {
              setOpen(false)
              router.refresh()
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

