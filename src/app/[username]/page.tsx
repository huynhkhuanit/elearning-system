"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UserProfile, ActivityData, ProfileTab } from '@/types/profile';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import ProfileStats from '@/components/ProfileStats';
import PageContainer from '@/components/PageContainer';
import AvatarWithProBadge from '@/components/AvatarWithProBadge';
import { Calendar, Award, Clock, BookOpen, FileText, Globe, Linkedin, Github, Twitter, Facebook } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('enrolled');

  const tabs: ProfileTab[] = [
    { id: 'enrolled', label: 'Khóa học đã đăng ký', count: profile?.total_courses_enrolled },
    { id: 'completed', label: 'Khóa học đã hoàn thành', count: profile?.total_courses_completed },
    { id: 'articles', label: 'Bài viết', count: profile?.total_articles_published },
    { id: 'saved', label: 'Bài viết đã lưu' },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile
        const profileRes = await fetch(`/api/users/${username}`);
        const profileData = await profileRes.json();
        
        if (!profileData.success) {
          throw new Error(profileData.message);
        }
        
        setProfile(profileData.data);

        // Fetch activities
        const activitiesRes = await fetch(`/api/users/${username}/activities`);
        const activitiesData = await activitiesRes.json();
        
        if (activitiesData.success) {
          setActivityData(activitiesData.data);
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username]);

  if (loading) {
    return (
      <PageContainer>
        <div className="max-w-7xl mx-auto py-8 px-4">
          {/* Profile Header Skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Skeleton */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-100"></div>
                </div>
              </div>

              {/* Profile Info Skeleton - Match exact spacing */}
              <div className="flex-1">
                <div className="flex items-start justify-between flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    {/* Name - h1 text-3xl with mb-1 */}
                    <div className="h-9 bg-gray-200 rounded-lg w-64 mb-1"></div>
                    {/* Username - text-lg with mb-4 */}
                    <div className="h-7 bg-gray-100 rounded-lg w-40 mb-4"></div>
                    
                    {/* Bio - 2 lines with mb-4 */}
                    <div className="space-y-2 mb-4">
                      <div className="h-5 bg-gray-100 rounded-lg w-full"></div>
                      <div className="h-5 bg-gray-100 rounded-lg w-3/4"></div>
                    </div>

                    {/* Social Links - flex gap-3 mb-4 */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="h-8 bg-gray-100 rounded-lg w-24"></div>
                      <div className="h-8 bg-gray-100 rounded-lg w-24"></div>
                      <div className="h-8 bg-gray-100 rounded-lg w-24"></div>
                    </div>

                    {/* Meta Info - flex gap-4 text-sm */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="h-5 bg-gray-100 rounded-lg w-40"></div>
                      <div className="h-5 bg-gray-100 rounded-lg w-32"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-10 w-10 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-16 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded-lg w-24"></div>
              </div>
            ))}
          </div>

          {/* Activity Heatmap Skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
              <div className="flex gap-4">
                <div className="h-5 bg-gray-100 rounded-lg w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex gap-1">
                  {Array.from({ length: 53 }).map((_, j) => (
                    <div key={j} className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 animate-pulse">
            <div className="border-b border-gray-200 p-2">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-lg w-40"></div>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-48 mx-auto"></div>
                <div className="h-4 bg-gray-100 rounded-lg w-64 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !profile) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy người dùng</h1>
            <p className="text-gray-600">{error || 'Người dùng không tồn tại hoặc đã bị xóa'}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <AvatarWithProBadge
                avatarUrl={profile.avatar_url}
                fullName={profile.full_name}
                isPro={profile.membership_type === 'PRO'}
                size="2xl"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {profile.full_name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">@{profile.username}</p>
                  
                  {profile.bio && (
                    <p className="text-gray-700 mb-4 max-w-2xl">{profile.bio}</p>
                  )}

                  {/* Social Links */}
                  {(profile.website || profile.linkedin || profile.github || profile.twitter || profile.facebook) && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                      {profile.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 rounded-lg text-sm text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {profile.twitter && (
                        <a
                          href={profile.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm text-sky-700 transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                          <span>Twitter</span>
                        </a>
                      )}
                      {profile.facebook && (
                        <a
                          href={profile.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-600 transition-colors"
                        >
                          <Facebook className="w-4 h-4" />
                          <span>Facebook</span>
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Tham gia từ {joinDate}</span>
                    </div>
                    {profile.learning_streak > 0 && (
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-orange-600">
                          🔥 {profile.learning_streak} ngày streak
                        </span>
                      </div>
                    )}
                    {profile.total_study_time > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>
                          {Math.floor(profile.total_study_time / 60)}h {profile.total_study_time % 60}m học tập
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6">
          <ProfileStats profile={profile} />
        </div>

        {/* Activity Heatmap - Always show, even if no data */}
        <div className="mb-6">
          <ActivityHeatmap
            activities={activityData?.activities || []}
            totalCount={activityData?.total_count || 0}
            currentStreak={activityData?.current_streak || 0}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex gap-1 p-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "enrolled" && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có khóa học nào</h3>
                <p className="text-gray-600">Người dùng này chưa đăng ký khóa học nào</p>
              </div>
            )}

            {activeTab === "completed" && (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa hoàn thành khóa học nào
                </h3>
                <p className="text-gray-600">Người dùng này chưa hoàn thành khóa học nào</p>
              </div>
            )}

            {activeTab === "articles" && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
                <p className="text-gray-600">Người dùng này chưa xuất bản bài viết nào</p>
              </div>
            )}

            {activeTab === "saved" && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa lưu bài viết nào</h3>
                <p className="text-gray-600">Người dùng này chưa lưu bài viết nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
