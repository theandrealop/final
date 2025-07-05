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
      // For now, just disable load more since we're having API issues
      setHasNextPage(false)
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
