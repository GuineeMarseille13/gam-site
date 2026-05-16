import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { CategoriesList } from "./_components/categories-list"

export const metadata: Metadata = { title: "Catégories produits" }

async function getCategories() {
  return prisma.productCategory.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { products: true } } },
  })
}

export default async function ProductCategoriesPage() {
  const categories = await getCategories()

  return (
    <BureauContent
      title="Catégories"
      description={`${categories.length} catégorie${categories.length > 1 ? "s" : ""} de produits`}
      backHref="/bureau/produits"
      addHref="/bureau/produits/categories/nouveau"
      addLabel="Nouvelle catégorie"
    >
      <CategoriesList categories={categories} />
    </BureauContent>
  )
}
