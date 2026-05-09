import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RowActions } from "@/components/bureau/row-actions"
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { deleteProduit } from "./_actions/actions"
import { formatCurrency } from "@/helpers/format-currency"

export const metadata: Metadata = { title: "Produits" }

async function getProduits() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { productCategory: true },
  })
}

export default async function ProduitsPage() {
  const produits = await getProduits()

  return (
    <BureauContent
      title="Produits"
      description={`${produits.length} produit${produits.length > 1 ? "s" : ""} en boutique`}
      addHref="/bureau/produits/nouveau"
      addLabel="Nouveau produit"
    >
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-14">Image</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Aucun produit enregistré
                  </TableCell>
                </TableRow>
              ) : (
                produits.map((produit) => (
                  <TableRow key={produit.id}>
                    <TableCell className="pl-6">
                      <CloudinaryImage imageId={produit.imageId} alt={produit.title} thumbSize={40} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{produit.title}</div>
                      {produit.description && (
                        <div className="max-w-xs truncate text-xs text-muted-foreground">
                          {produit.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {produit.productCategory?.title ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(produit.price, { unit: "cent", maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="tabular-nums">{produit.stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={produit.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}
                      >
                        {produit.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <RowActions
                        editHref={`/bureau/produits/${produit.id}/modifier`}
                        onDelete={deleteProduit.bind(null, produit.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </BureauContent>
  )
}
