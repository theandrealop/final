"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ArrowLeft, Mail, Sparkles } from "lucide-react"
import Link from "next/link"
import { useGoogleTagManager } from "@/components/google-tag-manager"

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { trackEvent, trackPageView } = useGoogleTagManager()
  const searchParams = useSearchParams()

  useEffect(() => {
    const session_id = searchParams.get('session_id')
    setSessionId(session_id)
    
    // Track page view
    trackPageView('/success', 'Checkout Success - Punti Furbi')
    
    // Track successful purchase
    if (session_id) {
      trackEvent('purchase_completed', {
        session_id,
        currency: 'EUR',
        event_category: 'checkout',
        event_label: 'subscription_completed'
      })
    }
  }, [searchParams, trackEvent, trackPageView])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <CheckCircle className="text-green-500" size={80} />
            <Sparkles className="absolute -top-2 -right-2 text-yellow-500" size={24} />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl lg:text-5xl font-bold text-dark-green mb-6 font-pp-mori">
          Benvenuto in Punti Furbi! 🎉
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          Il tuo pagamento è stato completato con successo. 
          Ora hai accesso a tutte le funzionalità del tuo piano!
        </p>

        {/* What's Next */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-dark-green mb-4">
            Cosa succede ora?
          </h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <Mail className="text-blue-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-dark-green">Controlla la tua email</h3>
                <p className="text-gray-600 text-sm">
                  Ti abbiamo inviato una email di conferma con tutti i dettagli del tuo abbonamento.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-dark-green">Accesso immediato</h3>
                <p className="text-gray-600 text-sm">
                  Puoi iniziare subito a usare tutte le funzionalità del tuo piano.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Sparkles className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-dark-green">Prime offerte in arrivo</h3>
                <p className="text-gray-600 text-sm">
                  Riceverai le prime offerte esclusive entro 24 ore.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Inizia a esplorare
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="mr-2" size={16} />
            Torna alla homepage
          </Link>
        </div>

        {/* Session Info (for debugging in development) */}
        {process.env.NODE_ENV === 'development' && sessionId && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Debug: Session ID: {sessionId}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}