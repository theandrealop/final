import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Punti Furbi Premium €4,90/mese | Voli Economici e Offerte Esclusive",
  description: "Abbonati al piano Premium di Punti Furbi per €4,90/mese. Accesso a offerte esclusive, tariffe errore e notifiche in tempo reale sui voli più economici.",
  keywords: "punti furbi premium, voli economici, offerte volo, tariffe errore, business class scontati, premium economy",
  openGraph: {
    title: "Punti Furbi Premium €4,90/mese | Voli Economici e Offerte Esclusive",
    description: "Abbonati al piano Premium per accedere a offerte esclusive e tariffe errore sui voli. Solo €4,90/mese.",
    url: "https://puntifurbi.com/premium/",
    type: "website",
    images: [
      {
        url: "/og-premium.jpg",
        width: 1200,
        height: 630,
        alt: "Punti Furbi Premium - Voli economici",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Punti Furbi Premium €4,90/mese",
    description: "Accesso a offerte esclusive sui voli e tariffe errore. Abbonati oggi!",
    images: ["/og-premium.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
  },
  alternates: {
    canonical: "https://puntifurbi.com/premium/",
  },
}

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data per Premium */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Punti Furbi Premium",
            description: "Piano Premium per ricevere offerte esclusive sui voli e tariffe errore",
            brand: {
              "@type": "Brand",
              name: "Punti Furbi"
            },
            offers: {
              "@type": "Offer",
              name: "Piano Premium",
              price: "4.90",
              priceCurrency: "EUR",
              priceValidUntil: "2025-12-31",
              availability: "https://schema.org/InStock",
              url: "https://puntifurbi.com/checkout?plan=premium",
              priceSpecification: {
                "@type": "RecurringPaymentFrequency",
                frequency: "P1M"
              }
            },
            category: "Travel Services",
            audience: {
              "@type": "Audience",
              audienceType: "Travel Enthusiasts"
            }
          })
        }}
      />
      {children}
    </>
  )
}