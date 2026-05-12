import type { PrismaClient } from "@/lib/generated/prisma/client";

import type { OrderCartCompactLine } from "../_schemas/order-cart-compact.schema";

type DbClient = Pick<PrismaClient, "product">;

/**
 * Erreur métier : panier invalide, stock, ou produit indisponible.
 */
export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

export interface ResolvedOrderLine {
  readonly productId: string;
  readonly productName: string;
  readonly quantity: number;
  readonly unitAmountCents: number;
  readonly lineTotalCents: number;
}

function effectiveUnitPriceCents(product: {
  price: number;
  discountActive: boolean;
  discountPercent: number | null;
}): number {
  const base = product.price;
  if (product.discountActive && product.discountPercent && product.discountPercent > 0) {
    return Math.round(base * (1 - product.discountPercent / 100));
  }
  return base;
}

function mergeQuantities(lines: readonly OrderCartCompactLine[]): OrderCartCompactLine[] {
  const map = new Map<string, number>();
  for (const line of lines) {
    map.set(line.productId, (map.get(line.productId) ?? 0) + line.quantity);
  }
  return [...map.entries()].map(([productId, quantity]) => ({ productId, quantity }));
}

/**
 * Résout un panier compact : prix et libellés depuis la base (ignore les prix client).
 * Vérifie le stock pour la quantité totale par produit.
 *
 * @param db Client Prisma ou transaction
 * @param rawLines Lignes `{ productId, quantity }` (fusion des quantités par produit)
 */
export async function resolveOrderCartLines(
  db: DbClient,
  rawLines: readonly OrderCartCompactLine[],
): Promise<{ readonly lines: ResolvedOrderLine[]; readonly totalAmountCents: number }> {
  const merged = mergeQuantities(rawLines);
  if (merged.length === 0) {
    throw new CheckoutValidationError("Panier vide.");
  }

  const productIds = merged.map((l) => l.productId);
  const dbProducts = await db.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: {
      id: true,
      title: true,
      price: true,
      stock: true,
      discountActive: true,
      discountPercent: true,
    },
  });

  if (dbProducts.length !== merged.length) {
    throw new CheckoutValidationError(
      "Un ou plusieurs produits ne sont plus disponibles.",
    );
  }

  const resolved: ResolvedOrderLine[] = [];

  for (const row of merged) {
    const db = dbProducts.find((p) => p.id === row.productId);
    if (!db) {
      throw new CheckoutValidationError("Produit introuvable.");
    }

    const unitAmountCents = effectiveUnitPriceCents(db);
    const lineTotalCents = unitAmountCents * row.quantity;

    if (db.stock < row.quantity) {
      throw new CheckoutValidationError(`Stock insuffisant pour « ${db.title} ».`);
    }

    resolved.push({
      productId: db.id,
      productName: db.title,
      quantity: row.quantity,
      unitAmountCents,
      lineTotalCents,
    });
  }

  const totalAmountCents = resolved.reduce((sum, l) => sum + l.lineTotalCents, 0);

  return { lines: resolved, totalAmountCents };
}
