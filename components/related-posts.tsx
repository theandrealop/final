import Link from "next/link"
import type { BlogPost } from "@/lib/graphql-api"
import { Card, CardContent } from "@/components/ui/card"

interface RelatedPostsProps {
  posts: BlogPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-dark-green">Articoli correlati</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/blog/${post.slug}`}>
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featuredImage.node.sourceUrl || "/placeholder.svg"}
                    alt={post.featuredImage.node.altText || post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">{post.title}</h3>
                <div
                  className="text-sm text-muted-foreground mb-3 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author.node.name}</span>
                  <span>{formatDate(post.date)}</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}
