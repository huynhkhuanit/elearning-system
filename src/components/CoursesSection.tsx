"use client";

import { Star, Users, Clock, ArrowRight, Play } from "lucide-react";
import Badge from "@/components/Badge";
import { motion } from "framer-motion";

interface Course {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  rating: number;
  students: number;
  duration: string;
  level: "Cơ bản" | "Nâng cao";
  isPro: boolean;
  gradient: string;
  featured?: boolean;
}

// Dữ liệu khóa học Pro (chỉ JavaScript)
const proCourses: Course[] = [
  {
    id: 1,
    title: "JavaScript Pro",
    subtitle: "Cho người mới bắt đầu",
    price: "1.399.000đ",
    rating: 4.8,
    students: 590,
    duration: "116h50p",
    level: "Cơ bản",
    isPro: true,
    gradient: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "Ngôn ngữ Sass",
    subtitle: "Cho Frontend Developer",
    price: "299.000đ",
    rating: 4.8,
    students: 27,
    duration: "6h51p",
    level: "Cơ bản",
    isPro: true,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: 3,
    title: "HTML CSS Pro",
    subtitle: "Cho người mới bắt đầu",
    price: "1.299.000đ",
    rating: 4.8,
    students: 590,
    duration: "116h50p",
    level: "Cơ bản",
    isPro: true,
    gradient: "from-blue-600 to-indigo-600",
  },
];

// Dữ liệu khóa học miễn phí
const freeCourses: Course[] = [
  {
    id: 4,
    title: "Kiến Thức Nền Tảng",
    subtitle: "Kiến thức nhập môn IT",
    price: "Miễn phí",
    rating: 4.8,
    students: 13619,
    duration: "3h12p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 5,
    title: "Lập trình C++ cơ bản nâng cao",
    subtitle: "Miễn phí",
    price: "Miễn phí",
    rating: 4.8,
    students: 37079,
    duration: "10h18p",
    level: "Nâng cao",
    isPro: false,
    gradient: "from-teal-500 to-green-500",
  },
  {
    id: 6,
    title: "HTML CSS từ Zero đến Hero",
    subtitle: "Miễn phí",
    price: "Miễn phí",
    rating: 4.8,
    students: 214903,
    duration: "29h5p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 7,
    title: "Responsive Với Grid System",
    subtitle: "Miễn phí",
    price: "Miễn phí",
    rating: 4.8,
    students: 47399,
    duration: "6h51p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    id: 8,
    title: "Lập trình JavaScript Cơ Bản",
    subtitle: "Miễn phí",
    price: "Miễn phí",
    rating: 4.8,
    students: 151322,
    duration: "24h15p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: 9,
    title: "Lập trình JavaScript Nâng Cao",
    subtitle: "Miễn phí",
    price: "Miễn phí",
    rating: 4.8,
    students: 41586,
    duration: "8h41p",
    level: "Nâng cao",
    isPro: false,
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 10,
    title: "Làm việc với Terminal & Ubuntu",
    subtitle: "Windows Terminal",
    price: "Miễn phí",
    rating: 4.8,
    students: 21266,
    duration: "4h5p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-red-500 to-pink-500",
  },
  {
    id: 11,
    title: "Xây Dựng Website Với ReactJS",
    subtitle: "Learn once, write anywhere",
    price: "Miễn phí",
    rating: 4.8,
    students: 73353,
    duration: "27h32p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: 12,
    title: "Node & ExpressJS",
    subtitle: "Miễn phí",
    price: "Miễn phí",
    rating: 4.8,
    students: 45418,
    duration: "12h8p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-green-500 to-teal-500",
  },
  {
    id: 13,
    title: "App Đừng Chạm Tay Lên Mặt",
    subtitle: "Miễn phí",
    price: "Miễn phí",
    rating: 4.8,
    students: 11156,
    duration: "1h34p",
    level: "Cơ bản",
    isPro: false,
    gradient: "from-indigo-500 to-purple-500",
  },
];

export default function CoursesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Pro Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Khóa học Pro
                <Badge variant="primary" size="md" className="ml-3">
                  Mới
                </Badge>
              </h2>
              <p className="text-gray-600">Các khóa học chuyên sâu cho developer</p>
            </div>
            <a
              href="/courses"
              className="hidden md:flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
            >
              Xem lộ trình
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CourseCard course={course} />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Khóa học miễn phí</h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {freeCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
    >
      {/* Thumbnail */}
      <div className={`relative h-32 bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
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
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {course.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-1">{course.subtitle}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`font-bold text-sm ${course.isPro ? 'text-primary' : 'text-green-600'}`}>
              {course.price}
            </span>
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
