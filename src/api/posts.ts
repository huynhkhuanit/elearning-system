import type { BlogPost } from "@/types/BlogPost"

export async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`/api/blog/posts/${slug}`)
    const result = await res.json()

    if (res.ok && result.success) {
      return result.data
    }
    return null
  } catch (error) {
    console.error("Fetch post error:", error)
    return null
  }
}
