"use client"

import { useState } from "react"
import type { BlogPost } from "@/lib/graphql-api"
import { BlogCard } from "./blog-card"
import { Button } from "@/components/ui/button"
import { fetchGraphQLWithRetry } from "@/lib/fetch-with-retry"

interface BlogListProps {
  initialPosts: BlogPost[]
  hasNextPage: boolean
  endCursor: string | null
}

export function BlogList({
  initialPosts,
  hasNextPage: initialHasNextPage,
  endCursor: initialEndCursor,
}: BlogListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [endCursor, setEndCursor] = useState(initialEndCursor)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (!hasNextPage || loading) return

    setLoading(true)
    try {
      console.log("🚀 BlogList: Caricando più posts con retry logic...")
      
      // Client-side GraphQL fetch con retry logic
      const WORDPRESS_API_URL = "https://pff-815f04.ingress-florina.ewp.live/graphql"
      
      const query = `
        query GetAllPosts($first: Int!, $after: String) {
          posts(first: $first, after: $after, where: { status: PUBLISH }) {
            nodes {
              id
              title
              slug
              excerpt
              date
              author { node { name } }
              categories { nodes { name slug } }
              featuredImage { node { sourceUrl altText } }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `

      // Usa il nuovo sistema di retry
      const data = await fetchGraphQLWithRetry(
        WORDPRESS_API_URL,
        query,
        { first: 12, after: endCursor },
        {
          maxRetries: 3, // Meno retry per load more
          baseDelay: 1000,
          maxDelay: 10000
        }
      )
      
      if (!data?.posts?.nodes) {
        console.warn("⚠️ BlogList: Nessun dato ricevuto per load more")
        return
      }
      
      // Sort new posts by date (most recent first)
      const newPosts = data.posts.nodes.sort((a: BlogPost, b: BlogPost) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      
      console.log(`✅ BlogList: Caricati ${newPosts.length} nuovi posts`)
      
      setPosts((prevPosts: BlogPost[]) => {
        const combined = [...prevPosts, ...newPosts]
        // Re-sort the entire array to maintain order
        return combined.sort((a: BlogPost, b: BlogPost) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      })
      setHasNextPage(data.posts.pageInfo?.hasNextPage || false)
      setEndCursor(data.posts.pageInfo?.endCursor || null)
    } catch (error) {
      console.error("💥 BlogList: Errore caricamento più posts:", error)
      
      // Gestione errori specifici per l'utente
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          console.log("🚫 Rate limiting rilevato, disabilito temporaneamente il load more")
          // Potresti disabilitare temporaneamente il pulsante qui
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center">
          <Button onClick={loadMore} disabled={loading} variant="outline" size="lg">
            {loading ? "Caricamento..." : "Carica altri articoli"}
          </Button>
        </div>
      )}
    </div>
  )
}
