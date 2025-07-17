export interface PricingPlan {
  id: string
  name: string
  priceId: string
  price: number
  yearlyPriceId?: string
  yearlyPrice?: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  color: string
  popular?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'premium',
    name: 'Premium',
    priceId: 'price_1RkqssLhwgrXzl4cMXVOdKdW',
    price: 4.90,
    yearlyPriceId: '', // Da aggiungere se disponibile
    yearlyPrice: 49.90,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Tutte le offerte Economy e Premium Economy',
      'Offerte esclusive in Business e First Class',
      'Segnalazioni di tariffe error fare premium',
      'Supporto via email prioritario',
      'Accesso a offerte riservate'
    ],
    color: '#483cff'
  },
  {
    id: 'elite',
    name: 'Elite',
    priceId: 'price_1RkqssLhwgrXzl4cHffnRCCn',
    price: 19.90, // CORRETTO: era 29.90
    yearlyPriceId: '', // Da aggiungere se disponibile
    yearlyPrice: 199.90, // CORRETTO: era 299.90
    currency: 'EUR',
    interval: 'month',
    features: [
      'Tutto il piano Premium',
      'Concierge personale',
      'Servizi premium di travel hacking',
      'Ricerca personalizzata con punti e miglia',
      '1 consulenza personalizzata al mese',
      'Accesso anticipato a tutte le offerte',
      'Consigli su status, carte e strategie travel hacking'
    ],
    color: '#483cff',
    popular: true
  }
]

export const getPlanById = (id: string): PricingPlan | undefined => {
  return pricingPlans.find(plan => plan.id === id)
}

export const getPlanByPriceId = (priceId: string): PricingPlan | undefined => {
  return pricingPlans.find(plan => plan.priceId === priceId || plan.yearlyPriceId === priceId)
}

// Helper per formattare i prezzi
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

// Legacy compatibility per transizione graduale
export const legacyPlansConfig = {
  premium: {
    name: 'Premium',
    price: 4.90,
    yearlyPrice: 49.90,
    features: pricingPlans[0].features,
    color: '#483cff'
  },
  elite: {
    name: 'Elite',
    price: 19.90, // CORRETTO
    yearlyPrice: 199.90, // CORRETTO
    features: pricingPlans[1].features,
    color: '#483cff'
  }
}