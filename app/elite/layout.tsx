import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Punti Furbi Elite €19,90/mese | Concierge VIP e Servizi Premium",
  description: "Abbonati al piano Elite di Punti Furbi per €19,90/mese. Concierge personale, consulenze travel hacking, accesso VIP e servizi premium esclusivi.",
  keywords: "punti furbi elite, concierge vip, travel hacking, consulenze viaggi, first class, business class, punti miglia",
  openGraph: {
    title: "Punti Furbi Elite €19,90/mese | Concierge VIP e Servizi Premium",
    description: "Il piano più esclusivo di Punti Furbi. Concierge personale e accesso VIP per €19,90/mese.",
    url: "https://puntifurbi.com/elite/",
    type: "website",
    images: [
      {
        url: "/og-elite.jpg",
        width: 1200,
        height: 630,
        alt: "Punti Furbi Elite - Servizi VIP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Punti Furbi Elite €19,90/mese",
    description: "Concierge personale e servizi VIP per viaggiatori esigenti. Abbonati oggi!",
    images: ["/og-elite.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
  },
  alternates: {
    canonical: "https://puntifurbi.com/elite/",
  },
}

export default function EliteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data per Elite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Punti Furbi Elite",
            description: "Piano Elite con concierge personale e servizi VIP per viaggiatori esigenti",
            brand: {
              "@type": "Brand",
              name: "Punti Furbi"
            },
            offers: {
              "@type": "Offer",
              name: "Piano Elite",
              price: "19.90",
              priceCurrency: "EUR",
              priceValidUntil: "2025-12-31",
              availability: "https://schema.org/InStock",
              url: "https://puntifurbi.com/checkout?plan=elite",
              priceSpecification: {
                "@type": "RecurringPaymentFrequency",
                frequency: "P1M"
              }
            },
            category: "Premium Travel Services",
            audience: {
              "@type": "Audience",
              audienceType: "Luxury Travel Enthusiasts"
            },
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Concierge Service",
                value: "Personal travel concierge included"
              },
              {
                "@type": "PropertyValue", 
                name: "VIP Access",
                value: "Exclusive VIP offers and early access"
              }
            ]
          })
        }}
      />
      {children}
    </>
  )
}