\`\`\`tsx
// components/blog-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface BlogCardProps {
  post: {
    slug: string
    title: string
    description: string
    date: string
    author: {
      node: {
        name: string
      }
    }
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return format(date, "MMMM dd, yyyy")
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(post.date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>{post.author.node.name}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
\`\`\`

\`\`\`tsx
// components/blog-post-content.tsx
interface BlogPostContentProps {
  content: string
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  return <div className="blog-content" dangerouslySetInnerHTML={{ __html: content }} />
}
\`\`\`

\`\`\`tsx
// components/related-posts.tsx
import { BlogCard } from "@/components/blog-card"

interface RelatedPostsProps {
  posts: {
    nodes: {
      slug: string
      title: string
      description: string
      date: string
      author: {
        node: {
          name: string
        }
      }
    }[]
  }
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.nodes.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
\`\`\`
