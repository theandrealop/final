import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SiteNavigation } from "@/components/site-navigation"
import { GoogleAnalytics } from "@/components/google-analytics"
import { OrganizationSchema, WebsiteSchema } from "@/components/structured-data"
import { ClientCacheBuster, DynamicBlogMetaTags } from "@/components/client-cache-buster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Punti Furbi - Risparmia fino al 90% sui voli",
  description:
    "Punti Furbi: risparmia fino al 90% sui voli con avvisi in tempo reale. Iscriviti per notifiche su tariffe errore e offerte esclusive!",
  keywords: "voli economici, offerte volo, tariffe errore, viaggi low cost, punti furbi",
  authors: [{ name: "Punti Furbi" }],
  creator: "Punti Furbi",
  publisher: "Punti Furbi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.puntifurbi.com"),
  alternates: {
    canonical: "https://www.puntifurbi.com/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Punti Furbi - Risparmia fino al 90% sui voli",
    description:
      "Punti Furbi: risparmia fino al 90% sui voli con avvisi in tempo reale. Iscriviti per notifiche su tariffe errore e offerte esclusive!",
    url: "https://www.puntifurbi.com/",
    siteName: "Punti Furbi",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Punti Furbi - Risparmia sui voli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Punti Furbi - Risparmia fino al 90% sui voli",
    description:
      "Punti Furbi: risparmia fino al 90% sui voli con avvisi in tempo reale. Iscriviti per notifiche su tariffe errore e offerte esclusive!",
    creator: "@puntifurbi",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "google-site-verification-code",
  },
  category: "travel",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteNavigation />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
          <GoogleAnalytics />
          <OrganizationSchema />
          <WebsiteSchema />
          <DynamicBlogMetaTags />
          <ClientCacheBuster />
        </ThemeProvider>
      </body>
    </html>
  )
}
