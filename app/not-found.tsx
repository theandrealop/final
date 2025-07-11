import Link from 'next/link'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-[#483cff] mb-4">404</div>
          <h1 className="text-4xl lg:text-5xl font-bold text-dark-green mb-4">
            Pagina non trovata
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#483cff] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Home className="mr-2" size={20} />
            Torna alla Home
          </Link>
          
          <Link
            href="/voli-economici"
            className="inline-flex items-center px-6 py-3 bg-light-green text-dark-green rounded-lg font-semibold hover:bg-light-green/80 transition-colors"
          >
            <Search className="mr-2" size={20} />
            Vedi le Offerte
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-dark-green mb-4">
            Potresti essere interessato a:
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/voli-economici"
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-dark-green mb-2">Voli Economici</h3>
              <p className="text-gray-600 text-sm">Scopri le migliori offerte di volo</p>
            </Link>
            
            <Link
              href="/blog"
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-dark-green mb-2">Blog</h3>
              <p className="text-gray-600 text-sm">Consigli e guide di viaggio</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}