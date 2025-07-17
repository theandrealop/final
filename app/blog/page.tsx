import { Suspense } from "react"
import { getAllPosts } from "@/lib/graphql-api"
import { BlogPageClient } from "@/components/blog-page-client"
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

// Server Component - Solo per fetch dei dati
async function BlogPageContent() {
  try {
    console.log("🚀 BlogPageContent: Iniziando caricamento posts...")
    const { posts, hasNextPage, endCursor } = await getAllPosts(12)
    console.log("✅ BlogPageContent: Posts caricati con successo:", posts.length)

    // Passa i dati al Client Component
    return (
      <BlogPageClient 
        initialPosts={posts} 
        hasNextPage={hasNextPage} 
        endCursor={endCursor}
      />
    )
  } catch (error) {
    console.error("💥 BlogPageContent: Errore nel caricamento posts:", error)
    
    // Passa l'errore al Client Component che gestirà la UI
    return (
      <BlogPageClient 
        initialPosts={[]} 
        hasNextPage={false} 
        endCursor={null}
        error={error instanceof Error ? error.message : 'Errore sconosciuto'}
      />
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
