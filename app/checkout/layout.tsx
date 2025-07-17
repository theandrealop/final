import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout - Abbonati a Punti Furbi | Voli Scontati fino al 90%",
  description: "Completa l'abbonamento a Punti Furbi e inizia a risparmiare sui voli. Piano Premium €4,90/mese e Elite €19,90/mese. Offerte esclusive e tariffe errore.",
  keywords: "abbonamento punti furbi, voli economici, checkout, premium, elite, tariffe errore",
  openGraph: {
    title: "Checkout - Abbonati a Punti Furbi | Voli Scontati fino al 90%",
    description: "Completa l'abbonamento a Punti Furbi e inizia a risparmiare sui voli. Piano Premium €4,90/mese e Elite €19,90/mese.",
    url: "https://puntifurbi.com/checkout/",
    type: "website",
    images: [
      {
        url: "/og-checkout.jpg",
        width: 1200,
        height: 630,
        alt: "Punti Furbi Checkout - Abbonati ora",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout - Abbonati a Punti Furbi",
    description: "Completa l'abbonamento e inizia a risparmiare sui voli oggi stesso.",
    images: ["/og-checkout.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
  },
  alternates: {
    canonical: "https://puntifurbi.com/checkout/",
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data per Checkout */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Punti Furbi Premium & Elite",
            description: "Servizio di notifiche per voli economici e offerte esclusive",
            brand: {
              "@type": "Brand",
              name: "Punti Furbi"
            },
            offers: [
              {
                "@type": "Offer",
                name: "Piano Premium",
                price: "4.90",
                priceCurrency: "EUR",
                priceValidUntil: "2025-12-31",
                availability: "https://schema.org/InStock",
                url: "https://puntifurbi.com/checkout?plan=premium"
              },
              {
                "@type": "Offer", 
                name: "Piano Elite",
                price: "19.90",
                priceCurrency: "EUR",
                priceValidUntil: "2025-12-31",
                availability: "https://schema.org/InStock",
                url: "https://puntifurbi.com/checkout?plan=elite"
              }
            ]
          })
        }}
      />
      {children}
    </>
  )
}