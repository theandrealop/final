"use client"

import { useState, useEffect } from "react"
import type { BlogPost } from "@/lib/graphql-api"
import { BlogList } from "./blog-list"

interface BlogPageClientProps {
  initialPosts: BlogPost[]
  hasNextPage: boolean
  endCursor: string | null
  error?: string
}

export function BlogPageClient({
  initialPosts,
  hasNextPage: initialHasNextPage,
  endCursor: initialEndCursor,
  error
}: BlogPageClientProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [endCursor, setEndCursor] = useState(initialEndCursor)
  const [retryCount, setRetryCount] = useState(0)

  // Handler per ricarica pagina (solo client-side)
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  // Handler per retry automatico in caso di errore
  const handleRetry = async () => {
    if (retryCount >= 3) {
      console.log("🚫 Massimo numero di retry raggiunto")
      return
    }

    setRetryCount(prev => prev + 1)
    console.log(`🔄 Tentativo di retry ${retryCount + 1}/3...`)
    
    // Delay progressivo per retry
    const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
    setTimeout(handleReload, delay)
  }

  // Gestione errori con retry automatico
  useEffect(() => {
    if (error && posts.length === 0 && retryCount < 3) {
      console.log("🤖 Errore rilevato, tentativo retry automatico...")
      const timer = setTimeout(handleRetry, 2000)
      return () => clearTimeout(timer)
    }
  }, [error, posts.length, retryCount])

  // Se c'è un errore e nessun dato, mostra la UI di errore
  if (error && posts.length === 0) {
    // Error handling più specifico
    let errorMessage = "Il blog non è al momento disponibile. Riprova più tardi."
    let debugInfo = ""
    
    // Errori GraphQL specifici
    if (error.includes('GraphQL')) {
      errorMessage = "Errore nel caricamento dei contenuti del blog. Stiamo lavorando per risolverlo."
      debugInfo = "Errore GraphQL: problema nell'API dei contenuti"
    }
    // Errori di rete
    else if (error.includes('fetch') || error.includes('HTTP error')) {
      errorMessage = "Problemi di connessione. Controlla la tua connessione internet e riprova."
      debugInfo = "Errore di rete: impossibile contattare il server"
    }
    // Errori di parsing JSON
    else if (error.includes('JSON')) {
      errorMessage = "Errore nel formato dei dati. Il problema è stato segnalato al nostro team tecnico."
      debugInfo = "Errore parsing: risposta server non valida"
    }
    // Rate limiting
    else if (error.includes('429') || error.includes('rate limit')) {
      errorMessage = "Il servizio è temporaneamente occupato. Stiamo riprovando automaticamente..."
      debugInfo = "Errore rate limiting: troppe richieste"
    }

    return (
      <div className="min-h-screen bg-cream" data-blog-content="error">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold mb-4 text-dark-green">
              Blog temporaneamente non disponibile
            </h1>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            
            {/* Indicatore retry */}
            {retryCount > 0 && retryCount < 3 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">
                  🔄 Tentativo {retryCount}/3 - Riprovando automaticamente...
                </p>
              </div>
            )}
            
            {/* Informazioni per il debugging (solo in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-left max-w-2xl mx-auto">
                <h3 className="text-sm font-medium text-red-800 mb-2">Debug Info (solo development):</h3>
                <p className="text-sm text-red-700 mb-2">{debugInfo}</p>
                <pre className="text-xs text-red-600 overflow-auto">
                  {error}
                </pre>
              </div>
            )}

            {/* Suggerimenti per l'utente */}
            <div className="mt-6 text-sm text-gray-500">
              <p>Puoi provare a:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Ricaricare la pagina</li>
                <li>Controllare la tua connessione internet</li>
                <li>Riprovare tra qualche minuto</li>
              </ul>
            </div>

            {/* Pulsante di ricarica */}
            <button
              onClick={handleReload}
              disabled={retryCount >= 3}
              className="mt-6 px-6 py-2 bg-dark-green text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {retryCount >= 3 ? 'Ricarica manualmente' : 'Ricarica la pagina'}
            </button>

            {retryCount >= 3 && (
              <p className="mt-4 text-sm text-gray-500">
                Se il problema persiste, contatta il supporto tecnico.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // UI normale del blog
  return (
    <div className="min-h-screen bg-cream" data-blog-content="true">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-dark-green">Blog</h1>
          <p className="text-xl text-gray-600 mb-8">
            Scopri le ultime notizie e consigli sui viaggi e i punti fedeltà
          </p>

          {/* Mostra warning se ci sono errori ma abbiamo dati */}
          {error && posts.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">
                ⚠️ Alcuni contenuti potrebbero non essere aggiornati. Il servizio si sta ripristinando.
              </p>
            </div>
          )}

          {posts.length > 0 ? (
            <BlogList 
              initialPosts={posts} 
              hasNextPage={hasNextPage} 
              endCursor={endCursor} 
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4 text-dark-green">
                Nessun articolo disponibile
              </h2>
              <p className="text-gray-600">
                Gli articoli del blog saranno disponibili a breve.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}