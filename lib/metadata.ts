import { Metadata } from 'next'

const SITE_URL = 'https://puntifurbi.com'
const SITE_NAME = 'Punti Furbi'

interface PageMetadata {
  title: string
  description: string
  path: string
  keywords?: string
  openGraphImage?: string
}

export function generateMetadata({
  title,
  description,
  path,
  keywords,
  openGraphImage,
}: PageMetadata): Metadata {
  const canonicalUrl = `${SITE_URL}${path}`
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`
  
  return {
    title: fullTitle,
    description,
    keywords: keywords || 'voli economici, offerte volo, tariffe errore, viaggi low cost, punti furbi',
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'it_IT',
      type: 'website',
      images: openGraphImage ? [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@puntifurbi',
      images: openGraphImage ? [openGraphImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'google-site-verification': '', // Add your Google Search Console verification code here if needed
    },
  }
}

export const defaultMetadata = generateMetadata({
  title: 'Punti Furbi - Risparmia fino al 90% sui voli',
  description: 'Scopri le migliori offerte di volo e risparmia fino al 90% sui tuoi viaggi. Notifiche in tempo reale per tariffe errore e offerte esclusive.',
  path: '/',
})

export const pageMetadata = {
  home: generateMetadata({
    title: 'Punti Furbi - Risparmia fino al 90% sui voli',
    description: 'Scopri le migliori offerte di volo e risparmia fino al 90% sui tuoi viaggi. Notifiche in tempo reale per tariffe errore e offerte esclusive.',
    path: '/',
  }),
  voliEconomici: generateMetadata({
    title: 'Voli Economici - Le Migliori Offerte di Volo',
    description: 'Trova voli economici con sconti fino al 90%. Offerte aggiornate in tempo reale per viaggiare risparmiando da Roma, Milano e altre città italiane.',
    path: '/voli-economici/',
    keywords: 'voli economici, offerte volo, voli low cost, viaggi economici, sconti voli, voli scontati',
  }),
  blog: generateMetadata({
    title: 'Blog - Guide e Consigli di Viaggio',
    description: 'Scopri i nostri consigli di viaggio, guide pratiche e trucchi per risparmiare sui voli. Articoli aggiornati per viaggiatori esperti.',
    path: '/blog/',
    keywords: 'consigli viaggio, guide viaggio, trucchi voli, risparmio viaggi, blog viaggio',
  }),
  comeFunziona: generateMetadata({
    title: 'Come Funziona - Guida a Punti Furbi',
    description: 'Scopri come funziona Punti Furbi e come ricevere notifiche in tempo reale per le migliori offerte di volo e tariffe errore.',
    path: '/come-funziona/',
    keywords: 'come funziona punti furbi, guida, istruzioni, tariffe errore, notifiche voli',
  }),
  premium: generateMetadata({
    title: 'Premium - Accesso Esclusivo alle Migliori Offerte',
    description: 'Accedi al piano Premium di Punti Furbi per ricevere offerte esclusive, notifiche prioritarie e risparmi maggiori sui tuoi voli.',
    path: '/premium/',
    keywords: 'premium punti furbi, offerte esclusive, voli premium, abbonamento premium',
  }),
  elite: generateMetadata({
    title: 'Elite - Il Massimo del Risparmio sui Voli',
    description: 'Diventa membro Elite e accedi alle offerte più esclusive, con sconti fino al 90% e servizio prioritario per i tuoi viaggi.',
    path: '/elite/',
    keywords: 'elite punti furbi, offerte elite, massimo risparmio, voli elite, servizio esclusivo',
  }),
}