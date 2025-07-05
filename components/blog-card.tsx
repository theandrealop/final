import Link from "next/link"
import type { BlogPost } from "@/lib/graphql-api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.nodes.slice(0, 2).map((category) => (
              <Badge key={category.slug} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-primary transition-colors">{post.title}</h3>

          <div className="text-muted-foreground mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt }} />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{post.author.node.name}</span>
            <span>{formatDate(post.date)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
