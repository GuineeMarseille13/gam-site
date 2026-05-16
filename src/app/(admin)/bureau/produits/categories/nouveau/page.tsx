import type { Metadata } from "next"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Card, CardContent } from "@/components/ui/card"
import { createProductCategory } from "../_actions/actions"
import { CategoryForm } from "../_components/category-form"

export const metadata: Metadata = { title: "Nouvelle catégorie" }

export default function NouvelleCategorieProduitPage() {
  return (
    <BureauContent
      title="Nouvelle catégorie"
      description="Ajouter une catégorie pour classer les produits"
      backHref="/bureau/produits/categories"
    >
      <Card>
        <CardContent className="pt-6">
          <CategoryForm action={createProductCategory} />
        </CardContent>
      </Card>
    </BureauContent>
  )
}
