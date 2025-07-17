import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PRICING_CONFIG, PlanType, BillingType } from '@/lib/pricing'

// Initialize Stripe (you'll need to add STRIPE_SECRET_KEY to your environment variables)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY not configured - Stripe functionality will be disabled')
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
}) : null

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { plan, billing }: { plan: PlanType, billing: BillingType } = body

    // Validate input
    if (!plan || !billing) {
      return NextResponse.json(
        { error: 'Plan and billing type are required' },
        { status: 400 }
      )
    }

    if (!PRICING_CONFIG[plan] || !PRICING_CONFIG[plan][billing]) {
      return NextResponse.json(
        { error: 'Invalid plan or billing type' },
        { status: 400 }
      )
    }

    const priceConfig = PRICING_CONFIG[plan][billing]
    const planName = PRICING_CONFIG[plan].name

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceConfig.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin}/checkout?plan=${plan}&billing=${billing}`,
      metadata: {
        plan,
        billing,
        planName,
        price: priceConfig.price.toString(),
      },
      subscription_data: {
        metadata: {
          plan,
          billing,
          planName,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}