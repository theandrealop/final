// Centralized pricing configuration
export const PRICING_CONFIG = {
  premium: {
    name: 'Premium',
    monthly: {
      price: 4.90,
      priceId: 'price_Premium_Monthly_490', // Stripe price ID
      currency: 'EUR'
    },
    yearly: {
      price: 49.90,
      priceId: 'price_Premium_Yearly_4990',
      currency: 'EUR'
    },
    features: [
      'Tutte le offerte Economy e Premium Economy',
      'Offerte esclusive in Business e First Class',
      'Segnalazioni di tariffe error fare premium',
      'Supporto via email prioritario',
      'Accesso a offerte riservate'
    ],
    color: '#483cff',
    icon: 'Crown'
  },
  elite: {
    name: 'Elite',
    monthly: {
      price: 19.90, // CORRECTED: was 29.90
      priceId: 'price_Elite_Monthly_1990', // Stripe price ID
      currency: 'EUR'
    },
    yearly: {
      price: 199.90,
      priceId: 'price_Elite_Yearly_19990',
      currency: 'EUR'
    },
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
    icon: 'Zap'
  }
} as const

export type PlanType = keyof typeof PRICING_CONFIG
export type BillingType = 'monthly' | 'yearly'

export function getPlanPrice(plan: PlanType, billing: BillingType) {
  return PRICING_CONFIG[plan][billing]
}

export function getPlanFeatures(plan: PlanType) {
  return PRICING_CONFIG[plan].features
}

export function getAllPlans() {
  return Object.keys(PRICING_CONFIG) as PlanType[]
}