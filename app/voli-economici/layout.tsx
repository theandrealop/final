import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voli Economici - Le Migliori Offerte di Volo | Punti Furbi',
  description: 'Trova voli economici con sconti fino al 90%. Offerte aggiornate in tempo reale per viaggiare risparmiando da Roma, Milano e altre città italiane.',
  keywords: 'voli economici, offerte volo, voli low cost, viaggi economici, sconti voli, voli scontati',
  metadataBase: new URL('https://puntifurbi.com'),
  alternates: {
    canonical: 'https://puntifurbi.com/voli-economici/',
  },
  openGraph: {
    title: 'Voli Economici - Le Migliori Offerte di Volo | Punti Furbi',
    description: 'Trova voli economici con sconti fino al 90%. Offerte aggiornate in tempo reale per viaggiare risparmiando da Roma, Milano e altre città italiane.',
    url: 'https://puntifurbi.com/voli-economici/',
    siteName: 'Punti Furbi',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voli Economici - Le Migliori Offerte di Volo | Punti Furbi',
    description: 'Trova voli economici con sconti fino al 90%. Offerte aggiornate in tempo reale per viaggiare risparmiando da Roma, Milano e altre città italiane.',
    creator: '@puntifurbi',
  },
}

export default function VoliEconomiciLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}