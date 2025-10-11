"use client";

import { ChevronLeft, ChevronRight, Star, Award, Users, Clock, ArrowRight } from "lucide-react";
import Badge from "@/components/Badge";
import PageContainer from "@/components/PageContainer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  price: string;
  originalPrice?: string;
  image: string;
  featured?: boolean;
}

const courses: Course[] = [
  {
    id: 1,
    title: "C++ Programming Mastery",
    instructor: "Đội ngũ DHV LearnX",
    rating: 4.9,
    students: 18200,
    duration: "28h 45m",
    level: "Trung cấp",
    price: "Miễn phí",
    image: "/api/placeholder/400/250",
    featured: true,
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    instructor: "Đội ngũ DHV LearnX",
    rating: 4.8,
    students: 15640,
    duration: "35h 20m",
    level: "Nâng cao",
    price: "Miễn phí",
    image: "/api/placeholder/400/250",
  },
  {
    id: 3,
    title: "HTML & CSS Fundamentals",
    instructor: "Đội ngũ DHV LearnX",
    rating: 4.7,
    students: 22350,
    duration: "16h 30m",
    level: "Cơ bản",
    price: "Miễn phí",
    image: "/api/placeholder/400/250",
    featured: true,
  },
  {
    id: 4,
    title: "Advanced JavaScript Programming",
    instructor: "Đội ngũ DHV LearnX",
    rating: 4.6,
    students: 12890,
    duration: "22h 15m",
    level: "Trung cấp",
    price: "899.000đ",
    originalPrice: "1.299.000đ",
    image: "/api/placeholder/400/250",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === courses.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? courses.length - 1 : prevIndex - 1;
      }
    });
  };

  return (
    <section className="relative w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 sm:py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <PageContainer size="lg" className="relative py-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="font-bold text-foreground mb-3 sm:mb-4 px-4">
            Khám phá <span className="bg-gradient-to-r font-[900] from-indigo-600 to-purple-600 bg-clip-text text-transparent">khóa học</span> hàng đầu
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Nâng cao kỹ năng lập trình với lộ trình học tập bài bản từ cơ bản đến chuyên sâu
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative w-full px-4 sm:px-0">
          <div className="overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl bg-card">
            <div className="relative h-[220px] sm:h-[250px] md:h-[270px]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="absolute inset-0"
                >
                  <CourseCard course={courses[currentIndex]} featured={courses[currentIndex].featured} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows - positioned outside carousel */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 sm:left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-card/90 hover:bg-card shadow-lg rounded-full flex items-center justify-center text-foreground hover:text-indigo-600 transition-all duration-200 z-20"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-0 sm:right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-card/90 hover:bg-card shadow-lg rounded-full flex items-center justify-center text-foreground hover:text-indigo-600 transition-all duration-200 z-20"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-4 sm:mt-5 md:mt-6">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 sm:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-indigo-600 w-6 sm:w-8"
                  : "bg-gray-300 hover:bg-gray-400 w-2 sm:w-3"
              }`}
            />
          ))}
        </div>

      </PageContainer>
    </section>
  );
}

function CourseCard({ course, featured }: { course: Course; featured?: boolean }) {
  return (
    <div className="h-full bg-gradient-to-br from-white to-gray-50 flex flex-col sm:flex-row">
      {/* Content Section */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between">
        <div>
          {featured && (
            <Badge variant="featured" size="sm" className="mb-2">
              ⭐ Nổi bật
            </Badge>
          )}

          <h3 className="course-card-title font-bold text-foreground mb-2 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-muted-foreground mb-2 sm:mb-3 text-sm">
            GV: <span className="font-semibold text-indigo-600">{course.instructor}</span>
          </p>

          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-foreground text-sm sm:text-base">{course.rating}</span>
            </div>
            <Badge variant="primary" size="sm">
              {course.level}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-base sm:text-lg md:text-xl font-bold text-foreground">{course.price}</div>
            {course.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">{course.originalPrice}</div>
            )}
          </div>
          <button className="relative inline-block text-white font-semibold rounded-lg p-[2px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200">
            <span className="block px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-transparent text-sm">
                Đăng ký
            </span>
        </button>

        </div>
      </div>

      {/* Image Section */}
      <div className="w-full h-24 sm:w-32 sm:h-auto md:w-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-3">
        <div className="w-full h-full sm:h-20 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-lg flex items-center justify-center text-indigo-600">
          <div className="text-center">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
            <div className="text-xs font-semibold">Preview</div>
          </div>
        </div>
      </div>
    </div>
  );
}