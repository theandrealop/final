"use client"

import { useState, useEffect } from "react"
import { Crown, Check, Star, Zap, ArrowLeft, CreditCard, Shield, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useGoogleTagManager } from "@/components/google-tag-manager"
import { useSearchParams } from "next/navigation"
import { PlanSelector } from "@/components/plan-selector"
import { pricingPlans, getPlanById, formatPrice } from "@/lib/pricing"

// Forza la pagina a essere dinamica per evitare errori di prerendering
export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [isLoading, setIsLoading] = useState(false)
  const { trackEvent, trackPageView } = useGoogleTagManager()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view
    trackPageView('/checkout', 'Checkout - Punti Furbi')
    
    // Get plan from URL if provided
    const plan = searchParams.get('plan')
    if (plan && getPlanById(plan)) {
      setSelectedPlan(plan)
    }
  }, [searchParams, trackPageView])

  useEffect(() => {
    // Track checkout initiation quando il piano cambia
    const currentPlan = getPlanById(selectedPlan)
    if (currentPlan) {
      const price = billingInterval === 'year' ? currentPlan.yearlyPrice || currentPlan.price * 12 : currentPlan.price
      
      trackEvent('begin_checkout', {
        currency: 'EUR',
        value: price,
        items: [{
          item_id: selectedPlan,
          item_name: `Punti Furbi ${currentPlan.name}`,
          price: price,
          quantity: 1
        }]
      })
    }
  }, [selectedPlan, billingInterval, trackEvent])

  const handlePlanChange = (plan: string) => {
    const previousPlan = getPlanById(selectedPlan)
    const newPlan = getPlanById(plan)
    
    setSelectedPlan(plan)
    
    // Track plan selection
    if (previousPlan && newPlan) {
      trackEvent('checkout_plan_change', {
        previous_plan: selectedPlan,
        new_plan: plan,
        currency: 'EUR',
        value: billingInterval === 'year' ? newPlan.yearlyPrice || newPlan.price * 12 : newPlan.price
      })
    }
  }

  const handleBillingChange = (interval: 'month' | 'year') => {
    setBillingInterval(interval)
    
    const planForTracking = getPlanById(selectedPlan)
    if (planForTracking) {
      trackEvent('billing_interval_change', {
        plan: selectedPlan,
        interval: interval,
        currency: 'EUR'
      })
    }
  }

  const currentPlan = getPlanById(selectedPlan)
  const currentPrice = currentPlan ? (billingInterval === 'year' ? currentPlan.yearlyPrice || currentPlan.price * 12 : currentPlan.price) : 0

  const handleCheckout = async () => {
    if (!currentPlan) return
    
    setIsLoading(true)
    
    try {
      // Track conversion/purchase intent
      trackEvent('purchase_intent', {
        currency: 'EUR',
        value: currentPrice,
        transaction_id: `${selectedPlan}_${Date.now()}`,
        items: [{
          item_id: selectedPlan,
          item_name: `Punti Furbi ${currentPlan.name}`,
          price: currentPrice,
          quantity: 1
        }]
      })

      // Track specific subscription events
      trackEvent(`${selectedPlan}_subscription_start`, {
        subscription_plan: selectedPlan,
        subscription_price: currentPrice,
        currency: 'EUR',
        subscription_type: billingInterval === 'year' ? 'yearly' : 'monthly'
      })

      // Chiama l'API per ottenere l'URL di checkout
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: currentPlan.priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/checkout`
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        // Redirect a Stripe
        window.location.href = data.url
      } else {
        console.error('Errore checkout:', data.error)
        // Fallback al link diretto per ora
        const fallbackLinks = {
          'price_1RkqssLhwgrXzl4cMXVOdKdW': 'https://buy.stripe.com/5kQfZi1D69W6cug5nd9AA01',
          'price_1RkqssLhwgrXzl4cHffnRCCn': 'https://buy.stripe.com/28EdRachK3xI1PC2b19AA02'
        }
        const fallbackUrl = fallbackLinks[currentPlan.priceId as keyof typeof fallbackLinks]
        if (fallbackUrl) {
          window.open(fallbackUrl, '_blank')
        }
      }
    } catch (error) {
      console.error('Errore durante il checkout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="text-gray-600" size={20} />
              <span className="text-gray-600 font-semibold">Torna al sito</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="text-green-500" size={20} />
              <span className="text-sm text-gray-600">Pagamento sicuro</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-dark-green mb-4">
            Completa il tuo ordine
          </h1>
          <p className="text-gray-600">
            Scegli il piano perfetto per iniziare a risparmiare sui tuoi voli
          </p>
        </div>

        {/* Plan Selection */}
        <div className="mb-8">
          <PlanSelector
            selectedPlan={selectedPlan}
            onPlanChange={handlePlanChange}
            billingInterval={billingInterval}
            onBillingChange={handleBillingChange}
          />
        </div>

        {/* Selected Plan Details */}
        {currentPlan && (
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <h3 className="text-xl font-bold text-dark-green mb-4">
              Riepilogo ordine: Punti Furbi {currentPlan.name}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Piano {billingInterval === 'year' ? 'annuale' : 'mensile'}
                </span>
                <span className="font-semibold">{formatPrice(currentPrice)}</span>
              </div>
              {billingInterval === 'year' && (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>Risparmio annuale</span>
                  <span className="font-semibold">
                    -{formatPrice((currentPlan.price * 12) - currentPrice)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">IVA (22%)</span>
                <span className="font-semibold">Inclusa</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Totale</span>
                  <span className="text-[#483cff]">{formatPrice(currentPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <Shield className="text-green-500 mx-auto mb-2" size={24} />
            <div className="text-sm font-semibold text-dark-green">Pagamento sicuro</div>
            <div className="text-xs text-gray-600">Crittografia SSL</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <CreditCard className="text-blue-500 mx-auto mb-2" size={24} />
            <div className="text-sm font-semibold text-dark-green">Stripe</div>
            <div className="text-xs text-gray-600">Processore di pagamento</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <Clock className="text-purple-500 mx-auto mb-2" size={24} />
            <div className="text-sm font-semibold text-dark-green">Cancellazione</div>
            <div className="text-xs text-gray-600">Annulla in qualsiasi momento</div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="text-center">
          <button
            onClick={handleCheckout}
            disabled={isLoading || !currentPlan}
            className="inline-flex items-center justify-center w-full max-w-md px-8 py-4 text-lg rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={20} />
                Elaborazione...
              </>
            ) : (
              <>
                <CreditCard className="mr-2" size={20} />
                Procedi al pagamento
              </>
            )}
          </button>
          <p className="text-sm text-gray-600 mt-4">
            Verrai reindirizzato a Stripe per completare il pagamento
          </p>
        </div>
      </main>
    </div>
  )
}