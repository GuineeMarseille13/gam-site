"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2 } from "lucide-react"
import { IconPlus as TablerPlus } from "@tabler/icons-react"

import {
  donPayloadSchema,
  type DonPayload,
} from "@/app/(public)/don/_schemas/don.schema"
import StripePaymentForm from "@/app/(public)/adhesion/_components/stripe-payment-form"
import { DON_PAYMENT_INTENT_CHANNELS } from "@/app/(public)/don/_services/create-don-payment-intent"
import { useCreateDonPaymentIntent } from "@/app/(public)/don/_hooks/use-create-don-payment-intent"
import { useSubmitManualDon } from "@/app/(public)/don/_hooks/use-submit-manual-don"
import { BureauPaymentMethodPicker } from "@/components/bureau/bureau-payment-method-picker"
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
import {
  BUREAU_PAYMENT_METHODS,
  BUREAU_PAYMENT_METHOD_LABELS,
  type BureauPaymentMethod,
  type ManualPaymentMethod,
} from "@/config/bureau-payment-methods"
import { formatCurrency } from "@/helpers/format-currency"

import { DonDonorFields } from "./don-donor-fields"

type WizardStep = "donor" | "payment" | "confirm" | "stripe" | "success"

const EMPTY_FORM: Partial<DonPayload> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
}

function getStepTitle(step: WizardStep): string {
  switch (step) {
    case "donor":
      return "Nouveau don"
    case "payment":
      return "Mode de règlement"
    case "confirm":
      return "Confirmer l'enregistrement"
    case "stripe":
      return "Paiement par carte"
    case "success":
      return "Don enregistré"
  }
}

/**
 * Assistant bureau : créer un don (espèces, virement ou carte).
 */
export function CreateDonDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<WizardStep>("donor")
  const [form, setForm] = useState<Partial<DonPayload>>({ ...EMPTY_FORM })
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<BureauPaymentMethod | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [validatedDon, setValidatedDon] = useState<DonPayload | null>(null)
  const [successLabel, setSuccessLabel] = useState("")

  const {
    mutateAsync: createPaymentIntent,
    isPending: isCardIntentPending,
    reset: resetCardIntent,
  } = useCreateDonPaymentIntent({
    channel: DON_PAYMENT_INTENT_CHANNELS.bureau,
  })

  const {
    mutateAsync: submitManual,
    isPending: isManualPending,
    reset: resetManual,
  } = useSubmitManualDon()

  const resetWizard = useCallback(() => {
    setStep("donor")
    setForm({ ...EMPTY_FORM })
    setCustomAmount("")
    setPaymentMethod(null)
    setFormError(null)
    setClientSecret(null)
    setValidatedDon(null)
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

  const validateDonorStep = useCallback((): DonPayload | null => {
    const parsed = donPayloadSchema.safeParse({
      firstName: form.firstName ?? "",
      lastName: form.lastName ?? "",
      email: form.email ?? "",
      phone: form.phone ?? "",
      amount: form.amount,
      message: form.message ?? "",
    })
    if (!parsed.success) {
      const fieldErrors = Object.values(parsed.error.flatten().fieldErrors).flat()
      setFormError(
        (fieldErrors[0] as string | undefined) ?? "Veuillez vérifier le formulaire.",
      )
      return null
    }
    setFormError(null)
    return parsed.data
  }, [form])

  const handleDonorNext = useCallback(() => {
    const valid = validateDonorStep()
    if (!valid) return
    setValidatedDon(valid)
    setStep("payment")
  }, [validateDonorStep])

  const handlePaymentNext = useCallback(() => {
    if (!paymentMethod) {
      setFormError("Choisissez un mode de règlement.")
      return
    }
    if (!validatedDon) return
    setFormError(null)

    if (paymentMethod === BUREAU_PAYMENT_METHODS.carte) {
      setStep("stripe")
      void (async () => {
        try {
          const result = await createPaymentIntent(validatedDon)
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
  }, [createPaymentIntent, paymentMethod, validatedDon])

  const handleConfirmManual = useCallback(async () => {
    if (!validatedDon || !paymentMethod) return
    if (
      paymentMethod !== BUREAU_PAYMENT_METHODS.espece &&
      paymentMethod !== BUREAU_PAYMENT_METHODS.virement
    ) {
      return
    }

    try {
      await submitManual({
        ...validatedDon,
        paymentMethod: paymentMethod as ManualPaymentMethod,
      })
      setSuccessLabel(BUREAU_PAYMENT_METHOD_LABELS[paymentMethod])
      setStep("success")
      router.refresh()
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement.",
      )
    }
  }, [paymentMethod, submitManual, validatedDon, router])

  const handleStripeSuccess = useCallback(() => {
    setSuccessLabel(BUREAU_PAYMENT_METHOD_LABELS.carte)
    setStep("success")
    router.refresh()
  }, [router])

  const isBusy = isCardIntentPending || isManualPending
  const total = validatedDon?.amount ?? form.amount ?? 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2 rounded-xl bg-amber-500 text-white shadow-md hover:bg-amber-600 sm:w-auto">
          <TablerPlus className="size-4" />
          Nouveau don
        </Button>
      </DialogTrigger>
      <DialogContent
        closeOnOutsideClick={false}
        className="max-h-[min(92vh,48rem)] overflow-y-auto max-w-[calc(100%-2rem)] sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>{getStepTitle(step)}</DialogTitle>
          <DialogDescription>
            {step === "donor"
              ? "Saisissez les informations du donateur et le montant."
              : step === "payment"
                ? `Total : ${formatCurrency(total)}`
                : step === "confirm" && paymentMethod
                  ? `Confirmez l'enregistrement (${BUREAU_PAYMENT_METHOD_LABELS[paymentMethod]}).`
                  : step === "stripe"
                    ? "Encaissement sécurisé via Stripe."
                    : "Le don a bien été enregistré en base de données."}
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

        {step === "donor" ? (
          <DonDonorFields
            form={form}
            customAmount={customAmount}
            onFormChange={setForm}
            onCustomAmountChange={setCustomAmount}
          />
        ) : null}

        {step === "payment" ? (
          <BureauPaymentMethodPicker
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        ) : null}

        {step === "confirm" && paymentMethod && validatedDon ? (
          <ConfirmManualDonSummary don={validatedDon} paymentMethod={paymentMethod} />
        ) : null}

        {step === "stripe" && clientSecret && validatedDon ? (
          <StripePaymentForm
            clientSecret={clientSecret}
            members={[]}
            message={validatedDon.message ?? ""}
            total={validatedDon.amount}
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

        {step === "success" && validatedDon ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-emerald-500" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Paiement : <span className="font-medium text-foreground">{successLabel}</span>
              <br />
              Montant :{" "}
              <span className="font-medium text-foreground">
                {formatCurrency(validatedDon.amount)}
              </span>
            </p>
          </div>
        ) : null}

        {step !== "stripe" && step !== "success" ? (
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            {step !== "donor" ? (
              <Button
                type="button"
                variant="outline"
                disabled={isBusy}
                onClick={() => {
                  setFormError(null)
                  if (step === "payment") setStep("donor")
                  else if (step === "confirm") setStep("payment")
                }}
              >
                Retour
              </Button>
            ) : (
              <span />
            )}
            {step === "donor" ? (
              <Button type="button" onClick={handleDonorNext}>
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
                {paymentMethod === BUREAU_PAYMENT_METHODS.carte
                  ? "Payer par carte"
                  : "Continuer"}
              </Button>
            ) : null}
            {step === "confirm" ? (
              <Button
                type="button"
                onClick={() => void handleConfirmManual()}
                disabled={isManualPending}
              >
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

interface ConfirmManualDonSummaryProps {
  readonly don: DonPayload
  readonly paymentMethod: BureauPaymentMethod
}

function ConfirmManualDonSummary({ don, paymentMethod }: ConfirmManualDonSummaryProps) {
  const label = BUREAU_PAYMENT_METHOD_LABELS[paymentMethod]

  return (
    <div className="space-y-4 rounded-lg border border-border/60 bg-muted/20 p-4 text-sm">
      <p>
        Vous allez enregistrer un don de{" "}
        <span className="font-semibold">{formatCurrency(don.amount)}</span> pour{" "}
        <span className="font-semibold">
          {don.firstName} {don.lastName}
        </span>
        .
      </p>
      <p>
        Mode de règlement : <span className="font-semibold">{label}</span>
      </p>
      {don.phone ? (
        <p className="text-muted-foreground">
          Téléphone : <span className="text-foreground">{don.phone}</span>
        </p>
      ) : null}
      {don.email ? (
        <p className="text-muted-foreground">
          Email : <span className="text-foreground">{don.email}</span>
        </p>
      ) : null}
      {don.message ? (
        <p className="border-t border-border/50 pt-3 text-muted-foreground">
          Message : <span className="text-foreground">{don.message}</span>
        </p>
      ) : null}
    </div>
  )
}
