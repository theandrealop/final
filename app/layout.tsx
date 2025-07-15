import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SiteNavigation } from "@/components/site-navigation"
import { GoogleAnalytics } from "@/components/google-analytics"
import { OrganizationSchema, WebsiteSchema } from "@/components/structured-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Punti Furbi - Risparmia fino al 90% sui voli",
  description:
    "Punti Furbi ti aiuta a risparmiare fino al 90% sui voli con avvisi in tempo reale su tariffe errore e offerte esclusive. Iscriviti per ricevere notifiche sui migliori voli furbi!",
  keywords: "voli economici, offerte volo, tariffe errore, viaggi low cost, punti furbi",
  authors: [{ name: "Punti Furbi" }],
  creator: "Punti Furbi",
  publisher: "Punti Furbi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://puntifurbi.com"),
  alternates: {
    canonical: "https://puntifurbi.com/",
  },
  openGraph: {
    title: "Punti Furbi - Risparmia fino al 90% sui voli",
    description:
      "Punti Furbi ti aiuta a risparmiare fino al 90% sui voli con avvisi in tempo reale su tariffe errore e offerte esclusive. Iscriviti per ricevere notifiche sui migliori voli furbi!",
    url: "https://puntifurbi.com/",
    siteName: "Punti Furbi",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Punti Furbi - Risparmia fino al 90% sui voli",
    description:
      "Punti Furbi ti aiuta a risparmiare fino al 90% sui voli con avvisi in tempo reale su tariffe errore e offerte esclusive. Iscriviti per ricevere notifiche sui migliori voli furbi!",
    creator: "@puntifurbi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <OrganizationSchema
          name="Punti Furbi"
          url="https://puntifurbi.com"
          logo="https://puntifurbi.com/placeholder-logo.png"
          socialLinks={[
            "https://facebook.com/puntifurbi",
            "https://twitter.com/puntifurbi",
            "https://instagram.com/puntifurbi"
          ]}
        />
        <WebsiteSchema
          name="Punti Furbi"
          url="https://puntifurbi.com"
          description="Punti Furbi ti aiuta a risparmiare fino al 90% sui voli con avvisi in tempo reale su tariffe errore e offerte esclusive. Iscriviti per ricevere notifiche sui migliori voli furbi!"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <SiteNavigation />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
