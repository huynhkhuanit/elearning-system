"use client";

import { Star, Users, Clock, ArrowRight, Play, Calendar, BookOpen, Award, Video, Code, HeadphonesIcon, Trophy, Smartphone } from "lucide-react";
import Badge from "@/components/Badge";
import Modal, { ModalButton } from "@/components/Modal";
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
              href="/roadmap"
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
              href="/roadmap"
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

// Coming Soon Modal - Simple and clean
function ComingSoonModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleNotifyClick = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ thông báo khi khóa học sẵn sàng.');
    onClose();
  };

  const headerIcon = (
    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
      <BookOpen className="w-6 h-6 text-white" />
    </div>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Coming Soon"
      size="md"
      headerIcon={headerIcon}
    >
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Khóa học này đang trong quá trình phát triển và sẽ sớm ra mắt.
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 text-left">Tính năng sắp có:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-gray-700 leading-tight">Video lectures 4K</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700 leading-tight">Bài tập interactive</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HeadphonesIcon className="w-4 h-4 text-pink-600" />
                </div>
                <span className="text-gray-700 leading-tight">Hỗ trợ 24/7</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-gray-700 leading-tight">Cộng đồng học tập</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700 leading-tight">Certificate</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-4 h-4 text-pink-600" />
                </div>
                <span className="text-gray-700 leading-tight">Mobile app</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <ModalButton
              onClick={onClose}
              variant="secondary"
              size="md"
              className="flex-1"
              disabled={isLoading}
            >
              Để sau
            </ModalButton>
            <ModalButton
              onClick={handleNotifyClick}
              variant="primary"
              size="md"
              className="flex-1"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng ký nhận thông báo'}
            </ModalButton>
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
      className={`group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col hover:bg-[#f7f7f7] ${
        course.isComingSoon ? 'cursor-pointer opacity-90' : 'cursor-pointer'
      }`}
      style={{ backgroundColor: '#f7f7f7' }}
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
            <div className="w-[26px] px-[6px] py-[6px] bg-[#0000004d] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⭐</span>
            </div>
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