import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { updateProduit } from "../../_actions/actions"
import { ProduitForm } from "../../_components/produit-form"

export default async function ModifierProduitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.productCategory.findMany({ orderBy: { title: "asc" } }),
  ])
  if (!product) notFound()

  const action = updateProduit.bind(null, product.id)

  return (
    <BureauContent title="Modifier le produit" description={product.title}>
      <Card>
        <CardContent className="pt-6">
          <ProduitForm action={action} defaultValues={product} categories={categories} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
