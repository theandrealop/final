import { Suspense } from "react"
import { getAllPosts } from "@/lib/graphql-api"
import { BlogList } from "@/components/blog-list"
import { Skeleton } from "@/components/ui/skeleton"

function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex items-center space-x-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

async function BlogPageContent() {
  try {
    console.log("🚀 BlogPageContent: Iniziando caricamento posts...")
    const { posts, hasNextPage, endCursor } = await getAllPosts(12)
    console.log("✅ BlogPageContent: Posts caricati con successo:", posts.length)

    return (
      <div className="min-h-screen bg-cream" data-blog-content="true">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-dark-green">Blog</h1>
            <p className="text-xl text-gray-600 mb-8">
              Scopri le ultime notizie e consigli sui viaggi e i punti fedeltà
            </p>

            {posts.length > 0 ? (
              <BlogList initialPosts={posts} hasNextPage={hasNextPage} endCursor={endCursor} />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4 text-dark-green">Nessun articolo disponibile</h2>
                <p className="text-gray-600">Gli articoli del blog saranno disponibili a breve.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("💥 BlogPageContent: Errore nel caricamento posts:", error)
    
    // Error handling più specifico
    let errorMessage = "Il blog non è al momento disponibile. Riprova più tardi."
    let debugInfo = ""
    
    if (error instanceof Error) {
      // Errori GraphQL specifici
      if (error.message.includes('GraphQL')) {
        errorMessage = "Errore nel caricamento dei contenuti del blog. Stiamo lavorando per risolverlo."
        debugInfo = "Errore GraphQL: problema nell'API dei contenuti"
      }
      // Errori di rete
      else if (error.message.includes('fetch') || error.message.includes('HTTP error')) {
        errorMessage = "Problemi di connessione. Controlla la tua connessione internet e riprova."
        debugInfo = "Errore di rete: impossibile contattare il server"
      }
      // Errori di parsing JSON
      else if (error.message.includes('JSON')) {
        errorMessage = "Errore nel formato dei dati. Il problema è stato segnalato al nostro team tecnico."
        debugInfo = "Errore parsing: risposta server non valida"
      }
    }

    return (
      <div className="min-h-screen bg-cream" data-blog-content="error">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold mb-4 text-dark-green">Blog temporaneamente non disponibile</h1>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            
            {/* Informazioni per il debugging (solo in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-left max-w-2xl mx-auto">
                <h3 className="text-sm font-medium text-red-800 mb-2">Debug Info (solo development):</h3>
                <p className="text-sm text-red-700 mb-2">{debugInfo}</p>
                <pre className="text-xs text-red-600 overflow-auto">
                  {error instanceof Error ? error.stack : String(error)}
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
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-dark-green text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogPageContent />
    </Suspense>
  )
}

export const metadata = {
  title: "Blog - Punti Furbi",
  description: "Scopri i nostri articoli su viaggi, punti fedeltà e offerte esclusive.",
  other: {
    'Cache-Control': 'max-age=300, must-revalidate', // Meno aggressivo: 5 minuti
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}
