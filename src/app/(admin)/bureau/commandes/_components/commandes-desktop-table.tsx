import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { OrderWithRelations } from "../_types/order-with-relations.type"
import { formatCurrency } from "@/helpers/format-currency"
import {
  formatCommandeDate,
  getCommandeAvatarClass,
  getCommandeInitials,
} from "../_utils/commande-display"
import { CommandeStatusBadge } from "./commande-status-badge"
import { IconListDetails } from "@tabler/icons-react"

interface CommandesDesktopTableProps {
  readonly commandes: OrderWithRelations[]
  readonly onOpenDetail: (commande: OrderWithRelations) => void
}

/**
 * Tableau à partir de md, défilement horizontal si besoin.
 */
export function CommandesDesktopTable({
  commandes,
  onOpenDetail,
}: CommandesDesktopTableProps) {
  return (
    <Card className="hidden md:block">
      <CardContent className="overflow-x-auto px-0">
        <Table className="min-w-[62rem]">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-center">Articles</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commandes.map((commande) => {
              const person = commande.person
              const itemCount = commande.items.length

              return (
                <TableRow key={commande.id}>
                  <TableCell className="pl-6 font-mono text-xs">
                    {commande.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getCommandeAvatarClass(
                          person.firstName,
                        )}`}
                      >
                        {getCommandeInitials(person.firstName, person.lastName)}
                      </div>
                      <span className="truncate font-medium text-sm">
                        {person.firstName} {person.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground text-sm">
                    {itemCount} article{itemCount > 1 ? "s" : ""}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(commande.totalAmount, {
                      unit: "cent",
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <CommandeStatusBadge paymentStatus={commande.payment?.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {formatCommandeDate(commande.createdAt)}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="gap-1.5 rounded-full border-amber-500/40 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 dark:text-amber-200"
                      onClick={() => onOpenDetail(commande)}
                      aria-label={`Détail commande ${commande.orderNumber}`}
                    >
                      <IconListDetails className="size-4" aria-hidden />
                      Détails
                    </Button>
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
