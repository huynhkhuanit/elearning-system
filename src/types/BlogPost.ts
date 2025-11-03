export interface Author {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface BlogPost {
  id: number
  user_id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string | null
  status: string
  view_count: number
  like_count: number
  comment_count: number
  bookmark_count: number
  published_at: string
  created_at: string
  updated_at: string
  categories: Category[]
  tags: Tag[]
  author: Author
}
