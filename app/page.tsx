"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { subscribeToNewsletter } from "@/lib/buttondown"
import { NewsletterPopup } from "@/components/newsletter-popup"

export default function PuntiFurbiHomepage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [screenSize, setScreenSize] = useState("desktop")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize("mobile")
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet")
      } else {
        setScreenSize("desktop")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const testimonials = [
    {
      name: "Marco R.",
      text: "Ho trovato una vacanza perfetta per tutta la famiglia grazie a Punti Furbi! Risparmiato oltre 600€.",
      image: "https://i.imgur.com/mR4OFJ6.jpeg",
    },
    {
      name: "Giulia M.",
      text: "Incredibile! Sono riuscita a volare a New York spendendo la metà del prezzo normale.",
      image: "https://i.imgur.com/Z3VfOYP.jpeg",
    },
    {
      name: "Alessandro T.",
      text: "Gli avvisi di Punti Furbi mi hanno fatto risparmiare migliaia di euro sui voli per il Giappone.",
      image: "https://us.123rf.com/450wm/satura86/satura861708/satura86170801548/84040788-coppia-di-turisti-prendendo-selfie-sulla-spiaggia-concetto-di-vacanza-amore-viaggi-e-vacanze.jpg",
    },
    {
      name: "Carla S.",
      text: "Finalmente posso permettermi di viaggiare spesso grazie alle offerte di Punti Furbi!",
      image: "https://preview.redd.it/vacation-selfie-v0-acwyez0cavye1.jpeg",
    },
    {
      name: "Luca P.",
      text: "Con Punti Furbi ho scoperto destinazioni che non avrei mai pensato di potermi permettere.",
      image: "https://us.123rf.com/450wm/chalabala/chalabala1601/chalabala160100085/50765742-young-man-on-vacation-taking-selfie-in-the-sea.jpg",
    },
    {
      name: "Sofia B.",
      text: "Le notifiche di Punti Furbi sono sempre puntuali e mi hanno fatto risparmiare centinaia di euro.",
      image: "https://st3.depositphotos.com/1200816/15288/i/450/depositphotos_152888356-stock-photo-young-woman-taking-selfie.jpg",
    },
  ]

  const getCardsToShow = () => {
    switch (screenSize) {
      case "mobile":
        return 1
      case "tablet":
        return 2
      case "desktop":
        return 3
      default:
        return 3
    }
  }

  const cardsToShow = getCardsToShow()
  const maxIndex = testimonials.length - cardsToShow

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const getVisibleTestimonials = () => {
    const visible = []
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentTestimonial + i) % testimonials.length
      visible.push(testimonials[index])
    }
    return visible
  }

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

  const handleNewsletterClick = () => {
    setShowNewsletterPopup(true)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#483cff]/5 to-light-green/10 text-[rgba(255,193,170,1)] bg-[rgba(255,254,240,1)]"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-light-green text-dark-green animate-bounce-in">
  <div className="flex -space-x-3">
    <img ... />
    <img ... />
    <img ... />
  </div>
  <div className="flex flex-col justify-center ml-4 mr-4">
    <span className="text-lg font-semibold leading-tight">Amato</span>
    <span className="text-lg font-semibold leading-tight">da 20k+</span>
  </div>
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
    ))}
    <span className="ml-2 text-lg font-semibold">valutazione</span>
  </div>
</div>
              {/* Headline */}
              <div className="space-y-2 animate-fade-in-up animation-delay-200">
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight font-pp-mori mb-6 lg:mb-8 text-center md:text-left">
                  <span className="text-[#483cff] font-pp-mori font-extrabold">Risparmia fino al </span>
                  <span className="text-dark-green font-pp-mori font-extrabold">90% sui voli</span>
                </h1>
              </div>

              {/* Subheadline */}
              <p className="text-3xl lg:text-4xl font-pp-mori font-normal text-dark-green animate-fade-in-up animation-delay-400 mb-10 lg:mb-12 text-center md:text-left">
                Organizza viaggi. Ricevi avvisi. Vola spendendo meno.
              </p>

              {/* Newsletter Signup */}
              <div className="animate-fade-in-up animation-delay-600">
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="La tua email"
                    required
                    className="flex-1 px-6 py-5 text-2xl rounded-xl border-2 border-gray-200 focus:border-[#483cff] focus:outline-none font-pp-mori min-h-[64px] h-[64px]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 bg-[#483cff] text-white rounded-full font-extrabold text-2xl font-pp-mori hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[64px] h-[64px] flex items-center justify-center flex-shrink-0"
                  >
                    {isSubmitting ? "..." : "Iscriviti"}
                  </button>
                </form>
                {submitMessage && (
                  <p className={`text-lg mt-2 ${submitMessage.includes("Grazie") ? "text-green-600" : "text-red-600"}`}>
                    {submitMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in-right">
              <div className="relative">
                {/* Background Circle */}
                <div
                  className="absolute inset-0 w-96 h-96 rounded-full opacity-20 bg-gradient-to-br from-[#483cff] to-light-green transform -translate-x-10 -translate-y-10"
                  style={{ transform: `translate(-10%, -10%) rotate(${scrollY * 0.1}deg)` }}
                ></div>

                {/* Phone Mockup */}
                <div className="relative z-10 w-72 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl phone-float">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Phone Screen Content */}
                    <div className="absolute inset-0">
                      <img
                        src="https://images.pexels.com/photos/161251/senso-ji-temple-japan-kyoto-landmark-161251.jpeg"
                        alt="Senso-ji temple in Kyoto, Japan"
                        className="w-full h-full object-cover"
                      />

                      {/* Notification Overlay */}
                      <div className="absolute top-20 left-4 right-4 animate-slide-in-down animation-delay-800">
                        <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">PF</span>
                            </div>
                            <span className="font-semibold text-sm">Punti Furbi</span>
                          </div>
                          <h3 className="font-bold text-lg mb-1">Nuova offerta!</h3>
                          <p className="text-sm text-gray-600 mb-2">Roma - Tokyo</p>
                          <p className="text-2xl font-bold text-[#483cff]">389€ A/R</p>
                          <p className="text-xs text-gray-500">Risparmi 65% sul prezzo normale</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Press Logos */}
          <div className="mt-16 pt-8 border-t border-gray-200 animate-fade-in-up animation-delay-1000">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
              <img
                src="https://i.imgur.com/aS3Rjbp.png"
                alt="Today"
                className="h-20 w-auto hover:opacity-70 transition-opacity"
              />
              <img
                src="https://i.imgur.com/p7NjAkU.png"
                alt="The New York Times"
                className="h-20 w-auto hover:opacity-70 transition-opacity"
              />
              <img
                src="https://i.imgur.com/6YmMRjG.png"
                alt="Good Morning America"
                className="h-20 w-auto hover:opacity-70 transition-opacity"
              />
              <img
                src="https://i.imgur.com/Nm4pAwD.png"
                alt="The Washington Post"
                className="h-20 w-auto hover:opacity-70 transition-opacity"
              />
              <img
                src="https://i.imgur.com/2h2kJjb.png"
                alt="Live Kelly & Ryan"
                className="h-20 w-auto hover:opacity-70 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-light-green relative">
        <div className="absolute inset-0 opacity-30" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 text-dark-green font-pp-mori">Stanco di cercare offerte sui voli?</h2>
            <p className="text-2xl lg:text-3xl font-extrabold text-[#483cff] font-pp-mori">Punti Furbi rende il viaggio più semplice</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 mb-12">
            {/* Feature 1 */}
            <div className="text-center space-y-6 animate-fade-in-up animation-delay-200">
              <div className="flex justify-center">
                <div className="w-48 h-80 bg-black rounded-3xl p-1 shadow-xl feature-card">
                  <div
                    className="w-full h-full bg-white rounded-[1.4rem] overflow-hidden relative"
                    style={{
                      backgroundImage:
                        "url('https://images.pexels.com/photos/161251/senso-ji-temple-japan-kyoto-landmark-161251.jpeg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-dark-green">Tieni traccia dei prezzi di tutti i tuoi viaggi</h3>
                <p className="text-gray-700">
                  Inserisci i dettagli del tuo viaggio: monitoriamo i prezzi e ti avvisiamo quando cambiano.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="text-center space-y-6 animate-fade-in-up animation-delay-400">
              <div className="flex justify-center">
                <div className="w-48 h-80 bg-black rounded-3xl p-1 shadow-xl feature-card">
                  <div
                    className="w-full h-full bg-white rounded-[1.4rem] overflow-hidden relative"
                    style={{
                      backgroundImage: "url('https://images.pexels.com/photos/5081424/pexels-photo-5081424.jpeg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-dark-green">Offerte per le tue destinazioni da sogno</h3>
                <p className="text-gray-700">
                  Ricevi avvisi su cali di prezzo e tariffe errore. Troviamo le migliori offerte: tu devi solo
                  prenotare.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="text-center space-y-6 animate-fade-in-up animation-delay-600">
              <div className="flex justify-center">
                <div className="w-48 h-80 bg-black rounded-3xl p-1 shadow-xl feature-card">
                  <div
                    className="w-full h-full bg-white rounded-[1.4rem] overflow-hidden relative"
                    style={{
                      backgroundImage: "url('https://images.pexels.com/photos/2033343/pexels-photo-2033343.jpeg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-dark-green">Prenota il tuo volo dove vuoi</h3>
                <p className="text-gray-700">
                  Ti piace un'offerta? Prenota direttamente con la compagnia aerea, senza intermediari né sovrapprezzi.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center animate-fade-in-up animation-delay-800">
            <button
              onClick={handleNewsletterClick}
              className="px-8 py-4 text-lg rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Iscriviti
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 overflow-visible">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl lg:text-5xl font-extrabold mb-4 text-dark-green font-pp-mori">
              Unisciti a milioni di viaggiatori che risparmiano
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg font-medium text-dark-green">Valutato eccellente su TrustPilot</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-green-500 text-green-500" />
                ))}
              </div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto animate-fade-in-up animation-delay-200 overflow-visible">
            {/* Carousel Container with responsive height and spacing */}
            <div className="min-h-[450px] sm:min-h-[420px] lg:min-h-[400px] flex items-center justify-center overflow-visible py-4 sm:py-6 lg:py-8">
              <div
                className={`flex items-stretch justify-center overflow-visible ${
                  screenSize === "mobile" ? "w-full px-4" : screenSize === "tablet" ? "space-x-4" : "space-x-6"
                }`}
              >
                {getVisibleTestimonials().map((testimonial, index) => (
                  <div
                    key={`${testimonial.name}-${currentTestimonial}-${index}`}
                    className={`flex-shrink-0 bg-light-green rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 text-center space-y-4 testimonial-card flex flex-col ${
                      screenSize === "mobile" ? "w-full max-w-sm mx-auto" : screenSize === "tablet" ? "w-72" : "w-80"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <h3 className="text-xl font-bold text-dark-green">{testimonial.name}</h3>
                      <p className="text-gray-700">{testimonial.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Popup */}
      <NewsletterPopup isOpen={showNewsletterPopup} onClose={() => setShowNewsletterPopup(false)} />
    </div>
  )
}
