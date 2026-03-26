"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BeneficiaryDemandTypeMultiSelect } from "./beneficiary-demand-type-multi-select"
import {
  BeneficiaryRequiredMark,
  beneficiarySuiviInputClassName,
  beneficiarySuiviSelectTriggerClassName,
  beneficiarySuiviTextareaClassName,
} from "./beneficiary-suivi-form-classes"
import { BeneficiarySuiviDocumentChecks } from "./beneficiary-suivi-document-checks"
import { submitBeneficiaryPermanence } from "../_actions/submit-beneficiary-permanence"
import {
  beneficiaryPermanenceStep3Schema,
  beneficiaryPermanenceStep4Schema,
  buildBeneficiaryPermanenceStep2Schema,
  buildSubmitBeneficiaryPermanenceSchema,
  beneficiaryPermanenceStep1Schema,
  type DemandTypeOptionForValidation,
} from "../_schemas/beneficiary-permanence.schema"
import {
  BENEFICIARY_DOCUMENT_LABELS,
  PAYMENT_RESPONSIBLE_LABELS,
  PAYMENT_RESPONSIBLE_VALUES,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_VALUES,
  type BeneficiaryDocumentKey,
} from "../_schemas/beneficiary-suivi-config"

const STEPS = 5

const STEP_LABELS = ["Date", "Demande", "Dossier", "Fiche", "Validation"]

function toYmd(d: Date): string {
  return format(d, "yyyy-MM-dd")
}

export type BeneficiaryDemandTypeOption = DemandTypeOptionForValidation & {
  readonly label: string
}

interface BeneficiarySuiviWizardProps {
  className?: string
  demandTypes: BeneficiaryDemandTypeOption[]
}

/**
 * Assistant multi-étapes : Demande bénéficiaire / permanence administrative (aligné Google Form).
 */
export function BeneficiarySuiviWizard({ className, demandTypes }: BeneficiarySuiviWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [pending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const validationSet = useMemo(
    () => demandTypes.map((d) => ({ id: d.id, requiresDetail: d.requiresDetail })),
    [demandTypes],
  )

  const step2Schema = useMemo(
    () => buildBeneficiaryPermanenceStep2Schema(validationSet),
    [validationSet],
  )

  const submitSchema = useMemo(
    () => buildSubmitBeneficiaryPermanenceSchema(validationSet),
    [validationSet],
  )

  const defaultTypeId = demandTypes[0]?.id ?? ""

  const [permanenceDate, setPermanenceDate] = useState<Date | undefined>(undefined)
  const [requestTypeIds, setRequestTypeIds] = useState<string[]>(() =>
    defaultTypeId ? [defaultTypeId] : [],
  )
  const [requestDetail, setRequestDetail] = useState("")

  const [documentKeys, setDocumentKeys] = useState<BeneficiaryDocumentKey[]>([])
  const [documentOtherDetail, setDocumentOtherDetail] = useState("")
  const [requestStatus, setRequestStatus] = useState<(typeof REQUEST_STATUS_VALUES)[number]>(
    "PENDING_DOCUMENTS",
  )
  const [statusComment, setStatusComment] = useState("")
  const [assignedResponsibleName, setAssignedResponsibleName] = useState("")
  const [paymentResponsible, setPaymentResponsible] = useState<
    (typeof PAYMENT_RESPONSIBLE_VALUES)[number]
  >("NONE")
  const [paymentOtherDetail, setPaymentOtherDetail] = useState("")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [birthCountry, setBirthCountry] = useState("")
  const [birthMunicipality, setBirthMunicipality] = useState("")
  const [fatherName, setFatherName] = useState("")
  const [motherName, setMotherName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [gmailAccount, setGmailAccount] = useState("")
  const [gmailPassword, setGmailPassword] = useState("")
  const [ekadiLogin, setEkadiLogin] = useState("")
  const [ekadiPassword, setEkadiPassword] = useState("")

  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (demandTypes.length === 0) return
    setRequestTypeIds((prev) => {
      const filtered = prev.filter((id) => demandTypes.some((d) => d.id === id))
      if (filtered.length > 0) return filtered
      return demandTypes[0] ? [demandTypes[0].id] : []
    })
  }, [demandTypes])

  useEffect(() => {
    if (!documentKeys.includes("OTHER")) {
      setDocumentOtherDetail("")
    }
  }, [documentKeys])

  const ymd = permanenceDate ? toYmd(permanenceDate) : ""
  const birthYmd = birthDate ? toYmd(birthDate) : ""

  const selectedRequiresDetail = useMemo(
    () =>
      requestTypeIds.some((id) => demandTypes.find((d) => d.id === id)?.requiresDetail ?? false),
    [demandTypes, requestTypeIds],
  )

  const summaryTypeLabels = useMemo(() => {
    const set = new Set(requestTypeIds)
    return demandTypes.filter((d) => set.has(d.id)).map((d) => d.label)
  }, [demandTypes, requestTypeIds])

  const resetForm = useCallback(() => {
    setPermanenceDate(undefined)
    setRequestTypeIds(defaultTypeId ? [defaultTypeId] : [])
    setRequestDetail("")
    setDocumentKeys([])
    setDocumentOtherDetail("")
    setRequestStatus("PENDING_DOCUMENTS")
    setStatusComment("")
    setAssignedResponsibleName("")
    setPaymentResponsible("NONE")
    setPaymentOtherDetail("")
    setFirstName("")
    setLastName("")
    setBirthDate(undefined)
    setBirthCountry("")
    setBirthMunicipality("")
    setFatherName("")
    setMotherName("")
    setPhone("")
    setEmail("")
    setGmailAccount("")
    setGmailPassword("")
    setEkadiLogin("")
    setEkadiPassword("")
    setNotes("")
  }, [defaultTypeId])

  const handleNext = useCallback(() => {
    setFormError(null)
    setFieldErrors({})
    if (step === 1) {
      const p = beneficiaryPermanenceStep1Schema.safeParse({ permanenceDate: ymd })
      if (!p.success) {
        const e = p.error.flatten().fieldErrors
        setFieldErrors({ permanenceDate: e.permanenceDate?.[0] ?? "Date requise." })
        return
      }
    }
    if (step === 2) {
      const p = step2Schema.safeParse({ requestTypeIds, requestDetail })
      if (!p.success) {
        const e = p.error.flatten().fieldErrors
        setFieldErrors({
          requestTypeIds: e.requestTypeIds?.[0] ?? "",
          requestDetail: e.requestDetail?.[0] ?? "",
        })
        return
      }
    }
    if (step === 3) {
      const p = beneficiaryPermanenceStep3Schema.safeParse({
        documentKeys,
        documentOtherDetail:
          documentOtherDetail.trim() === "" ? undefined : documentOtherDetail,
        requestStatus,
        statusComment,
        assignedResponsibleName,
        paymentResponsible,
        paymentOtherDetail,
      })
      if (!p.success) {
        const e = p.error.flatten().fieldErrors
        setFieldErrors({
          documentKeys: e.documentKeys?.[0] ?? "",
          documentOtherDetail: e.documentOtherDetail?.[0] ?? "",
          requestStatus: e.requestStatus?.[0] ?? "",
          statusComment: e.statusComment?.[0] ?? "",
          assignedResponsibleName: e.assignedResponsibleName?.[0] ?? "",
          paymentResponsible: e.paymentResponsible?.[0] ?? "",
          paymentOtherDetail: e.paymentOtherDetail?.[0] ?? "",
        })
        return
      }
    }
    if (step === 4) {
      const p = beneficiaryPermanenceStep4Schema.safeParse({
        firstName,
        lastName,
        birthDate: birthYmd,
        birthCountry,
        birthMunicipality,
        fatherName,
        motherName,
        phone,
        email,
        gmailAccount,
        gmailPassword,
        ekadiLogin,
        ekadiPassword,
      })
      if (!p.success) {
        const e = p.error.flatten().fieldErrors
        setFieldErrors({
          firstName: e.firstName?.[0] ?? "",
          lastName: e.lastName?.[0] ?? "",
          birthDate: e.birthDate?.[0] ?? "",
          birthCountry: e.birthCountry?.[0] ?? "",
          birthMunicipality: e.birthMunicipality?.[0] ?? "",
          fatherName: e.fatherName?.[0] ?? "",
          motherName: e.motherName?.[0] ?? "",
          phone: e.phone?.[0] ?? "",
          email: e.email?.[0] ?? "",
          gmailAccount: e.gmailAccount?.[0] ?? "",
          gmailPassword: e.gmailPassword?.[0] ?? "",
          ekadiLogin: e.ekadiLogin?.[0] ?? "",
          ekadiPassword: e.ekadiPassword?.[0] ?? "",
        })
        return
      }
    }
    setStep((s) => Math.min(s + 1, STEPS))
  }, [
    step,
    ymd,
    requestTypeIds,
    requestDetail,
    step2Schema,
    documentKeys,
    documentOtherDetail,
    requestStatus,
    statusComment,
    assignedResponsibleName,
    paymentResponsible,
    paymentOtherDetail,
    firstName,
    lastName,
    birthYmd,
    birthCountry,
    birthMunicipality,
    fatherName,
    motherName,
    phone,
    email,
    gmailAccount,
    gmailPassword,
    ekadiLogin,
    ekadiPassword,
  ])

  const handleBack = useCallback(() => {
    setFormError(null)
    setFieldErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleSubmit = useCallback(() => {
    const payload = {
      permanenceDate: ymd,
      requestTypeIds,
      requestDetail: requestDetail.trim() === "" ? undefined : requestDetail,
      documentKeys,
      documentOtherDetail:
        documentOtherDetail.trim() === "" ? undefined : documentOtherDetail,
      requestStatus,
      statusComment: statusComment.trim() === "" ? undefined : statusComment,
      assignedResponsibleName,
      paymentResponsible,
      paymentOtherDetail: paymentOtherDetail.trim() === "" ? undefined : paymentOtherDetail,
      firstName,
      lastName,
      birthDate: birthYmd,
      birthCountry: birthCountry.trim() === "" ? undefined : birthCountry,
      birthMunicipality,
      fatherName: fatherName.trim() === "" ? undefined : fatherName,
      motherName: motherName.trim() === "" ? undefined : motherName,
      phone,
      email: email.trim() === "" ? undefined : email,
      gmailAccount: gmailAccount.trim() === "" ? undefined : gmailAccount,
      gmailPassword: gmailPassword.trim() === "" ? undefined : gmailPassword,
      ekadiLogin: ekadiLogin.trim() === "" ? undefined : ekadiLogin,
      ekadiPassword: ekadiPassword.trim() === "" ? undefined : ekadiPassword,
      notes: notes.trim() === "" ? undefined : notes,
    }
    const parsed = submitSchema.safeParse(payload)
    if (!parsed.success) {
      setFormError("Vérifiez les informations avant envoi.")
      const e = parsed.error.flatten().fieldErrors
      const flat: Record<string, string> = {}
      for (const [k, v] of Object.entries(e)) {
        if (v?.[0]) flat[k] = v[0]
      }
      setFieldErrors(flat)
      return
    }
    startTransition(async () => {
      const res = await submitBeneficiaryPermanence(parsed.data)
      if (res.success) {
        setDone(true)
        setStep(1)
        resetForm()
        router.refresh()
        return
      }
      setFormError(res.error)
      if (res.fieldErrors) {
        const flat: Record<string, string> = {}
        for (const [k, v] of Object.entries(res.fieldErrors)) {
          if (v?.[0]) flat[k] = v[0]
        }
        setFieldErrors(flat)
      }
    })
  }, [
    ymd,
    requestTypeIds,
    requestDetail,
    documentKeys,
    documentOtherDetail,
    requestStatus,
    statusComment,
    assignedResponsibleName,
    paymentResponsible,
    paymentOtherDetail,
    firstName,
    lastName,
    birthYmd,
    birthCountry,
    birthMunicipality,
    fatherName,
    motherName,
    phone,
    email,
    gmailAccount,
    gmailPassword,
    ekadiLogin,
    ekadiPassword,
    notes,
    submitSchema,
    router,
    resetForm,
  ])

  if (demandTypes.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-amber-200/80 bg-amber-50/50 p-6 text-sm text-foreground dark:border-amber-900/50 dark:bg-amber-950/20",
          className,
        )}
      >
        <p className="font-medium">Aucun type de demande actif</p>
        <p className="mt-2 text-muted-foreground">
          Ajoutez au moins un libellé dans la configuration des types pour pouvoir enregistrer une
          fiche.
        </p>
        <Button
          asChild
          className="mt-4 h-11 w-full max-w-sm bg-sky-600 text-white shadow-sm shadow-sky-600/20 transition-colors hover:bg-sky-700 hover:shadow-md hover:shadow-sky-600/30 sm:h-10"
        >
          <Link href="/administration/suivi-permanence/types-de-demande">Configurer les types</Link>
        </Button>
      </div>
    )
  }

  if (done) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20",
          className,
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
          <Check className="size-7" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-foreground">Fiche enregistrée</p>
          <p className="text-sm text-muted-foreground">
            La ligne apparaît dans le tableau ci-dessous. Vous pouvez saisir une autre permanence.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setDone(false)}
          className="mt-2 h-11 w-full max-w-sm bg-sky-600 text-white shadow-sm shadow-sky-600/20 transition-colors hover:bg-sky-700 hover:shadow-md hover:shadow-sky-600/30 sm:h-10"
        >
          Nouvelle saisie
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("min-w-0 space-y-6", className)}>
      <StepIndicator current={step} labels={STEP_LABELS} />

      {formError && (
        <p
          className="break-words rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {formError}
        </p>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <Label htmlFor="ben-suivi-date" className="text-foreground">
            Date de la permanence
            <BeneficiaryRequiredMark />
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="ben-suivi-date"
                type="button"
                variant="outline"
                className={cn(
                  "h-auto min-h-11 w-full max-w-full justify-start border-sky-200/80 px-3 py-2.5 text-left text-sm font-normal shadow-sm transition-[color,box-shadow,background-color,border-color] hover:border-sky-400 hover:bg-sky-50/90 hover:text-sky-950 data-[state=open]:border-sky-500 data-[state=open]:bg-sky-50/80 sm:max-w-md sm:text-base dark:border-sky-800/60 dark:hover:border-sky-500 dark:hover:bg-sky-950/45 dark:hover:text-sky-100 dark:data-[state=open]:border-sky-400 dark:data-[state=open]:bg-sky-950/50",
                  !permanenceDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 size-4 shrink-0" aria-hidden />
                <span className="line-clamp-2 break-words text-left">
                  {permanenceDate
                    ? format(permanenceDate, "EEEE d MMMM yyyy", { locale: fr })
                    : "Choisir une date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[min(100vw-2rem,24rem)] max-w-[calc(100vw-2rem)] p-0 sm:w-auto sm:max-w-none"
              align="center"
              sideOffset={8}
            >
              <Calendar
                mode="single"
                selected={permanenceDate}
                onSelect={setPermanenceDate}
                locale={fr}
                captionLayout="dropdown"
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {fieldErrors.permanenceDate && (
            <p className="text-sm text-destructive">{fieldErrors.permanenceDate}</p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ben-suivi-type" className="text-foreground">
              Type(s) de demande
              <BeneficiaryRequiredMark />
            </Label>
            <BeneficiaryDemandTypeMultiSelect
              demandTypes={demandTypes}
              value={requestTypeIds}
              onChange={(ids) => {
                setRequestTypeIds(ids)
                setFieldErrors({})
                const needsDetail = ids.some(
                  (id) => demandTypes.find((d) => d.id === id)?.requiresDetail,
                )
                if (!needsDetail) {
                  setRequestDetail("")
                }
              }}
              error={fieldErrors.requestTypeIds}
            />
          </div>
          {selectedRequiresDetail && (
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-type-detail" className="text-foreground">
                Précision
                <BeneficiaryRequiredMark />
              </Label>
              <Input
                id="ben-suivi-type-detail"
                value={requestDetail}
                onChange={(e) => setRequestDetail(e.target.value)}
                placeholder="Décrivez la demande"
                className={cn(
                  beneficiarySuiviInputClassName,
                  "w-full min-w-0 max-w-full sm:max-w-xl",
                )}
              />
              {fieldErrors.requestDetail && (
                <p className="text-sm text-destructive">{fieldErrors.requestDetail}</p>
              )}
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <BeneficiarySuiviDocumentChecks
            value={documentKeys}
            onChange={setDocumentKeys}
            otherDetail={documentOtherDetail}
            onOtherDetailChange={(v) => {
              setDocumentOtherDetail(v)
              setFieldErrors((prev) => {
                const next = { ...prev }
                delete next.documentOtherDetail
                return next
              })
            }}
            otherDetailError={fieldErrors.documentOtherDetail}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="ben-suivi-status" className="text-foreground">
                Statut de la demande
                <BeneficiaryRequiredMark />
              </Label>
              <Select
                value={requestStatus}
                onValueChange={(v) => setRequestStatus(v as typeof requestStatus)}
              >
                <SelectTrigger id="ben-suivi-status" className={beneficiarySuiviSelectTriggerClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_STATUS_VALUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {REQUEST_STATUS_LABELS[v]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.requestStatus && (
                <p className="text-sm text-destructive">{fieldErrors.requestStatus}</p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="ben-suivi-payment" className="text-foreground">
                Paiement effectué par carte bancaire de
                <BeneficiaryRequiredMark />
              </Label>
              <Select
                value={paymentResponsible}
                onValueChange={(v) => setPaymentResponsible(v as typeof paymentResponsible)}
              >
                <SelectTrigger
                  id="ben-suivi-payment"
                  className={beneficiarySuiviSelectTriggerClassName}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_RESPONSIBLE_VALUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {PAYMENT_RESPONSIBLE_LABELS[v]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.paymentResponsible && (
                <p className="text-sm text-destructive">{fieldErrors.paymentResponsible}</p>
              )}
            </div>
          </div>

          {paymentResponsible === "OTHER" && (
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-payment-other" className="text-foreground">
                Précision (autre paiement)
                <BeneficiaryRequiredMark />
              </Label>
              <Input
                id="ben-suivi-payment-other"
                value={paymentOtherDetail}
                onChange={(e) => setPaymentOtherDetail(e.target.value)}
                placeholder="Ex. nom ou organisme"
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.paymentOtherDetail && (
                <p className="text-sm text-destructive">{fieldErrors.paymentOtherDetail}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ben-suivi-responsible" className="text-foreground">
              Responsable en charge de la demande
              <BeneficiaryRequiredMark />
            </Label>
            <Input
              id="ben-suivi-responsible"
              value={assignedResponsibleName}
              onChange={(e) => setAssignedResponsibleName(e.target.value)}
              placeholder="Nom du bénévole ou référent"
              className={cn(beneficiarySuiviInputClassName, "w-full min-w-0 sm:max-w-xl")}
            />
            {fieldErrors.assignedResponsibleName && (
              <p className="text-sm text-destructive">{fieldErrors.assignedResponsibleName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ben-suivi-status-comment" className="text-muted-foreground">
              Commentaire de la demande
            </Label>
            <Textarea
              id="ben-suivi-status-comment"
              rows={3}
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              placeholder="Suivi, prochaines étapes…"
              className={beneficiarySuiviTextareaClassName}
            />
            {fieldErrors.statusComment && (
              <p className="text-sm text-destructive">{fieldErrors.statusComment}</p>
            )}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-amber-200/70 bg-amber-50/40 px-3 py-2 text-xs text-foreground dark:border-amber-900/50 dark:bg-amber-950/25">
            Les mots de passe (Gmail, E-Kadi) sont enregistrés de façon confidentielle. Limitez
            l’accès à cette base aux personnes habilitées.
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-fn" className="text-foreground">
                Prénom
                <BeneficiaryRequiredMark />
              </Label>
              <Input
                id="ben-suivi-fn"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.firstName && (
                <p className="text-sm text-destructive">{fieldErrors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-ln" className="text-foreground">
                Nom
                <BeneficiaryRequiredMark />
              </Label>
              <Input
                id="ben-suivi-ln"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.lastName && (
                <p className="text-sm text-destructive">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ben-suivi-birth" className="text-foreground">
              Date de naissance
              <BeneficiaryRequiredMark />
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="ben-suivi-birth"
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-auto min-h-11 w-full max-w-full justify-start border-sky-200/80 px-3 py-2.5 text-left text-sm font-normal shadow-sm transition-[color,box-shadow,background-color,border-color] hover:border-sky-400 hover:bg-sky-50/90 hover:text-sky-950 data-[state=open]:border-sky-500 data-[state=open]:bg-sky-50/80 sm:max-w-md dark:border-sky-800/60 dark:hover:border-sky-500 dark:hover:bg-sky-950/45 dark:hover:text-sky-100 dark:data-[state=open]:border-sky-400 dark:data-[state=open]:bg-sky-950/50",
                    !birthDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 size-4 shrink-0" aria-hidden />
                  <span>
                    {birthDate
                      ? format(birthDate, "d MMMM yyyy", { locale: fr })
                      : "Choisir une date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  locale={fr}
                  captionLayout="dropdown"
                  defaultMonth={birthDate ?? new Date(1990, 0)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {fieldErrors.birthDate && (
              <p className="text-sm text-destructive">{fieldErrors.birthDate}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-birth-country" className="text-muted-foreground">
                Pays de naissance
              </Label>
              <Input
                id="ben-suivi-birth-country"
                value={birthCountry}
                onChange={(e) => setBirthCountry(e.target.value)}
                placeholder="Optionnel"
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.birthCountry && (
                <p className="text-sm text-destructive">{fieldErrors.birthCountry}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-birth-commune" className="text-foreground">
                Commune de naissance
                <BeneficiaryRequiredMark />
              </Label>
              <Input
                id="ben-suivi-birth-commune"
                value={birthMunicipality}
                onChange={(e) => setBirthMunicipality(e.target.value)}
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.birthMunicipality && (
                <p className="text-sm text-destructive">{fieldErrors.birthMunicipality}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-father" className="text-muted-foreground">
                Nom du père
              </Label>
              <Input
                id="ben-suivi-father"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.fatherName && (
                <p className="text-sm text-destructive">{fieldErrors.fatherName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-mother" className="text-muted-foreground">
                Nom de la mère
              </Label>
              <Input
                id="ben-suivi-mother"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.motherName && (
                <p className="text-sm text-destructive">{fieldErrors.motherName}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-phone" className="text-foreground">
                Numéro de téléphone
                <BeneficiaryRequiredMark />
              </Label>
              <Input
                id="ben-suivi-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.phone && <p className="text-sm text-destructive">{fieldErrors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-email" className="text-muted-foreground">
                Email (optionnel)
              </Label>
              <Input
                id="ben-suivi-email"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-gmail" className="text-muted-foreground">
                Compte Gmail
              </Label>
              <Input
                id="ben-suivi-gmail"
                type="email"
                autoComplete="off"
                value={gmailAccount}
                onChange={(e) => setGmailAccount(e.target.value)}
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.gmailAccount && (
                <p className="text-sm text-destructive">{fieldErrors.gmailAccount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-gmail-pwd" className="text-muted-foreground">
                Mot de passe Gmail
              </Label>
              <Input
                id="ben-suivi-gmail-pwd"
                type="password"
                autoComplete="new-password"
                value={gmailPassword}
                onChange={(e) => setGmailPassword(e.target.value)}
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.gmailPassword && (
                <p className="text-sm text-destructive">{fieldErrors.gmailPassword}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-ekadi" className="text-muted-foreground">
                Identifiants E-Kadi
              </Label>
              <Input
                id="ben-suivi-ekadi"
                autoComplete="off"
                value={ekadiLogin}
                onChange={(e) => setEkadiLogin(e.target.value)}
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.ekadiLogin && (
                <p className="text-sm text-destructive">{fieldErrors.ekadiLogin}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ben-suivi-ekadi-pwd" className="text-muted-foreground">
                Mot de passe E-Kadi
              </Label>
              <Input
                id="ben-suivi-ekadi-pwd"
                type="password"
                autoComplete="new-password"
                value={ekadiPassword}
                onChange={(e) => setEkadiPassword(e.target.value)}
                className={cn(beneficiarySuiviInputClassName, "w-full min-w-0")}
              />
              {fieldErrors.ekadiPassword && (
                <p className="text-sm text-destructive">{fieldErrors.ekadiPassword}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border border-border/80 bg-muted/30 p-4 text-sm">
            <p className="break-words">
              <span className="text-muted-foreground">Permanence : </span>
              <span className="font-medium">
                {permanenceDate ? format(permanenceDate, "d MMMM yyyy", { locale: fr }) : "—"}
              </span>
            </p>
            <p className="break-words">
              <span className="text-muted-foreground">Demande : </span>
              <span className="font-medium">
                {summaryTypeLabels.length > 0 ? summaryTypeLabels.join(" · ") : "—"}
                {requestDetail.trim() ? ` — ${requestDetail.trim()}` : ""}
              </span>
            </p>
            <p className="break-words">
              <span className="text-muted-foreground">Documents : </span>
              <span className="font-medium">
                {documentKeys.length === 0
                  ? "—"
                  : documentKeys
                      .map((k) =>
                        k === "OTHER" && documentOtherDetail.trim()
                          ? `Autre (${documentOtherDetail.trim()})`
                          : BENEFICIARY_DOCUMENT_LABELS[k],
                      )
                      .join(" · ")}
              </span>
            </p>
            <p className="break-words">
              <span className="text-muted-foreground">Statut : </span>
              <span className="font-medium">{REQUEST_STATUS_LABELS[requestStatus]}</span>
            </p>
            <p className="break-words">
              <span className="text-muted-foreground">Responsable : </span>
              <span className="font-medium">{assignedResponsibleName.trim() || "—"}</span>
            </p>
            <p className="break-words">
              <span className="text-muted-foreground">Paiement : </span>
              <span className="font-medium">
                {PAYMENT_RESPONSIBLE_LABELS[paymentResponsible]}
                {paymentResponsible === "OTHER" && paymentOtherDetail.trim()
                  ? ` (${paymentOtherDetail.trim()})`
                  : ""}
              </span>
            </p>
            <p className="break-words">
              <span className="text-muted-foreground">Bénéficiaire : </span>
              <span className="font-medium">
                {firstName.trim()} {lastName.trim()}
              </span>
            </p>
            <p className="break-words">
              <span className="text-muted-foreground">Naissance : </span>
              <span className="font-medium">
                {birthDate ? format(birthDate, "d MMMM yyyy", { locale: fr }) : "—"}
                {birthMunicipality.trim() ? ` — ${birthMunicipality.trim()}` : ""}
                {birthCountry.trim() ? ` (${birthCountry.trim()})` : ""}
              </span>
            </p>
            <p className="break-words">
              <span className="text-muted-foreground">Téléphone : </span>
              <span className="font-medium">{phone.trim() || "—"}</span>
            </p>
            {(gmailAccount.trim() || gmailPassword) && (
              <p className="break-words">
                <span className="text-muted-foreground">Gmail : </span>
                <span className="font-medium">
                  {gmailAccount.trim() || "—"}
                  {gmailPassword ? " — mot de passe renseigné" : ""}
                </span>
              </p>
            )}
            {(ekadiLogin.trim() || ekadiPassword) && (
              <p className="break-words">
                <span className="text-muted-foreground">E-Kadi : </span>
                <span className="font-medium">
                  {ekadiLogin.trim() || "—"}
                  {ekadiPassword ? " — mot de passe renseigné" : ""}
                </span>
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ben-suivi-notes" className="text-muted-foreground">
              Notes internes (optionnel)
            </Label>
            <Textarea
              id="ben-suivi-notes"
              rows={4}
              placeholder="Remarques internes, suite du dossier…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={cn(beneficiarySuiviTextareaClassName, "min-h-[100px]")}
            />
            {fieldErrors.notes && <p className="text-sm text-destructive">{fieldErrors.notes}</p>}
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-start sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={step === 1 || pending}
          className="h-11 w-full max-w-full gap-1 transition-colors hover:bg-sky-100/90 hover:text-sky-900 sm:h-10 sm:w-auto dark:hover:bg-sky-950/50 dark:hover:text-sky-100"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Retour
        </Button>
        {step < STEPS ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={pending}
            className="h-11 w-full max-w-full gap-1 bg-sky-600 text-white shadow-sm shadow-sky-600/20 transition-colors hover:bg-sky-700 hover:shadow-md hover:shadow-sky-600/30 sm:h-10 sm:w-auto"
          >
            Suivant
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={pending}
            className="h-11 w-full max-w-full gap-2 bg-sky-600 text-white shadow-sm shadow-sky-600/20 transition-colors hover:bg-sky-700 hover:shadow-md hover:shadow-sky-600/30 sm:h-10 sm:min-w-[140px] sm:w-auto"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Enregistrer
          </Button>
        )}
      </div>
    </div>
  )
}

function StepIndicator({ current, labels }: { current: number; labels: readonly string[] }) {
  return (
    <nav aria-label="Étapes du formulaire" className="w-full">
      <ol className="grid grid-cols-5 gap-1 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
        {labels.map((label, i) => {
          const n = i + 1
          const active = n === current
          const done = n < current
          return (
            <li
              key={label}
              className="flex min-w-0 flex-col items-center gap-1 sm:flex-1 sm:flex-row sm:gap-2"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-sky-600 text-white",
                  active && !done && "bg-sky-100 text-sky-800 ring-2 ring-sky-500 dark:bg-sky-950 dark:text-sky-100",
                  !active && !done && "bg-muted text-muted-foreground",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-4" aria-hidden /> : n}
              </span>
              <span
                className={cn(
                  "line-clamp-2 max-w-full text-center text-[10px] font-medium leading-tight sm:inline sm:max-w-[5.5rem] sm:truncate sm:text-left sm:text-xs",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
