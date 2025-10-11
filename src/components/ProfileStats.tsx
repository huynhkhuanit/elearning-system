"use client";

import { UserProfile } from '@/types/profile';
import { BookOpen, Award, FileText, MessageCircle, Users, UserPlus } from 'lucide-react';

interface ProfileStatsProps {
  profile: UserProfile;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  const stats = [
    {
      icon: Users,
      label: 'Người theo dõi',
      value: profile.followers_count,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: UserPlus,
      label: 'Đang theo dõi',
      value: profile.following_count,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: BookOpen,
      label: 'Khóa học đã đăng ký',
      value: profile.total_courses_enrolled,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Award,
      label: 'Khóa học đã hoàn thành',
      value: profile.total_courses_completed,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: FileText,
      label: 'Bài viết',
      value: profile.total_articles_published,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      icon: MessageCircle,
      label: 'Bài đăng diễn đàn',
      value: profile.total_forum_posts,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
