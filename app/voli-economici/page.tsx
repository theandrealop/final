"use client"

import { useState } from "react"
import { Menu, X, ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NewsletterPopup } from "@/components/newsletter-popup"

// Manual offers data - no database needed
const manualOffers = [
  {
    id: 9,
    origin: "Milano",
    destination: "Taipei",
    country: "Taiwan",
    price: 408.00,
    original_price: 1036.00,
    discount: 60,
    dates: "Ottobre - Dicembre 2025",
    airline: "Air China",
    stops: "1 scalo",
    duration: "16h 30m",
    description: "Vola a Taipei partendo da Milano con un conveniente scalo a Pechino.",
    image_url: "photo-1598935898639-81586f7d2129",
    status: "active",
    booking_url: "https://bit.ly/3GwljYb"
  },
  // Some terminated offers for testing
  {
    id: 11,
    origin: "Milano",
    destination: "Miami",
    country: "Stati Uniti",
    price: 249.00,
    original_price: 598.00,
    discount: 58,
    dates: "Settembre - Dicembre 2025",
    airline: "TAP Portugal",
    stops: "1 scalo",
    duration: "12h 30m",
    description: "Voli economici con TAP Portugal",
    image_url: "photo-1501509497947-782640bc1412",
    status: "terminated",
  },
  {
    id: 12,
    origin: "Roma",
    destination: "Los Angeles",
    country: "Stati Uniti",
    price: 390.00,
    original_price: 782.00,
    discount: 50,
    dates: "Agosto - Natale 2025",
    airline: "Norse",
    stops: "Diretto",
    duration: "12h 30m",
    description: "Volo diretto A/R da Roma a Los Angeles a meno di 300€. Possibilità di fare un coast to coast: arrivi a New York e riparti da LA!",
    image_url: "photo-1597982087634-9884f03198ce",
    status: "active",
    booking_url: "https://bit.ly/4kh5D93"
  },
  {
    id: 14,
    origin: "Roma",
    destination: "Johannesburg",
    country: "Sudafrica",
    price: 419.00,
    original_price: 1036.00,
    discount: 59,
    dates: "Settembre - Febbraio 2026",
    airline: "Lufthansa",
    stops: "1 scalo",
    duration: "25h 30m",
    description: "Volo diretto da Roma a Johannesburg a meno di 400€. Scalo a Monaco di Baviera.",
    image_url: "photo-1636706519609-988babca3dd5",
    status: "terminated",
  },
  
]

export default function VoliEconomiciPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
  const [selectedAirport, setSelectedAirport] = useState("Roma")
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false)

  // Filter offers based on selected airport
  const filteredOffers = manualOffers.filter((offer) => offer.origin === selectedAirport)

  // Sort offers: active first, then terminated
  const sortedOffers = [...manualOffers].sort((a, b) => {
    if (a.status === "active" && b.status === "terminated") return -1
    if (a.status === "terminated" && b.status === "active") return 1
    return 0
  })

  const nextOffer = () => {
    setCurrentOfferIndex((prev) => (prev + 1) % sortedOffers.length)
  }

  const prevOffer = () => {
    setCurrentOfferIndex((prev) => (prev - 1 + sortedOffers.length) % sortedOffers.length)
  }

  const airports = ["Roma", "Milano"]

  const handleNewsletterClick = () => {
    setShowNewsletterPopup(true)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Main content only, no custom header here */}
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#483cff]/5 to-light-green/10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-dark-green">
            <span className="text-[#483cff]">Voli economici</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-700 mb-8">
            Scopri le migliori offerte di volo selezionate dai nostri esperti
          </p>
        </div>
      </section>

      {/* Airport Selection Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-light-green rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-dark-green mb-6 text-center">
              Seleziona il tuo aeroporto di partenza
            </h2>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <select
                  value={selectedAirport}
                  onChange={(e) => setSelectedAirport(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-[#483cff] focus:outline-none appearance-none bg-white cursor-pointer"
                >
                  {airports.map((airport) => (
                    <option key={airport} value={airport}>
                      {airport} ({airport === "Roma" ? "FCO" : "MXP"})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={24}
                />
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-[#483cff]">{filteredOffers.length}</span> offerte disponibili da{" "}
                {selectedAirport}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Offers Grid */}
      <section className="py-16 lg:py-24 bg-light-green">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-dark-green">Offerte attive</h2>
            <p className="text-xl text-gray-700">Tutte le migliori offerte disponibili ora</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOffers.map((offer) => {
              const expired = offer.status === "terminated"
              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative ${
                    expired ? "opacity-75" : "hover:-translate-y-1"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={
                        offer.image_url
                          ? `https://images.unsplash.com/${offer.image_url}?w=400&h=250&fit=crop`
                          : "/placeholder.svg?height=250&width=400"
                      }
                      alt={`${offer.destination} destination`}
                      className={`w-full h-48 object-cover transition-all duration-300 ${
                        expired ? "filter grayscale" : ""
                      }`}
                    />
                    {expired && (
                      <div className="absolute inset-0 bg-black/20">
                        <div className="absolute top-0 left-0 w-full h-full">
                          <div className="absolute top-4 -left-8 bg-red-600 text-white px-12 py-1 transform rotate-[-45deg] shadow-lg">
                            <span className="font-bold text-xs tracking-wider">TERMINATA</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-bold text-red-600">-{offer.discount}%</span>
                    </div>
                  </div>

                  <div className={`p-6 transition-all duration-300 ${expired ? "opacity-60" : ""}`}>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-dark-green mb-1">
                          {offer.origin} → {offer.destination}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {offer.description || `${offer.airline} - ${offer.stops}`}
                        </p>
                      </div>

                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-[#483cff]">€{offer.price}</span>
                        <span className="text-sm text-gray-500 line-through">€{offer.original_price}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{offer.dates}</span>
                        </span>
                        <span>{offer.airline}</span>
                      </div>

                      {expired ? (
                        <button
                          disabled
                          className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                        >
                          Terminata
                        </button>
                      ) : offer.booking_url ? (
                        <a
                          href={offer.booking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-2 bg-[#483cff] text-white rounded-lg font-medium hover:opacity-90 transition-opacity inline-block text-center"
                        >
                          Prenota ora
                        </a>
                      ) : (
                        <button className="w-full px-4 py-2 bg-[#483cff] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                          Vedi dettagli
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Nessuna offerta disponibile per {selectedAirport} al momento.</p>
              <p className="text-gray-500 mt-2">Prova a selezionare un altro aeroporto di partenza.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Offer Carousel */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-dark-green">Offerte in evidenza</h2>
            <p className="text-xl text-gray-700">Le migliori occasioni selezionate per te</p>
          </div>

          {sortedOffers.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentOfferIndex * 100}%)` }}
                >
                  {sortedOffers.map((offer) => {
                    const expired = offer.status === "terminated"
                    return (
                      <div key={offer.id} className="w-full flex-shrink-0 relative">
                        <div className="grid lg:grid-cols-2 min-h-[500px]">
                          {/* Image Side */}
                          <div className="relative overflow-hidden">
                            <img
                              src={
                                offer.image_url
                                  ? `https://images.unsplash.com/${offer.image_url}?w=800&h=600&fit=crop`
                                  : "/placeholder.svg?height=600&width=800"
                              }
                              alt={`${offer.destination} destination`}
                              className={`w-full h-full object-cover transition-all duration-300 ${
                                expired ? "filter grayscale" : ""
                              }`}
                            />
                            {expired && (
                              <div className="absolute inset-0 bg-black/20">
                                <div className="absolute top-0 left-0 w-full h-full">
                                  <div className="absolute top-8 -left-12 bg-red-600 text-white px-16 py-2 transform rotate-[-45deg] shadow-lg">
                                    <span className="font-bold text-sm tracking-wider">TERMINATA</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                              <span className="text-sm font-bold text-red-600">-{offer.discount}%</span>
                            </div>
                          </div>

                          {/* Content Side */}
                          <div
                            className={`p-8 lg:p-12 flex flex-col justify-center bg-white transition-all duration-300 ${
                              expired ? "opacity-60" : ""
                            }`}
                          >
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-3xl lg:text-4xl font-bold text-dark-green mb-2">
                                  {offer.origin} → {offer.destination}
                                </h3>
                                <p className="text-gray-600 text-lg">
                                  {offer.description || `${offer.airline} - ${offer.stops}`}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-baseline space-x-2">
                                  <span className="text-4xl lg:text-5xl font-bold text-[#483cff]">€{offer.price}</span>
                                  <span className="text-xl text-gray-500 line-through">€{offer.original_price}</span>
                                </div>
                                <p className="text-gray-600">A/R per persona</p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center space-x-1">
                                    <Calendar size={16} />
                                    <span>{offer.dates}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <span>✈️</span>
                                    <span>{offer.airline}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="pt-4">
                                {expired ? (
                                  <div className="space-y-2">
                                    <button
                                      disabled
                                      className="w-full px-8 py-4 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                                    >
                                      Offerta terminata
                                    </button>
                                    <p className="text-sm text-gray-500 text-center">
                                      Questa offerta non è più disponibile
                                    </p>
                                  </div>
                                ) : offer.booking_url ? (
                                  <a
                                    href={offer.booking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full px-8 py-4 bg-[#483cff] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg inline-block text-center"
                                  >
                                    Prenota ora
                                  </a>
                                ) : (
                                  <button className="w-full px-8 py-4 bg-[#483cff] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg">
                                    Vedi dettagli
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Navigation */}
              <button
                onClick={prevOffer}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft size={24} className="text-dark-green" />
              </button>
              <button
                onClick={nextOffer}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight size={24} className="text-dark-green" />
              </button>

              {/* Dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {sortedOffers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentOfferIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentOfferIndex ? "bg-[#483cff]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Nessuna offerta disponibile al momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-dark-green">
            Non perdere le <span className="text-[#483cff]">prossime offerte</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Iscriviti gratuitamente e ricevi avvisi in tempo reale sulle migliori offerte di volo
          </p>
          <button 
            onClick={handleNewsletterClick}
            className="px-8 py-4 text-lg rounded-full bg-[#483cff] text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Iscriviti gratis
          </button>
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
                Contatti
              </a>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <span className="text-xs font-bold">f</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <span className="text-xs font-bold">t</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <span className="text-xs font-bold">in</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Newsletter Popup */}
      <NewsletterPopup 
        isOpen={showNewsletterPopup} 
        onClose={() => setShowNewsletterPopup(false)} 
      />
    </div>
  )
}
