import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  BeneficiaryTrackingListDesktopRow,
  BeneficiaryTrackingListMobileCard,
} from "./beneficiary-tracking-list-items"
import {
  beneficiaryTrackingTableHeaderRowClassName,
  beneficiaryTrackingTableShellClassName,
} from "./beneficiary-suivi-form-classes"
import type { BeneficiaryTrackingListGroup } from "../_schemas/beneficiary-tracking.schema"

interface BeneficiaryTrackingListProps {
  groups: BeneficiaryTrackingListGroup[]
}

/**
 * Liste groupée des bénéficiaires (une ligne = une personne, N dossiers possibles).
 */
export function BeneficiaryTrackingList({ groups }: BeneficiaryTrackingListProps) {
  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune fiche enregistrée pour le moment. Créez-en depuis la page Demande bénéficiaire.
      </p>
    )
  }

  return (
    <>
      <ul className="grid gap-3 md:hidden">
        {groups.map((g) => (
          <li key={g.identityKey}>
            <BeneficiaryTrackingListMobileCard group={g} />
          </li>
        ))}
      </ul>

      <div className="relative hidden w-full md:block">
        <div className={beneficiaryTrackingTableShellClassName}>
          <Table>
            <TableHeader>
              <TableRow className={beneficiaryTrackingTableHeaderRowClassName}>
                <TableHead className="min-w-[100px]">Dernière perm.</TableHead>
                <TableHead className="min-w-[150px]">Bénéficiaire</TableHead>
                <TableHead className="min-w-[180px]">Types de demande</TableHead>
                <TableHead className="min-w-[100px]">Statut</TableHead>
                <TableHead className="min-w-[110px]">Responsable</TableHead>
                <TableHead className="w-[120px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((g) => (
                <BeneficiaryTrackingListDesktopRow key={g.identityKey} group={g} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
