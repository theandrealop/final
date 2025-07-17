import { NextRequest, NextResponse } from 'next/server'
import { getPlanByPriceId } from '@/lib/pricing'

// Stripe webhook endpoint per creare sessioni di checkout dinamiche
export async function POST(request: NextRequest) {
  try {
    const { priceId, successUrl, cancelUrl } = await request.json()

    // Validazione input
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID è richiesto' },
        { status: 400 }
      )
    }

    // Verifica che il priceId sia valido
    const plan = getPlanByPriceId(priceId)
    if (!plan) {
      return NextResponse.json(
        { error: 'Piano non valido' },
        { status: 400 }
      )
    }

    // Per ora restituiamo i link Stripe esistenti
    // TODO: Implementare Stripe SDK quando si hanno le API keys
    const stripeLinks = {
      'price_1RkqssLhwgrXzl4cMXVOdKdW': 'https://buy.stripe.com/5kQfZi1D69W6cug5nd9AA01', // Premium
      'price_1RkqssLhwgrXzl4cHffnRCCn': 'https://buy.stripe.com/28EdRachK3xI1PC2b19AA02', // Elite
    }

    const checkoutUrl = stripeLinks[priceId as keyof typeof stripeLinks]
    
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'URL di checkout non disponibile per questo piano' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      url: checkoutUrl,
      planName: plan.name,
      price: plan.price,
      currency: plan.currency
    })

  } catch (error) {
    console.error('Errore creazione sessione checkout:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// Implementazione futura con Stripe SDK:
/*
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { priceId, successUrl, cancelUrl } = await request.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: {
        planId: plan.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Errore creazione sessione Stripe' },
      { status: 500 }
    )
  }
}
*/