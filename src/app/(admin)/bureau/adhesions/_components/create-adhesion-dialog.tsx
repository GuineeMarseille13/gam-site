"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { IconPlus as TablerPlus } from "@tabler/icons-react"

import {
  adhesionPayloadSchema,
  computeAdhesionTotalEur,
  type Member,
} from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import StripePaymentForm from "@/app/(public)/adhesion/_components/stripe-payment-form"
import { ADHESION_PAYMENT_INTENT_CHANNELS } from "@/app/(public)/adhesion/_services/create-adhesion-payment-intent"
import { useCreateAdhesionPaymentIntent } from "@/app/(public)/adhesion/_hooks/use-create-adhesion-payment-intent"
import { useSubmitManualAdhesion } from "@/app/(public)/adhesion/_hooks/use-submit-manual-adhesion"
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
import { formatCurrency } from "@/helpers/format-currency"

import {
  BUREAU_ADHESION_PAYMENT_METHODS,
  BUREAU_ADHESION_PAYMENT_METHOD_LABELS,
  type BureauAdhesionPaymentMethod,
} from "../_schemas/bureau-adhesion-create.schema"
import { AdhesionMemberFields } from "./adhesion-member-fields"
import { AdhesionPaymentMethodPicker } from "./adhesion-payment-method-picker"

type WizardStep = "members" | "payment" | "confirm" | "stripe" | "success"

const EMPTY_MEMBER: Member = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
}

function getStepTitle(step: WizardStep): string {
  switch (step) {
    case "members":
      return "Nouvelle adhésion"
    case "payment":
      return "Mode de règlement"
    case "confirm":
      return "Confirmer l'enregistrement"
    case "stripe":
      return "Paiement par carte"
    case "success":
      return "Adhésion enregistrée"
  }
}

/**
 * Assistant bureau : créer une adhésion (espèces, virement ou carte).
 */
export function CreateAdhesionDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<WizardStep>("members")
  const [members, setMembers] = useState<Member[]>([{ ...EMPTY_MEMBER }])
  const [message, setMessage] = useState("")
  const [paymentMethod, setPaymentMethod] =
    useState<BureauAdhesionPaymentMethod | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [validatedMembers, setValidatedMembers] = useState<Member[]>([])
  const [validatedMessage, setValidatedMessage] = useState("")
  const [successLabel, setSuccessLabel] = useState("")

  const total = useMemo(() => computeAdhesionTotalEur(members.length), [members.length])

  const {
    mutateAsync: createPaymentIntent,
    isPending: isCardIntentPending,
    reset: resetCardIntent,
  } = useCreateAdhesionPaymentIntent({
    channel: ADHESION_PAYMENT_INTENT_CHANNELS.bureau,
  })

  const {
    mutateAsync: submitManual,
    isPending: isManualPending,
    reset: resetManual,
  } = useSubmitManualAdhesion()

  const resetWizard = useCallback(() => {
    setStep("members")
    setMembers([{ ...EMPTY_MEMBER }])
    setMessage("")
    setPaymentMethod(null)
    setFormError(null)
    setClientSecret(null)
    setValidatedMembers([])
    setValidatedMessage("")
    setSuccessLabel("")
    resetCardIntent()
    resetManual()
  }, [resetCardIntent, resetManual])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen) {
        resetWizard()
      }
    },
    [resetWizard],
  )

  const validateMembersStep = useCallback((): Member[] | null => {
    const parsed = adhesionPayloadSchema.safeParse({ members, message })
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      const memberErrors = flat.members
      if (memberErrors?.[0] && typeof memberErrors[0] === "object") {
        const first = Object.values(memberErrors[0] as object).flat()[0]
        setFormError(typeof first === "string" ? first : "Veuillez vérifier le formulaire.")
      } else {
        setFormError("Veuillez vérifier le formulaire.")
      }
      return null
    }
    setFormError(null)
    return parsed.data.members
  }, [members, message])

  const handleMembersNext = useCallback(() => {
    const valid = validateMembersStep()
    if (!valid) return
    setValidatedMembers(valid)
    setValidatedMessage(message)
    setStep("payment")
  }, [message, validateMembersStep])

  const handlePaymentNext = useCallback(() => {
    if (!paymentMethod) {
      setFormError("Choisissez un mode de règlement.")
      return
    }
    setFormError(null)

    if (paymentMethod === BUREAU_ADHESION_PAYMENT_METHODS.carte) {
      setStep("stripe")
      void (async () => {
        try {
          const result = await createPaymentIntent({
            members: validatedMembers,
            message: validatedMessage,
          })
          if (!result.clientSecret) {
            throw new Error("Secret de paiement indisponible")
          }
          setClientSecret(result.clientSecret)
        } catch (err) {
          setFormError(
            err instanceof Error ? err.message : "Impossible de préparer le paiement.",
          )
          setStep("payment")
        }
      })()
      return
    }

    setStep("confirm")
  }, [createPaymentIntent, paymentMethod, validatedMembers, validatedMessage])

  const handleConfirmManual = useCallback(async () => {
    if (
      paymentMethod !== BUREAU_ADHESION_PAYMENT_METHODS.espece &&
      paymentMethod !== BUREAU_ADHESION_PAYMENT_METHODS.virement
    ) {
      return
    }

    try {
      await submitManual({
        members: validatedMembers,
        message: validatedMessage,
        paymentMethod,
      })
      setSuccessLabel(BUREAU_ADHESION_PAYMENT_METHOD_LABELS[paymentMethod])
      setStep("success")
      router.refresh()
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement.",
      )
    }
  }, [paymentMethod, submitManual, validatedMembers, validatedMessage, router])

  const handleStripeSuccess = useCallback(() => {
    setSuccessLabel(BUREAU_ADHESION_PAYMENT_METHOD_LABELS.carte)
    setStep("success")
    router.refresh()
  }, [router])

  const isBusy = isCardIntentPending || isManualPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 rounded-xl bg-amber-500 text-white shadow-md hover:bg-amber-600 sm:w-auto">
          <TablerPlus className="size-4" />
          Nouvelle adhésion
        </Button>
      </DialogTrigger>
      <DialogContent
        closeOnOutsideClick={false}
        className="max-h-[min(92vh,48rem)] overflow-y-auto max-w-[calc(100%-2rem)] sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>{getStepTitle(step)}</DialogTitle>
          <DialogDescription>
            {step === "members"
              ? "Saisissez les informations de l'adhérent ou des adhérents."
              : step === "payment"
                ? `Total : ${formatCurrency(total)} — ${members.length} personne${members.length > 1 ? "s" : ""}`
                : step === "confirm" && paymentMethod
                  ? `Confirmez l'enregistrement (${BUREAU_ADHESION_PAYMENT_METHOD_LABELS[paymentMethod]}).`
                  : step === "stripe"
                    ? "Encaissement sécurisé via Stripe."
                    : "L'adhésion a bien été enregistrée en base de données."}
          </DialogDescription>
        </DialogHeader>

        {formError ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {formError}
          </div>
        ) : null}

        {step === "members" ? (
          <AdhesionMemberFields
            members={members}
            message={message}
            onMembersChange={setMembers}
            onMessageChange={setMessage}
          />
        ) : null}

        {step === "payment" ? (
          <AdhesionPaymentMethodPicker
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        ) : null}

        {step === "confirm" && paymentMethod ? (
          <ConfirmManualSummary
            members={validatedMembers}
            total={computeAdhesionTotalEur(validatedMembers.length)}
            paymentMethod={paymentMethod}
          />
        ) : null}

        {step === "stripe" && clientSecret ? (
          <StripePaymentForm
            clientSecret={clientSecret}
            members={validatedMembers}
            message={validatedMessage}
            total={computeAdhesionTotalEur(validatedMembers.length)}
            onSuccess={handleStripeSuccess}
            onCancel={() => {
              setClientSecret(null)
              setStep("payment")
            }}
          />
        ) : null}

        {step === "stripe" && !clientSecret && isCardIntentPending ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : null}

        {step === "success" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-emerald-500" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Paiement : <span className="font-medium text-foreground">{successLabel}</span>
              <br />
              Montant :{" "}
              <span className="font-medium text-foreground">
                {formatCurrency(computeAdhesionTotalEur(validatedMembers.length))}
              </span>
            </p>
          </div>
        ) : null}

        {step !== "stripe" && step !== "success" ? (
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            {step !== "members" ? (
              <Button
                type="button"
                variant="outline"
                disabled={isBusy}
                onClick={() => {
                  setFormError(null)
                  if (step === "payment") setStep("members")
                  else if (step === "confirm") setStep("payment")
                }}
              >
                Retour
              </Button>
            ) : (
              <span />
            )}
            {step === "members" ? (
              <Button type="button" onClick={handleMembersNext}>
                Continuer
              </Button>
            ) : null}
            {step === "payment" ? (
              <Button
                type="button"
                onClick={handlePaymentNext}
                disabled={!paymentMethod || isCardIntentPending}
              >
                {isCardIntentPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {paymentMethod === BUREAU_ADHESION_PAYMENT_METHODS.carte
                  ? "Payer par carte"
                  : "Continuer"}
              </Button>
            ) : null}
            {step === "confirm" ? (
              <Button type="button" onClick={() => void handleConfirmManual()} disabled={isManualPending}>
                {isManualPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Confirmer et enregistrer
              </Button>
            ) : null}
          </DialogFooter>
        ) : step === "success" ? (
          <DialogFooter>
            <Button type="button" onClick={() => handleOpenChange(false)}>
              Fermer
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

interface ConfirmManualSummaryProps {
  readonly members: Member[]
  readonly total: number
  readonly paymentMethod: BureauAdhesionPaymentMethod
}

function ConfirmManualSummary({
  members,
  total,
  paymentMethod,
}: ConfirmManualSummaryProps) {
  const label = BUREAU_ADHESION_PAYMENT_METHOD_LABELS[paymentMethod]

  return (
    <div className="space-y-4 rounded-lg border border-border/60 bg-muted/20 p-4 text-sm">
      <p>
        Vous allez enregistrer{" "}
        <span className="font-semibold">
          {members.length} adhésion{members.length > 1 ? "s" : ""}
        </span>{" "}
        pour un montant de{" "}
        <span className="font-semibold">{formatCurrency(total)}</span>.
      </p>
      <p>
        Mode de règlement : <span className="font-semibold">{label}</span>
      </p>
      <ul className="space-y-2 border-t border-border/50 pt-3">
        {members.map((m, i) => (
          <li key={`${m.phone}-${i}`} className="text-muted-foreground">
            <span className="font-medium text-foreground">
              {m.firstName} {m.lastName}
            </span>
            {" · "}
            {m.phone}
            {m.email ? ` · ${m.email}` : ""}
          </li>
        ))}
      </ul>
    </div>
  )
}
