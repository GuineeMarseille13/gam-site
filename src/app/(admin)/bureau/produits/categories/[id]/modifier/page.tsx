import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { updateProductCategory } from "../../_actions/actions"
import { CategoryForm } from "../../_components/category-form"

export const metadata: Metadata = { title: "Modifier la catégorie" }

interface ModifierCategoriePageProps {
  params: Promise<{ id: string }>
}

export default async function ModifierCategorieProduitPage({ params }: ModifierCategoriePageProps) {
  const { id } = await params
  const category = await prisma.productCategory.findUnique({ where: { id } })

  if (!category) notFound()

  const action = updateProductCategory.bind(null, id)

  return (
    <BureauContent
      title="Modifier la catégorie"
      description={category.title}
      backHref="/bureau/produits/categories"
    >
      <Card>
        <CardContent className="pt-6">
          <CategoryForm action={action} defaultValues={category} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
