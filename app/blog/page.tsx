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
    const { posts, hasNextPage, endCursor } = await getAllPosts(12)

    return (
      <div className="min-h-screen bg-cream">
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
    console.error("Error loading blog posts:", error)
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold mb-4 text-dark-green">Blog non disponibile</h1>
            <p className="text-gray-600">Il blog non è al momento disponibile. Riprova più tardi.</p>
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
}
