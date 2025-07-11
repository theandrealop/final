import { Metadata } from 'next'

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
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}