// Profile-related types for user profile pages

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  membership_type: 'FREE' | 'PRO';
  membership_expires_at: Date | null;
  learning_streak: number;
  total_study_time: number; // in minutes
  is_verified: boolean;
  created_at: Date;
  
  // Social media links
  website?: string | null;
  linkedin?: string | null;
  github?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  
  // Stats
  total_courses_enrolled: number;
  total_courses_completed: number;
  total_articles_published: number;
  total_forum_posts: number;
  followers_count: number;
  following_count: number;
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD format
  count: number; // Number of activities on this day
  level: 0 | 1 | 2 | 3 | 4; // Intensity level for color coding
}

export interface ActivityData {
  activities: ActivityDay[];
  total_count: number;
  current_streak: number;
  longest_streak: number;
}

export interface EnrolledCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  progress_percentage: number;
  enrolled_at: Date;
  is_completed: boolean;
  completed_at: Date | null;
}

export interface UserArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string | null;
  published_at: Date;
  views_count: number;
  likes_count: number;
  comments_count: number;
}

export interface ProfileTab {
  id: string;
  label: string;
  count?: number;
}
