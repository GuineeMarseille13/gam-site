import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

import { BeneficiaryTrackingStatusForm } from "./beneficiary-tracking-status-form"
import {
  beneficiaryTrackingSectionClassName,
  beneficiaryTrackingSectionTitleClassName,
} from "./beneficiary-suivi-form-classes"
import { paymentLabel } from "../_schemas/beneficiary-tracking.schema"
import type { BeneficiaryTrackingDetail } from "../_schemas/beneficiary-tracking.schema"

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm text-foreground">{value}</dd>
    </div>
  )
}

interface BeneficiaryTrackingDetailViewProps {
  detail: BeneficiaryTrackingDetail
}

/**
 * Détail complet d’une fiche + bloc édition du statut.
 */
export function BeneficiaryTrackingDetailView({ detail }: BeneficiaryTrackingDetailViewProps) {
  const permDate = format(parseISO(`${detail.permanenceDate}T12:00:00.000Z`), "d MMMM yyyy", {
    locale: fr,
  })
  const birth =
    detail.birthDate &&
    format(parseISO(`${detail.birthDate}T12:00:00.000Z`), "d MMMM yyyy", { locale: fr })
  const docLine =
    detail.documentLabelLines.length === 0 ? "—" : detail.documentLabelLines.join(" · ")
  const payLine = paymentLabel(detail.paymentResponsible)
  const payExtra =
    detail.paymentResponsible === "OTHER" && detail.paymentOtherDetail?.trim()
      ? ` (${detail.paymentOtherDetail.trim()})`
      : ""

  return (
    <div className="flex flex-col gap-8">
      <BeneficiaryTrackingStatusForm detail={detail} />

      <section className={beneficiaryTrackingSectionClassName} aria-labelledby="track-detail-identity">
        <h2 id="track-detail-identity" className={beneficiaryTrackingSectionTitleClassName}>
          Identité & contact
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" value={detail.firstName} />
          <Field label="Nom" value={detail.lastName} />
          <Field label="Date de naissance" value={birth ?? "—"} />
          <Field label="Commune de naissance" value={detail.birthMunicipality ?? "—"} />
          <Field label="Pays de naissance" value={detail.birthCountry ?? "—"} />
          <Field label="Téléphone" value={detail.phone ?? "—"} />
          <Field label="Email" value={detail.email ?? "—"} />
          <Field label="Nom du père" value={detail.fatherName ?? "—"} />
          <Field label="Nom de la mère" value={detail.motherName ?? "—"} />
        </dl>
      </section>

      <section className={beneficiaryTrackingSectionClassName} aria-labelledby="track-detail-request">
        <h2 id="track-detail-request" className={beneficiaryTrackingSectionTitleClassName}>
          Demande & permanence
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Date de permanence" value={permDate} />
          <Field
            label="Type(s) de demande"
            value={
              detail.demandTypeLabels.length > 0 ? detail.demandTypeLabels.join(" · ") : "—"
            }
          />
          <div className="min-w-0 space-y-1 sm:col-span-2">
            <dt className="text-xs font-medium text-muted-foreground">Précision demande</dt>
            <dd className="break-words text-sm text-foreground">{detail.requestDetail ?? "—"}</dd>
          </div>
        </dl>
      </section>

      <section className={beneficiaryTrackingSectionClassName} aria-labelledby="track-detail-dossier">
        <h2 id="track-detail-dossier" className={beneficiaryTrackingSectionTitleClassName}>
          Dossier
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 space-y-1 sm:col-span-2">
            <dt className="text-xs font-medium text-muted-foreground">Documents fournis</dt>
            <dd className="break-words text-sm text-foreground">{docLine}</dd>
          </div>
          <Field label="Responsable" value={detail.assignedResponsibleName ?? "—"} />
          <Field label="Paiement (carte)" value={`${payLine}${payExtra}`} />
        </dl>
      </section>

      <section className={beneficiaryTrackingSectionClassName} aria-labelledby="track-detail-accounts">
        <h2 id="track-detail-accounts" className={beneficiaryTrackingSectionTitleClassName}>
          Comptes (confidentiel)
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Compte Gmail" value={detail.gmailAccount ?? "—"} />
          <Field
            label="Mot de passe Gmail"
            value={detail.hasGmailPassword ? "Renseigné (non affiché)" : "—"}
          />
          <Field label="Identifiants E-Kadi" value={detail.ekadiLogin ?? "—"} />
          <Field
            label="Mot de passe E-Kadi"
            value={detail.hasEkadiPassword ? "Renseigné (non affiché)" : "—"}
          />
        </dl>
      </section>

      <section className={beneficiaryTrackingSectionClassName} aria-labelledby="track-detail-meta">
        <h2 id="track-detail-meta" className={beneficiaryTrackingSectionTitleClassName}>
          Suivi interne
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 space-y-1 sm:col-span-2">
            <dt className="text-xs font-medium text-muted-foreground">Notes internes</dt>
            <dd className="whitespace-pre-wrap break-words text-sm text-foreground">
              {detail.notes ?? "—"}
            </dd>
          </div>
          <Field
            label="Créé le"
            value={format(parseISO(detail.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
          />
          <Field
            label="Dernière mise à jour"
            value={format(parseISO(detail.updatedAt), "d MMM yyyy à HH:mm", { locale: fr })}
          />
        </dl>
      </section>
    </div>
  )
}
