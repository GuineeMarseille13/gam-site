import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Card, CardContent } from "@/components/ui/card"
import { createProduit } from "../_actions/actions"
import { ProduitForm } from "../_components/produit-form"

export default async function NouveauProduitPage() {
  const categories = await prisma.productCategory.findMany({ orderBy: { title: "asc" } })

  return (
    <BureauDataPage title="Nouveau produit" description="Ajouter un produit à la boutique">
      <Card>
        <CardContent className="pt-6">
          <ProduitForm action={createProduit} categories={categories} />
        </CardContent>
      </Card>
    </BureauDataPage>
  )
}
