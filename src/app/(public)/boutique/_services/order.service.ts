import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { findOrCreatePerson } from "@/helpers/person.utils";
import { PaymentStatus } from "@/types/paiement-status";

import { checkoutDataSchema } from "../_schemas/product.schema";
import { orderCartCompactSchema } from "../_schemas/order-cart-compact.schema";
import {
  CheckoutValidationError,
  resolveOrderCartLines,
} from "./resolve-order-cart";

const AMOUNT_TOLERANCE_CENTS = 1;

function extractPaymentMethodLabel(paymentIntent: Stripe.PaymentIntent): string {
  const types = paymentIntent.payment_method_types;
  if (types?.length) return types[0] ?? "card";
  return "card";
}

/**
 * Persiste commande, lignes, paiement et historique après succès Stripe (webhook).
 * Recalcule prix/stock depuis la base à partir du panier compact dans les métadonnées.
 *
 * @param paymentIntent — PaymentIntent au statut `succeeded`
 */
export async function saveOrderFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  const meta = paymentIntent.metadata ?? {};
  const rawCart = meta.cart;
  const rawCustomer = meta.customer;

  if (!rawCart || !rawCustomer) {
    throw new Error("Métadonnées panier ou client manquantes pour la commande.");
  }

  let cartLines;
  let customer;

  try {
    cartLines = orderCartCompactSchema.parse(JSON.parse(rawCart));
    customer = checkoutDataSchema.parse(JSON.parse(rawCustomer));
  } catch {
    throw new Error("Format des métadonnées commande invalide.");
  }

  const existingPayment = await prisma.payment.findFirst({
    where: { paymentReference: paymentIntent.id },
    select: { id: true },
  });

  if (existingPayment) {
    return;
  }

  const orderNumber = `CMD-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)
    .toUpperCase()}`;

  try {
    await prisma.$transaction(async (tx) => {
      const { lines, totalAmountCents } = await resolveOrderCartLines(tx, cartLines);

      const delta = Math.abs(totalAmountCents - paymentIntent.amount);
      if (delta > AMOUNT_TOLERANCE_CENTS) {
        throw new CheckoutValidationError(
          "Le montant Stripe ne correspond pas au panier calculé côté serveur.",
        );
      }

      const metaTotal = meta.totalAmountCents;
      if (
        typeof metaTotal === "string" &&
        metaTotal.length > 0 &&
        Number.parseInt(metaTotal, 10) !== paymentIntent.amount
      ) {
        throw new CheckoutValidationError("Montant total incohérent dans les métadonnées.");
      }

      for (const line of lines) {
        const stockUpdate = await tx.product.updateMany({
          where: {
            id: line.productId,
            stock: { gte: line.quantity },
          },
          data: {
            stock: { decrement: line.quantity },
          },
        });

        if (stockUpdate.count !== 1) {
          throw new CheckoutValidationError(
            `Stock insuffisant ou produit modifié pour « ${line.productName} ».`,
          );
        }
      }

      const personId = await findOrCreatePerson(tx, {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        email: customer.email,
      });

      const payment = await tx.payment.create({
        data: {
          paymentReference: paymentIntent.id,
          amount: totalAmountCents,
          status: PaymentStatus.PAID,
          type: "order",
          paymentMethod: extractPaymentMethodLabel(paymentIntent),
          personId,
        },
      });

      await tx.order.create({
        data: {
          orderNumber,
          personId,
          totalAmount: totalAmountCents,
          paymentId: payment.id,
          items: {
            createMany: {
              data: lines.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.unitAmountCents,
                subtotal: item.lineTotalCents,
              })),
            },
          },
        },
      });

      await tx.paymentHistory.create({
        data: {
          paymentId: paymentIntent.id,
          personId,
          status: PaymentStatus.PAID,
          type: "order",
        },
      });
    });
  } catch (err) {
    if (
      err instanceof Error &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return;
    }
    if (err instanceof CheckoutValidationError) {
      throw err;
    }
    throw err;
  }
}
