"use client"

import { useState, useEffect } from "react"
import { Crown, Check, Star, Zap, ArrowLeft, CreditCard, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { useGoogleTagManager } from "@/components/google-tag-manager"
import { useSearchParams } from "next/navigation"
import { PRICING_CONFIG, PlanType, BillingType, getPlanPrice, getPlanFeatures } from "@/lib/pricing"

// Force dynamic rendering to avoid prerendering errors
export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('premium')
  const [selectedBilling, setSelectedBilling] = useState<BillingType>('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const { trackEvent, trackPageView } = useGoogleTagManager()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view
    trackPageView('/checkout', 'Checkout - Punti Furbi')
    
    // Get plan and billing from URL if provided
    const planParam = searchParams.get('plan') as PlanType
    const billingParam = searchParams.get('billing') as BillingType
    
    if (planParam && PRICING_CONFIG[planParam]) {
      setSelectedPlan(planParam)
    }
    
    if (billingParam && (billingParam === 'monthly' || billingParam === 'yearly')) {
      setSelectedBilling(billingParam)
    }
  }, [searchParams, trackPageView])

  useEffect(() => {
    // Track checkout initiation when plan changes
    const currentPrice = getPlanPrice(selectedPlan, selectedBilling)
    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: currentPrice.price,
      items: [{
        item_id: `${selectedPlan}_${selectedBilling}`,
        item_name: `Punti Furbi ${PRICING_CONFIG[selectedPlan].name} (${selectedBilling})`,
        price: currentPrice.price,
        quantity: 1
      }]
    })
  }, [selectedPlan, selectedBilling, trackEvent])

  const handlePlanChange = (plan: PlanType) => {
    const previousPlan = selectedPlan
    setSelectedPlan(plan)
    
    // Track plan selection
    trackEvent('checkout_plan_change', {
      previous_plan: previousPlan,
      new_plan: plan,
      billing: selectedBilling,
      currency: 'EUR',
      value: getPlanPrice(plan, selectedBilling).price
    })
  }

  const handleBillingChange = (billing: BillingType) => {
    const previousBilling = selectedBilling
    setSelectedBilling(billing)
    
    // Track billing change
    trackEvent('checkout_billing_change', {
      plan: selectedPlan,
      previous_billing: previousBilling,
      new_billing: billing,
      currency: 'EUR',
      value: getPlanPrice(selectedPlan, billing).price
    })
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    
    try {
      const currentPrice = getPlanPrice(selectedPlan, selectedBilling)
      
      // Track conversion/purchase intent
      trackEvent('purchase_intent', {
        currency: 'EUR',
        value: currentPrice.price,
        transaction_id: `${selectedPlan}_${selectedBilling}_${Date.now()}`,
        items: [{
          item_id: `${selectedPlan}_${selectedBilling}`,
          item_name: `Punti Furbi ${PRICING_CONFIG[selectedPlan].name} (${selectedBilling})`,
          price: currentPrice.price,
          quantity: 1
        }]
      })

      // Track specific subscription events
      trackEvent(`${selectedPlan}_subscription_start`, {
        subscription_plan: selectedPlan,
        subscription_price: currentPrice.price,
        currency: 'EUR',
        subscription_type: selectedBilling
      })

      // Track conversion
      trackEvent('conversion', {
        event_category: selectedPlan,
        event_label: `${selectedPlan}_${selectedBilling}_subscription_click`,
        value: currentPrice.price
      })

      // Create Stripe checkout session
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan,
          billing: selectedBilling,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Si è verificato un errore. Riprova tra poco.')
    } finally {
      setIsLoading(false)
    }
  }

  const currentPrice = getPlanPrice(selectedPlan, selectedBilling)
  const currentFeatures = getPlanFeatures(selectedPlan)

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
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-dark-green mb-6">Seleziona il tuo piano</h3>
          
          {/* Plan Selector */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {(Object.keys(PRICING_CONFIG) as PlanType[]).map((planKey) => {
              const plan = PRICING_CONFIG[planKey]
              const IconComponent = planKey === 'premium' ? Crown : Zap
              const isSelected = selectedPlan === planKey
              
              return (
                <div
                  key={planKey}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlanChange(planKey)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="text-[#483cff]" size={20} />
                      <h4 className="font-semibold text-dark-green">{plan.name}</h4>
                    </div>
                    <input
                      type="radio"
                      name="plan"
                      checked={isSelected}
                      onChange={() => handlePlanChange(planKey)}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                  <div className="text-lg font-bold text-[#483cff]">
                    €{plan[selectedBilling].price}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedBilling === 'monthly' ? 'al mese' : 'all\'anno'}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Billing Frequency Selector */}
          <div className="mb-6">
            <h4 className="font-semibold text-dark-green mb-3">Frequenza di fatturazione</h4>
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="billing"
                  value="monthly"
                  checked={selectedBilling === 'monthly'}
                  onChange={() => handleBillingChange('monthly')}
                  className="w-4 h-4 text-blue-600 mr-2"
                />
                <span className="text-gray-700">Mensile</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="billing"
                  value="yearly"
                  checked={selectedBilling === 'yearly'}
                  onChange={() => handleBillingChange('yearly')}
                  className="w-4 h-4 text-blue-600 mr-2"
                />
                <span className="text-gray-700">Annuale</span>
                {selectedBilling === 'yearly' && (
                  <span className="text-sm text-green-600 ml-2 font-medium">
                    (Risparmia {Math.round((1 - (getPlanPrice(selectedPlan, 'yearly').price / (getPlanPrice(selectedPlan, 'monthly').price * 12))) * 100)}%)
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Selected Plan Features */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-dark-green mb-3">Cosa include il piano {PRICING_CONFIG[selectedPlan].name}:</h4>
            <ul className="space-y-2">
              {currentFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  <Check className="text-green-500 mr-2 flex-shrink-0" size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-dark-green mb-4">
            Riepilogo ordine
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {PRICING_CONFIG[selectedPlan].name} ({selectedBilling === 'monthly' ? 'Mensile' : 'Annuale'})
              </span>
              <span className="font-semibold">€{currentPrice.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">IVA (22%)</span>
              <span className="font-semibold">Inclusa</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Totale</span>
                <span className="text-[#483cff]">€{currentPrice.price}</span>
              </div>
            </div>
          </div>
        </div>

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
            disabled={isLoading}
            className="inline-flex items-center justify-center w-full max-w-md px-8 py-4 text-lg rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="mr-2" size={20} />
            {isLoading ? 'Caricamento...' : 'Procedi al pagamento'}
          </button>
          <p className="text-sm text-gray-600 mt-4">
            Verrai reindirizzato a Stripe per completare il pagamento
          </p>
        </div>
      </main>
    </div>
  )
}