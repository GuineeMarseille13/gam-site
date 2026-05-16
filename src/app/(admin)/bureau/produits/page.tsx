import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { ProduitsList } from "./_components/produits-list"

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
      actions={
        <Button
          variant="outline"
          asChild
          className="w-full justify-center rounded-xl sm:w-auto"
        >
          <Link href="/bureau/produits/categories">Catégories</Link>
        </Button>
      }
    >
      <ProduitsList produits={produits} />
    </BureauContent>
  )
}
