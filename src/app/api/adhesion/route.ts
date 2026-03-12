import { NextResponse } from 'next/server'

// POST /api/adhesion - Déprécié : l'adhésion est désormais créée via le webhook Stripe
// après paiement. Utiliser POST /api/payment_intents pour initier le flux de paiement.
export async function POST() {
  return NextResponse.json(
    {
      error: 'Ce endpoint est déprécié. L\'adhésion est créée automatiquement après le paiement Stripe. Utilisez POST /api/payment_intents pour initier le paiement.',
    },
    { status: 410 }
  )
}
