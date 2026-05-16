import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RowActions } from "@/components/bureau/row-actions"
import { deleteProductCategory } from "../_actions/actions"
import { cn } from "@/helpers/utils"

export type CategoryListItem = {
  id: string
  title: string
  description: string | null
  _count: { products: number }
}

interface CategoriesListProps {
  categories: CategoryListItem[]
}

const ROW_GRID = cn(
  "grid items-center gap-x-3 gap-y-2 px-4 sm:gap-x-4 sm:px-5",
  "grid-cols-[minmax(0,1fr)_auto]",
  "sm:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)_4rem_13.5rem]",
)

/**
 * Composant: CategoriesList
 * Rôle: Liste catégories produits responsive (grille bureau).
 */
export function CategoriesList({ categories }: CategoriesListProps) {
  if (categories.length === 0) {
    return (
      <div className="flex min-h-[10rem] flex-col items-center justify-center gap-2 rounded-2xl border bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
        <p>Aucune catégorie enregistrée</p>
        <Button variant="link" asChild className="mt-1">
          <Link href="/bureau/produits/categories/nouveau">Créer la première catégorie</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div
        className={cn(
          ROW_GRID,
          "border-b bg-muted/30 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
        )}
      >
        <span>Titre</span>
        <span className="hidden sm:block">Description</span>
        <span className="hidden sm:block sm:text-right">Produits</span>
        <span className="hidden sm:block sm:text-right">Actions</span>
      </div>

      <div className="divide-y divide-border/60">
        {categories.map((category) => (
          <div
            key={category.id}
            className={cn(ROW_GRID, "py-3.5 transition-colors hover:bg-muted/20")}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{category.title}</p>
              {category.description && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground sm:hidden">
                  {category.description}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground sm:hidden">
                {category._count.products} produit{category._count.products > 1 ? "s" : ""}
              </p>
            </div>

            <p className="hidden min-w-0 truncate text-sm text-muted-foreground sm:block">
              {category.description ?? "—"}
            </p>

            <p className="hidden text-sm tabular-nums text-muted-foreground sm:block sm:text-right">
              {category._count.products}
            </p>

            <div className="flex justify-end">
              <RowActions
                editHref={`/bureau/produits/categories/${category.id}/modifier`}
                onDelete={deleteProductCategory.bind(null, category.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
