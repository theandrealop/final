"use client"

import { useState } from "react"
import type { BlogPost } from "@/lib/graphql-api"
import { BlogCard } from "./blog-card"
import { Button } from "@/components/ui/button"

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
      // Client-side GraphQL fetch without Next.js specific options
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

      const response = await fetch(WORDPRESS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { first: 12, after: endCursor }
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      
      if (json.errors) {
        throw new Error("GraphQL query failed: " + JSON.stringify(json.errors))
      }

      const data = json.data
      
      // Sort new posts by date (most recent first)
      const newPosts = (data.posts.nodes || []).sort((a: BlogPost, b: BlogPost) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      
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
      console.error("Error loading more posts:", error)
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
