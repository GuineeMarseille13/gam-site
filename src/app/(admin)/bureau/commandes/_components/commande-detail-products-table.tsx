import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/helpers/format-currency";
import type { OrderWithRelations } from "../_types/order-with-relations.type";

interface CommandeDetailProductsTableProps {
  readonly items: OrderWithRelations["items"];
}

/**
 * Tableau des lignes commande (produit, quantités, montants en centimes).
 */
export function CommandeDetailProductsTable({
  items,
}: CommandeDetailProductsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/40 ring-1 ring-white/[0.03]">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 bg-muted/30 hover:bg-muted/30">
            <TableHead className="pl-4">Produit</TableHead>
            <TableHead className="text-center">Qté</TableHead>
            <TableHead className="text-right">Prix unit.</TableHead>
            <TableHead className="pr-4 text-right">Sous-total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((line) => (
            <TableRow key={line.id}>
              <TableCell className="max-w-[200px] pl-4 font-medium">
                <span className="line-clamp-2">{line.product.title}</span>
              </TableCell>
              <TableCell className="text-center tabular-nums">{line.quantity}</TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {formatCurrency(line.price, {
                  unit: "cent",
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="pr-4 text-right font-medium tabular-nums">
                {formatCurrency(line.subtotal, {
                  unit: "cent",
                  maximumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
