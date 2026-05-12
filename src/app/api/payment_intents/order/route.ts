import { NextResponse } from "next/server";
import { z } from "zod";

import { cartItemSchema, checkoutDataSchema } from "@/app/(public)/boutique/_schemas/product.schema";
import {
  CheckoutValidationError,
  resolveOrderCartLines,
} from "@/app/(public)/boutique/_services/resolve-order-cart";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const STRIPE_METADATA_VALUE_MAX = 500;

const cartCheckoutSchema = z
  .object({
    items: z.array(cartItemSchema).min(1),
    customer: checkoutDataSchema,
  })
  .strict();

function buildCompactCart(
  items: z.infer<typeof cartCheckoutSchema>["items"],
): { productId: string; quantity: number }[] {
  return items.map((line) => ({
    productId: line.product.id,
    quantity: line.quantity,
  }));
}

/**
 * Crée un PaymentIntent boutique : montant et lignes validés côté serveur (prix catalogue).
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = cartCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { items, customer } = parsed.data;
    const compact = buildCompactCart(items);

    const { totalAmountCents } = await resolveOrderCartLines(prisma, compact);

    const cartJson = JSON.stringify(compact);
    const customerJson = JSON.stringify(customer);

    if (
      cartJson.length > STRIPE_METADATA_VALUE_MAX ||
      customerJson.length > STRIPE_METADATA_VALUE_MAX
    ) {
      return NextResponse.json(
        {
          error:
            "Panier trop volumineux pour le paiement en ligne. Réduisez le nombre d’articles ou contactez l’association.",
        },
        { status: 400 },
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: "eur",
      metadata: {
        type: "order",
        cart: cartJson,
        customer: customerJson,
        itemsCount: String(items.length),
        totalAmountCents: String(totalAmountCents),
      },
      payment_method_types: ["card"],
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    if (err instanceof CheckoutValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Erreur lors de la création du paiement",
      },
      { status: 500 },
    );
  }
}
