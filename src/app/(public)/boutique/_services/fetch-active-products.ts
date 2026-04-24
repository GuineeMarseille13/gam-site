import { productsApiResponseSchema } from "../_schemas/product-api.schema";
import { productSchema, type Product } from "../_schemas/product.schema";

const CLOUDINARY_BASE = "https://res.cloudinary.com/df3ymbrqe/image/upload";

function mapApiProductToCatalogProduct(input: {
  id: string;
  title?: string | null;
  description?: string | null;
  price: number;
  stock?: number | null;
  imageId?: string | null;
  discountPercent?: number | null;
  discountActive?: boolean | null;
}): Product {
  const pct = input.discountPercent ?? 0;
  const hasDiscount = Boolean(input.discountActive && pct > 0);
  const effectivePrice = hasDiscount ? Math.round(input.price * (1 - pct / 100)) : input.price;

  return {
    id: input.id,
    name: input.title ?? "",
    image: input.imageId
      ? `${CLOUDINARY_BASE}/w_600,h_600,c_fill,q_auto,f_auto/${input.imageId}`
      : "",
    price: effectivePrice,
    originalPrice: hasDiscount ? input.price : undefined,
    discount: hasDiscount ? pct : undefined,
    description: input.description ?? undefined,
    inStock: (input.stock ?? 0) > 0,
  };
}

/**
 * Service: fetchActiveProducts
 * Rôle: Charger le catalogue boutique depuis l’API interne et valider avec Zod.
 */
export async function fetchActiveProducts(): Promise<Product[]> {
  const res = await fetch("/api/products?active=true", { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Erreur API produits: ${res.status}`);
  }

  const json: unknown = await res.json();
  const parsed = productsApiResponseSchema.parse(json);

  if (!parsed.success) {
    throw new Error(parsed.error ?? "Erreur lors du chargement des produits");
  }

  const records = parsed.data ?? [];
  const products = records.map((p) => mapApiProductToCatalogProduct(p));

  return productSchema.array().parse(products);
}

