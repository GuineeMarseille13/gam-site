import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DonWithRelations } from "../_types/don-with-relations.type"
import { formatCurrency } from "@/helpers/format-currency"
import {
  formatDonDate,
  getDonAvatarClass,
  getDonInitials,
} from "../_utils/don-display"

interface DonsDesktopTableProps {
  readonly dons: DonWithRelations[]
}

/**
 * Tableau dense à partir de md, avec défilement horizontal si la largeur est insuffisante.
 */
export function DonsDesktopTable({ dons }: DonsDesktopTableProps) {
  return (
    <Card className="hidden md:block">
      <CardContent className="overflow-x-auto px-0">
        <Table className="min-w-[56rem]">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Donateur</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="pr-6 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dons.map((don) => {
              const person = don.person

              return (
                <TableRow key={don.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      {person ? (
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getDonAvatarClass(
                            person.firstName,
                          )}`}
                        >
                          {getDonInitials(person.firstName, person.lastName)}
                        </div>
                      ) : (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          ?
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="truncate font-medium text-sm">
                          {person
                            ? `${person.firstName} ${person.lastName}`
                            : "Anonyme"}
                        </div>
                        {person?.email ? (
                          <div className="truncate text-xs text-muted-foreground">
                            {person.email}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">{don.title}</TableCell>

                  <TableCell className="text-right font-semibold tabular-nums text-sm">
                    {formatCurrency(don.amount, { maximumFractionDigits: 0 })}
                  </TableCell>

                  <TableCell className="max-w-[240px] truncate text-muted-foreground text-sm">
                    {don.message ?? "—"}
                  </TableCell>

                  <TableCell className="pr-6 text-right tabular-nums text-muted-foreground">
                    {formatDonDate(don.createdAt)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

