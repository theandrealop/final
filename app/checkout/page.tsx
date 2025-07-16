"use client"

import { useState, useEffect } from "react"

// Forza la pagina a essere dinamica per evitare errori di prerendering
export const dynamic = 'force-dynamic'
import { Crown, Check, Star, Zap, ArrowLeft, CreditCard, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { useGoogleTagManager } from "@/components/google-tag-manager"
import { useSearchParams } from "next/navigation"

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const { trackEvent, trackPageView } = useGoogleTagManager()
  const searchParams = useSearchParams()

  const plans = {
    premium: {
      name: 'Premium',
      price: 4.90,
      yearlyPrice: 49.90,
      stripeLink: 'https://buy.stripe.com/5kQfZi1D69W6cug5nd9AA01',
      features: [
        'Tutte le offerte Economy e Premium Economy',
        'Offerte esclusive in Business e First Class',
        'Segnalazioni di tariffe error fare premium',
        'Supporto via email prioritario',
        'Accesso a offerte riservate'
      ],
      color: '#483cff'
    },
    elite: {
      name: 'Elite',
      price: 29.90,
      yearlyPrice: 299.90,
      stripeLink: 'https://buy.stripe.com/28EdRachK3xI1PC2b19AA02',
      features: [
        'Tutto il piano Premium',
        'Concierge personale',
        'Servizi premium di travel hacking',
        'Ricerca personalizzata con punti e miglia',
        '1 consulenza personalizzata al mese',
        'Accesso anticipato a tutte le offerte',
        'Consigli su status, carte e strategie travel hacking'
      ],
      color: '#483cff'
    }
  }

  useEffect(() => {
    // Track page view
    trackPageView('/checkout', 'Checkout - Punti Furbi')
    
    // Track checkout initiation
    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: plans[selectedPlan].price,
      items: [{
        item_id: selectedPlan,
        item_name: `Punti Furbi ${plans[selectedPlan].name}`,
        price: plans[selectedPlan].price,
        quantity: 1
      }]
    })

    // Get plan from URL if provided
    const plan = searchParams.get('plan')
    if (plan && plans[plan]) {
      setSelectedPlan(plan)
    }
  }, [selectedPlan, searchParams, trackEvent, trackPageView])

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan)
    
    // Track plan selection
    trackEvent('checkout_plan_change', {
      previous_plan: selectedPlan,
      new_plan: plan,
      currency: 'EUR',
      value: plans[plan].price
    })
  }

  const handleCheckout = () => {
    const plan = plans[selectedPlan]
    
    // Track conversion/purchase intent
    trackEvent('purchase_intent', {
      currency: 'EUR',
      value: plan.price,
      transaction_id: `${selectedPlan}_${Date.now()}`,
      items: [{
        item_id: selectedPlan,
        item_name: `Punti Furbi ${plan.name}`,
        price: plan.price,
        quantity: 1
      }]
    })

    // Track specific subscription events
    trackEvent(`${selectedPlan}_subscription_start`, {
      subscription_plan: selectedPlan,
      subscription_price: plan.price,
      currency: 'EUR',
      subscription_type: 'monthly'
    })

    // Track conversion
    trackEvent('conversion', {
      event_category: selectedPlan,
      event_label: `${selectedPlan}_subscription_click`,
      value: plan.price
    })
  }

  const currentPlan = plans[selectedPlan]

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
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key}
              className={`bg-white rounded-lg p-6 shadow-lg cursor-pointer transition-all ${
                selectedPlan === key ? 'ring-2 ring-blue-500 border-blue-500' : 'border border-gray-200'
              }`}
              onClick={() => handlePlanChange(key)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {key === 'premium' ? (
                    <Crown className="text-[#483cff]" size={24} />
                  ) : (
                    <Zap className="text-[#483cff]" size={24} />
                  )}
                  <h3 className="text-xl font-bold text-dark-green">{plan.name}</h3>
                </div>
                <input
                  type="radio"
                  name="plan"
                  checked={selectedPlan === key}
                  onChange={() => handlePlanChange(key)}
                  className="w-4 h-4 text-blue-600"
                />
              </div>
              <div className="text-2xl font-bold text-[#483cff] mb-2">
                €{plan.price}
              </div>
              <div className="text-sm text-gray-600 mb-4">al mese</div>
              <ul className="space-y-2">
                {plan.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <Check className="text-green-500 mr-2 flex-shrink-0" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.features.length > 3 && (
                  <li className="text-sm text-gray-500">
                    +{plan.features.length - 3} altre funzionalità
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Selected Plan Details */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-dark-green mb-4">
            Riepilogo ordine: {currentPlan.name}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Piano mensile</span>
              <span className="font-semibold">€{currentPlan.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">IVA (22%)</span>
              <span className="font-semibold">Inclusa</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Totale</span>
                <span className="text-[#483cff]">€{currentPlan.price}</span>
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
          <a
            href={currentPlan.stripeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCheckout}
            className="inline-flex items-center justify-center w-full max-w-md px-8 py-4 text-lg rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            <CreditCard className="mr-2" size={20} />
            Procedi al pagamento
          </a>
          <p className="text-sm text-gray-600 mt-4">
            Verrai reindirizzato a Stripe per completare il pagamento
          </p>
        </div>
      </main>
    </div>
  )
}