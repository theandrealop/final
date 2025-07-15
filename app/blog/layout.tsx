import { Metadata } from 'next'
import { generateNoCacheMetaTags, getCurrentVersion } from '@/lib/cache-busting'

export const metadata: Metadata = {
  title: 'Blog - Guide e Consigli di Viaggio | Punti Furbi',
  description: 'Scopri i nostri consigli di viaggio, guide pratiche e trucchi per risparmiare sui voli. Articoli aggiornati per viaggiatori esperti.',
  keywords: 'consigli viaggio, guide viaggio, trucchi voli, risparmio viaggi, blog viaggio',
  metadataBase: new URL('https://puntifurbi.com'),
  alternates: {
    canonical: 'https://puntifurbi.com/blog/',
  },
  openGraph: {
    title: 'Blog - Guide e Consigli di Viaggio | Punti Furbi',
    description: 'Scopri i nostri consigli di viaggio, guide pratiche e trucchi per risparmiare sui voli. Articoli aggiornati per viaggiatori esperti.',
    url: 'https://puntifurbi.com/blog/',
    siteName: 'Punti Furbi',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Guide e Consigli di Viaggio | Punti Furbi',
    description: 'Scopri i nostri consigli di viaggio, guide pratiche e trucchi per risparmiare sui voli. Articoli aggiornati per viaggiatori esperti.',
    creator: '@puntifurbi',
  },
  // Cache busting meta tags
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
    'pragma': 'no-cache',
    'expires': '0',
    'version': getCurrentVersion(),
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Additional cache busting meta tags */}
      <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="0" />
      <meta name="cache-control" content="no-cache" />
      <meta name="expires" content="0" />
      <meta name="pragma" content="no-cache" />
      <meta name="version" content={getCurrentVersion()} />
      <meta name="last-modified" content={new Date().toISOString()} />
      {children}
    </>
  )
}