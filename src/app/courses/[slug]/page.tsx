"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Star, Users, Clock, Award, CheckCircle, PlayCircle, 
  BookOpen, Target, TrendingUp, Shield, ChevronDown, ChevronUp 
} from "lucide-react";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import Badge from "@/components/Badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface CourseDetail {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  price: string;
  priceAmount: number;
  rating: number;
  students: number;
  duration: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isPro: boolean;
  isFree: boolean;
  totalLessons: number;
  instructor: {
    name: string;
    avatar: string;
  };
  category: string;
}

const LEVEL_MAP: Record<string, string> = {
  BEGINNER: "Cơ bản",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (slug) {
      fetchCourseDetail();
    }
  }, [slug]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${slug}`);
      const data = await response.json();

      if (data.success) {
        setCourse(data.data);
      } else {
        toast.error("Không thể tải thông tin khóa học");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Đã có lỗi xảy ra");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đăng ký khóa học");
      router.push("/auth/login");
      return;
    }

    try {
      setEnrolling(true);
      const response = await fetch(`/api/courses/${slug}/enroll`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        if (data.data.upgradedToPro) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          // Redirect to learning page
          setTimeout(() => {
            router.push(`/learn/${slug}`);
          }, 1000);
        }
      } else {
        toast.error(data.message || "Không thể đăng ký khóa học");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error("Đã có lỗi xảy ra khi đăng ký");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const descriptionParagraphs = course.description.split('\n\n');
  const shortDescription = showFullDescription 
    ? course.description 
    : descriptionParagraphs.slice(0, 2).join('\n\n');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <PageContainer size="lg" className="py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {course.isPro && (
                  <Badge variant="featured" size="sm" className="mb-4 bg-white/20 backdrop-blur-sm">
                    ⭐ Khóa học PRO
                  </Badge>
                )}
                
                <h1 className="font-[900] text-white mb-4">
                  {course.title}
                </h1>
                
                <p className="text-lg text-white/90 mb-6">
                  {course.subtitle}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold">{course.rating}</span>
                    <span className="text-white/80">({course.students.toLocaleString()} học viên)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{course.totalLessons} bài học</span>
                  </div>
                  
                  <Badge variant="primary" size="sm" className="bg-white/20 backdrop-blur-sm">
                    {LEVEL_MAP[course.level]}
                  </Badge>
                </div>

                {/* Instructor */}
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {course.instructor.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Giảng viên</p>
                    <p className="font-semibold text-lg">{course.instructor.name}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right - Enrollment Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl p-6 sticky top-24"
              >
                {/* Preview Image */}
                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-indigo-600" />
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {course.price}
                  </p>
                  {course.isPro && (
                    <p className="text-sm text-gray-600">
                      Bao gồm nâng cấp tài khoản PRO 1 năm
                    </p>
                  )}
                </div>

                {/* Enroll Button */}
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {enrolling ? "Đang xử lý..." : course.isFree ? "Đăng ký miễn phí" : "Đăng ký ngay"}
                </button>

                {/* What's included */}
                <div className="space-y-3 text-sm text-gray-700">
                  <h3 className="font-bold text-gray-900 mb-3">Khóa học bao gồm:</h3>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{course.duration} video chất lượng cao</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{course.totalLessons} bài học chi tiết</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Truy cập trọn đời</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Chứng chỉ hoàn thành</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Hỗ trợ từ giảng viên</span>
                  </div>
                  {course.isPro && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <span className="font-semibold text-yellow-600">Tài khoản PRO 1 năm</span>
                    </div>
                  )}
                </div>

                {/* Money back guarantee */}
                {course.isPro && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>Đảm bảo hoàn tiền trong 30 ngày</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Main Content */}
      <PageContainer size="lg" className="py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="font-[900] text-gray-900 mb-6">Về khóa học này</h2>
              
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
                {shortDescription}
              </div>

              {descriptionParagraphs.length > 2 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-4 flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                >
                  <span>{showFullDescription ? "Thu gọn" : "Xem thêm"}</span>
                  {showFullDescription ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              )}
            </motion.div>

            {/* What You'll Learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="font-[900] text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-indigo-600" />
                Bạn sẽ học được gì
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Nắm vững kiến thức nền tảng",
                  "Thực hành với dự án thực tế",
                  "Áp dụng vào công việc ngay lập tức",
                  "Phát triển tư duy giải quyết vấn đề",
                  "Chuẩn bị cho phỏng vấn việc làm",
                  "Xây dựng portfolio ấn tượng",
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="font-[900] text-gray-900 mb-6">Yêu cầu</h2>
              
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{course.level === "BEGINNER" ? "Không cần kinh nghiệm trước đó" : "Có kiến thức cơ bản về lập trình"}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Máy tính kết nối internet</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>Tinh thần học hỏi và kiên trì</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Right Sidebar - Features */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6 sticky top-24"
            >
              {/* Why Choose This Course */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-indigo-600" />
                  Tại sao chọn khóa học này?
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Cập nhật liên tục</p>
                      <p className="text-small text-gray-600">Nội dung mới nhất theo xu hướng</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Cộng đồng hỗ trợ</p>
                      <p className="text-small text-gray-600">Kết nối với {course.students.toLocaleString()}+ học viên</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Chứng chỉ uy tín</p>
                      <p className="text-small text-gray-600">Tăng giá trị CV của bạn</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3">Danh mục</h3>
                <Badge variant="primary" size="sm">
                  {course.category}
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
