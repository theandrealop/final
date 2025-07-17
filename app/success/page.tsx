"use client"

import { useEffect } from "react"
import { CheckCircle, Mail, ArrowRight, Star, Crown } from "lucide-react"
import Link from "next/link"
import { useGoogleTagManager } from "@/components/google-tag-manager"
import { useSearchParams } from "next/navigation"

// Forza la pagina a essere dinamica
export const dynamic = 'force-dynamic'

export default function SuccessPage() {
  const { trackEvent, trackPageView } = useGoogleTagManager()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view
    trackPageView('/success', 'Pagamento Completato - Punti Furbi')
    
    // Track successful purchase
    trackEvent('purchase_completed', {
      currency: 'EUR',
      transaction_id: searchParams.get('session_id') || `success_${Date.now()}`,
      event_category: 'ecommerce',
      event_label: 'subscription_success'
    })

    // Track conversion
    trackEvent('conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Da configurare
      currency: 'EUR',
      transaction_id: searchParams.get('session_id') || `success_${Date.now()}`
    })
  }, [trackEvent, trackPageView, searchParams])

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Link href="/" className="text-2xl font-bold text-[#483cff]">
              Punti Furbi
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl lg:text-5xl font-bold text-dark-green mb-6">
            Pagamento completato con successo! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Benvenuto nella famiglia Punti Furbi! La tua sottoscrizione è ora attiva 
            e riceverai presto un'email di conferma con tutti i dettagli.
          </p>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-dark-green mb-6">
              Cosa succede ora?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-dark-green mb-2">
                  Email di conferma
                </h3>
                <p className="text-gray-600 text-sm">
                  Riceverai un'email con i dettagli del tuo abbonamento e le istruzioni per iniziare
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-dark-green mb-2">
                  Accesso immediato
                </h3>
                <p className="text-gray-600 text-sm">
                  Il tuo account è già attivo e puoi iniziare a ricevere le nostre offerte esclusive
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-dark-green mb-2">
                  Offerte esclusive
                </h3>
                <p className="text-gray-600 text-sm">
                  Inizierai a ricevere le migliori offerte di volo direttamente nella tua inbox
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Reminder */}
          <div className="bg-gradient-to-r from-[#483cff] to-purple-600 rounded-lg p-8 text-white mb-12">
            <h2 className="text-2xl font-bold mb-4">
              I tuoi vantaggi sono già attivi
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span>Offerte esclusive Economy e Premium</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span>Segnalazioni error fare premium</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span>Supporto prioritario via email</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span>Accesso a offerte riservate</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-lg rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Torna alla Homepage
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <p className="text-sm text-gray-600">
              Hai domande? Contattaci all'indirizzo{" "}
              <a href="mailto:support@puntifurbi.com" className="text-[#483cff] hover:underline">
                support@puntifurbi.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}