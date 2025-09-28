"use client";

import { Star, Users, Clock, ArrowRight, Play, Calendar, BookOpen, Award } from "lucide-react";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Course {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  rating: number;
  students: number;
  duration: string;
  level: "Cơ bản" | "Nâng cao";
  isPro: boolean;
  gradient: string;
  featured?: boolean;
  isComingSoon?: boolean;
}

// Dữ liệu khóa học Pro (chỉ JavaScript nâng cao)
const proCourses: Course[] = [
  {
    id: 1,
    title: "Lập trình JavaScript Nâng Cao",
    subtitle: "JavaScript Advanced Programming",
    price: "1.399.000đ",
    originalPrice: "1.799.000đ",
    rating: 4.9,
    students: 1250,
    duration: "45h30p",
    level: "Nâng cao",
    isPro: true,
    gradient: "from-indigo-500 to-purple-600",
    featured: true,
  },
];

// Dữ liệu khóa học miễn phí
const freeCourses: Course[] = [
  {
    id: 2,
    title: "Lập trình C++ Cơ Bản Đến Nâng Cao",
    subtitle: "C++ Programming Fundamentals to Advanced",
    price: "Miễn phí",
    rating: 4.8,
    students: 25890,
    duration: "32h45p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-emerald-500 to-teal-600",
    isComingSoon: true,
  },
  {
    id: 3,
    title: "HTML CSS Cơ Bản Đến Nâng Cao",
    subtitle: "HTML CSS Complete Course",
    price: "Miễn phí",
    rating: 4.9,
    students: 45230,
    duration: "28h20p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-blue-500 to-indigo-600",
    isComingSoon: true,
  },
  {
    id: 4,
    title: "Cấu Trúc Dữ Liệu Và Giải Thuật",
    subtitle: "Data Structures and Algorithms",
    price: "Miễn phí",
    rating: 4.7,
    students: 18950,
    duration: "35h15p",
    level: "Nâng cao",
    isPro: false,
    gradient: "from-purple-500 to-pink-600",
    isComingSoon: true,
  },
  {
    id: 5,
    title: "Lập trình JavaScript Cơ Bản",
    subtitle: "JavaScript Fundamentals",
    price: "Miễn phí",
    rating: 4.8,
    students: 32180,
    duration: "18h30p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-yellow-500 to-orange-600",
    isComingSoon: true,
  },
];

export default function CoursesSection() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence>
          {showComingSoon && (
            <ComingSoonModal onClose={() => setShowComingSoon(false)} />
          )}
        </AnimatePresence>
        {/* Pro Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-[900] text-gray-900 mb-2">
                Khóa học Pro
                <Badge variant="primary" size="md" className="ml-3">
                  Nâng cao
                </Badge>
              </h2>
              <p className="text-gray-600">Khóa học JavaScript chuyên sâu cho developer</p>
            </div>
            <a
              href="/courses"
              className="hidden md:flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
            >
              Xem lộ trình
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {proCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CourseCard course={course} onComingSoon={() => setShowComingSoon(true)} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Free Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-[900] text-gray-900 mb-2">Khóa học miễn phí</h2>
              <p className="text-gray-600">Học miễn phí với các khóa học chất lượng</p>
            </div>
            <a
              href="/courses"
              className="hidden md:flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
            >
              Xem lộ trình
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {freeCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <CourseCard course={course} onComingSoon={() => setShowComingSoon(true)} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Coming Soon Modal using the new Modal component with enhanced features
function ComingSoonModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleNotifyClick = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Show success message or redirect
    alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ thông báo khi khóa học sẵn sàng.');
    onClose();
  };

  const headerIcon = (
    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
      <BookOpen className="w-6 h-6 text-white" />
    </div>
  );

  const footer = (
    <div className="flex space-x-3">
      <button
        onClick={onClose}
        disabled={isLoading}
        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg font-medium transition-all duration-200"
      >
        Để sau
      </button>
      <button
        onClick={handleNotifyClick}
        disabled={isLoading}
        className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
      >
        {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        <span>{isLoading ? 'Đang xử lý...' : 'Đăng ký nhận thông báo'}</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Coming Soon"
      subtitle="Khóa học đang được phát triển"
      variant="info"
      animation="bounce"
      size="md"
      headerIcon={headerIcon}
      footer={footer}
      loading={isLoading}
      backdropClassName="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"
      className="border-2 border-indigo-200/50"
    >
      <div className="space-y-6">
        {/* Status indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900 text-sm">Đang phát triển</div>
              <div className="text-xs text-blue-700">Dự kiến Q1 2025</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Award className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900 text-sm">Nội dung chất lượng</div>
              <div className="text-xs text-green-700">Được giảng viên hàng đầu tạo</div>
            </div>
          </div>
        </div>

        {/* Features preview */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-indigo-200/50">
          <h4 className="font-bold text-gray-900 mb-4 text-center">🎯 Tính năng sắp có:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-gray-700">Video lectures 4K</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Bài tập interactive</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-gray-700">Hỗ trợ 24/7</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-gray-700">Cộng đồng học tập</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Certificate</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-gray-700">Mobile app</span>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tiến độ phát triển</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Early access note */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-xs font-bold">!</span>
            </div>
            <div>
              <h5 className="font-semibold text-amber-900 mb-1">Early Access</h5>
              <p className="text-sm text-amber-800">
                Đăng ký ngay để nhận early access và ưu đãi đặc biệt khi khóa học ra mắt!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function CourseCard({ course, onComingSoon }: { course: Course; onComingSoon?: () => void }) {
  const handleClick = () => {
    if (course.isComingSoon && onComingSoon) {
      onComingSoon();
    }
    // For actual courses, navigation logic would go here
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col ${
        course.isComingSoon ? 'cursor-pointer opacity-90' : 'cursor-pointer'
      }`}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className={`relative h-32 bg-gradient-to-br ${course.gradient} flex items-center justify-center flex-shrink-0`}>
        <div className="text-white text-center">
          <Play className="w-8 h-8 mx-auto mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="text-xs font-semibold opacity-90">Preview</div>
        </div>
        {course.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="featured" size="sm">
              ⭐
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-3 flex-1">
          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[2.5rem] flex items-start">
            {course.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-1">{course.subtitle}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{course.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{course.students.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Price and Level */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col">
              <span className={`font-[600] text-sm ${course.isPro ? 'text-primary' : 'text-green-600'}`}>
                {course.price}
              </span>
              {course.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {course.originalPrice}
                </span>
              )}
            </div>
            {course.isPro && (
              <Badge variant="primary" size="sm">
                Pro
              </Badge>
            )}
          </div>
          <Badge variant={course.level === 'Nâng cao' ? 'warning' : 'success'} size="sm">
            {course.level}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
