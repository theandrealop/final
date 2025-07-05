"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, Bell, Plane, CreditCard } from "lucide-react"
import { subscribeToNewsletter } from "@/lib/buttondown"

export default function ComeFunzionaPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const result = await subscribeToNewsletter(email)

      if (result.success) {
        setSubmitMessage(result.message)
        setEmail("")
      } else {
        setSubmitMessage(result.message)
      }
    } catch (error) {
      console.error("Newsletter signup error:", error)
      setSubmitMessage("Andrea it's better to change platform for your newsletter")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#483cff]/5 to-light-green/10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-dark-green">
            Come funziona <span className="text-[#483cff]">Punti Furbi</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-700 mb-8">
            Scopri come risparmiare fino al 90% sui voli in 3 semplici passaggi
          </p>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#483cff] rounded-full flex items-center justify-center mx-auto">
                <Bell className="text-white" size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-dark-green">1. Iscriviti gratis</h3>
                <p className="text-gray-700 leading-relaxed">
                  Crea il tuo account gratuito e imposta le tue preferenze di viaggio. Scegli le destinazioni che ti
                  interessano e il budget che vuoi rispettare.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-light-green rounded-full flex items-center justify-center mx-auto">
                <Plane className="text-dark-green" size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-dark-green">2. Ricevi avvisi personalizzati</h3>
                <p className="text-gray-700 leading-relaxed">
                  Il nostro algoritmo monitora costantemente i prezzi dei voli e ti invia notifiche istantanee quando
                  trova offerte incredibili per le tue destinazioni preferite.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#483cff] rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="text-white" size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-dark-green">3. Prenota e risparmia</h3>
                <p className="text-gray-700 leading-relaxed">
                  Clicca sull'offerta che ti interessa e prenota direttamente con la compagnia aerea. Nessun costo
                  aggiuntivo, solo il prezzo migliore garantito.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-light-green">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-dark-green">Perché scegliere Punti Furbi?</h2>
            <p className="text-xl text-gray-700">Tutto quello che ti serve per viaggiare spendendo meno</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-[#483cff] rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark-green">100% Gratuito</h3>
              <p className="text-gray-700">
                Non paghiamo commissioni o costi nascosti. Il servizio è completamente gratuito per sempre.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-light-green rounded-lg flex items-center justify-center mb-4">
                <Bell className="text-dark-green" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark-green">Avvisi in tempo reale</h3>
              <p className="text-gray-700">
                Ricevi notifiche istantanee quando i prezzi scendono o quando troviamo tariffe errore incredibili.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-[#483cff] rounded-lg flex items-center justify-center mb-4">
                <Plane className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark-green">Prenotazione diretta</h3>
              <p className="text-gray-700">
                Prenoti direttamente con la compagnia aerea, senza intermediari. Massima sicurezza e trasparenza.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-light-green rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="text-dark-green" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark-green">Algoritmo avanzato</h3>
              <p className="text-gray-700">
                La nostra tecnologia monitora milioni di combinazioni di voli per trovare le migliori offerte.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-[#483cff] rounded-lg flex items-center justify-center mb-4">
                <Bell className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark-green">Personalizzazione totale</h3>
              <p className="text-gray-700">
                Imposta le tue preferenze: destinazioni, budget, date flessibili e molto altro ancora.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-light-green rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="text-dark-green" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark-green">Risparmio garantito</h3>
              <p className="text-gray-700">
                I nostri utenti risparmiano in media il 60% sui loro voli. Alcuni arrivano fino al 90% di sconto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-dark-green">
            Pronto a iniziare a <span className="text-[#483cff]">risparmiare</span>?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Unisciti a oltre 2 milioni di viaggiatori che hanno già scoperto il segreto per volare spendendo meno
          </p>

          {/* Email Signup Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="La tua email"
                  required
                  autoComplete="email"
                  className="flex-1 px-6 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-[#483cff] focus:outline-none transition-colors font-pp-mori min-h-[56px]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 text-lg rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg whitespace-nowrap min-h-[56px] flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? "Invio..." : "Iscriviti gratis"}
                </button>
              </div>
              {submitMessage && (
                <p className={`text-sm ${submitMessage.includes("Grazie") ? "text-green-600" : "text-red-600"}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>

          <p className="text-sm text-gray-600">
            Gratuito per sempre • Nessuna carta di credito richiesta • Cancellazione in qualsiasi momento
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-wrap justify-center lg:justify-start space-x-6">
              <a href="#" className="text-sm hover:opacity-70 transition-opacity text-dark-green">
                Privacy
              </a>
              <a href="#" className="text-sm hover:opacity-70 transition-opacity text-dark-green">
                Termini
              </a>
              <a href="#" className="text-sm hover:opacity-70 transition-opacity text-dark-green">
                Cookie
              </a>
              <a href="#" className="text-sm hover:opacity-70 transition-opacity text-dark-green">
                Contatti
              </a>
            </div>
            <div className="text-sm text-gray-600">
              © 2025 Punti Furbi. Tutti i diritti riservati.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
