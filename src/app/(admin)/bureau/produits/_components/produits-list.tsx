import { Badge } from "@/components/ui/badge"
import { RowActions } from "@/components/bureau/row-actions"
import { CloudinaryImage } from "@/components/bureau/cloudinary-image"
import { formatCurrency } from "@/helpers/format-currency"
import { deleteProduit } from "../_actions/actions"
import { cn } from "@/helpers/utils"

export type ProduitListItem = {
  id: string
  title: string
  description: string | null
  imageId: string | null
  price: number
  stock: number
  isActive: boolean
  productCategory: { title: string } | null
}

interface ProduitsListProps {
  produits: ProduitListItem[]
}

/** Grille alignée en-tête / lignes — colonne actions fixe sur grand écran. */
const ROW_GRID = cn(
  "grid items-center gap-x-3 gap-y-2 px-4 sm:gap-x-4 sm:px-5",
  "grid-cols-[minmax(0,1fr)_auto]",
  "sm:grid-cols-[minmax(0,1fr)_auto_auto]",
  "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_4.5rem_3.5rem_5.5rem_auto]",
  "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_5rem_4rem_6.5rem_13.5rem]",
)

/**
 * Composant: ProduitsList
 * Rôle: Liste produits responsive (grille bureau, sans scroll horizontal).
 */
export function ProduitsList({ produits }: ProduitsListProps) {
  if (produits.length === 0) {
    return (
      <div className="flex min-h-[10rem] items-center justify-center rounded-2xl border bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
        Aucun produit enregistré
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
        <span>Produit</span>
        <span className="hidden md:block">Catégorie</span>
        <span className="hidden md:block md:text-right">Prix</span>
        <span className="hidden md:block md:text-right">Stock</span>
        <span className="hidden sm:block">Statut</span>
        <span className="hidden lg:block lg:text-right">Actions</span>
      </div>

      <div className="divide-y divide-border/60">
        {produits.map((produit) => {
          const priceLabel = formatCurrency(produit.price, {
            unit: "cent",
            maximumFractionDigits: 0,
          })

          return (
            <div
              key={produit.id}
              className={cn(ROW_GRID, "py-3.5 transition-colors hover:bg-muted/20")}
            >
              <ProduitPrimaryCell produit={produit} priceLabel={priceLabel} />

              <p className="hidden min-w-0 truncate text-sm text-muted-foreground md:block">
                {produit.productCategory?.title ?? "—"}
              </p>

              <p className="hidden text-sm font-medium tabular-nums md:block md:text-right">
                {priceLabel}
              </p>

              <p className="hidden text-sm tabular-nums text-muted-foreground md:block md:text-right">
                {produit.stock}
              </p>

              <div className="hidden sm:flex sm:justify-start">
                <ProduitStatusBadge isActive={produit.isActive} />
              </div>

              <div className="flex justify-end">
                <RowActions
                  editHref={`/bureau/produits/${produit.id}/modifier`}
                  onDelete={deleteProduit.bind(null, produit.id)}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProduitPrimaryCell({
  produit,
  priceLabel,
}: {
  produit: ProduitListItem
  priceLabel: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <CloudinaryImage
        imageId={produit.imageId}
        alt={produit.title}
        thumbSize={40}
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{produit.title}</p>
        {produit.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground lg:max-w-md">
            {produit.description}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground md:hidden">
          <span>{produit.productCategory?.title ?? "Sans catégorie"}</span>
          <span className="font-medium text-foreground">{priceLabel}</span>
          <span>Stock {produit.stock}</span>
        </div>
        <div className="mt-1.5 sm:hidden">
          <ProduitStatusBadge isActive={produit.isActive} />
        </div>
      </div>
    </div>
  )
}

function ProduitStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="secondary"
      className={
        isActive
          ? "whitespace-nowrap bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
          : "whitespace-nowrap bg-gray-100 text-gray-500 dark:bg-muted dark:text-muted-foreground"
      }
    >
      {isActive ? "Actif" : "Inactif"}
    </Badge>
  )
}
