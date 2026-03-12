import { redirect } from 'next/navigation'

import { stripe } from '../../lib/stripe'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const paymentIntentId = typeof params.payment_intent === 'string' ? params.payment_intent : undefined

  if (!paymentIntentId) redirect('/')

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)


  if (paymentIntent.status !== 'succeeded') {
    return redirect('/')
  }

  return (
    <section id="success">
      <p>
        Merci pour votre paiement ! Un email de confirmation sera envoyé à{' '}
        {paymentIntent.receipt_email}. Si vous avez des questions, contactez-nous à{' '}
      </p>
      <a href="mailto:orders@example.com">orders@example.com</a>.
    </section>
  )
}