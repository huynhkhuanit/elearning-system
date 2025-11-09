"use client";

import { ChevronLeft, ChevronRight, Star, Users, Clock } from "lucide-react";
import Badge from "@/components/Badge";
import PageContainer from "@/components/PageContainer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  price: string;
  priceAmount: number;
  rating: number;
  students: number;
  duration: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isPro: boolean;
  isFree: boolean;
  thumbnailUrl?: string | null;
  instructor?: {
    name?: string;
    username?: string;
    avatar?: string | null;
  };
  featured?: boolean;
}

const LEVEL_MAP: Record<string, "Cơ bản" | "Trung cấp" | "Nâng cao"> = {
  BEGINNER: "Cơ bản",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
};

export default function HeroSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [slideKey, setSlideKey] = useState(0); // Unique key for each slide to ensure proper animation
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses?limit=5");
      const data = await response.json();

      if (data.success) {
        const fetchedCourses = data.data.courses.map((course: any, index: number) => ({
          ...course,
          featured: index === 0, // First course is featured
        }));
        setCourses(fetchedCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

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
    if (courses.length === 0) return;
    
    // Always keep direction consistent: 
    // direction = 1 (right/next) -> slide from right to left
    // direction = -1 (left/prev) -> slide from left to right
    setDirection(newDirection);
    
    setCurrentIndex((prevIndex) => {
      const isWrapping = 
        (newDirection === 1 && prevIndex === courses.length - 1) ||
        (newDirection === -1 && prevIndex === 0);
      
      // Update slideKey when wrapping to ensure AnimatePresence recognizes the transition
      // This ensures each wrap-around gets a unique key combination
      if (isWrapping) {
        setSlideKey(prev => prev + 1);
      }
      
      if (newDirection === 1) {
        // Moving forward (right) - slide from right to left
        return prevIndex === courses.length - 1 ? 0 : prevIndex + 1;
      } else {
        // Moving backward (left) - slide from left to right
        return prevIndex === 0 ? courses.length - 1 : prevIndex - 1;
      }
    });
  };

  if (loading) {
    return (
      <section className="relative w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 sm:py-12 md:py-16 overflow-hidden">
        <PageContainer size="lg" className="relative py-0">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
          </div>
        </PageContainer>
      </section>
    );
  }

  if (courses.length === 0) {
    return null;
  }

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
          <h1 className="font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Khám phá <span className="bg-gradient-to-r font-[900] from-indigo-600 to-purple-600 bg-clip-text text-transparent">khóa học</span> hàng đầu
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Nâng cao kỹ năng lập trình với lộ trình học tập bài bản từ cơ bản đến chuyên sâu
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative w-full px-4 sm:px-0">
          <div className="overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl bg-white">
            <div className="relative h-[220px] sm:h-[250px] md:h-[270px]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={`${currentIndex}-${slideKey}`}
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
                  onDragStart={() => {
                    setIsDragging(true);
                  }}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                    // Reset dragging state after a delay to prevent accidental clicks
                    setTimeout(() => {
                      setIsDragging(false);
                    }, 200);
                  }}
                  onDrag={(e, info) => {
                    // Keep dragging state true while dragging
                    if (!isDragging) {
                      setIsDragging(true);
                    }
                  }}
                  className="absolute inset-0"
                >
                  <CourseCard 
                    course={courses[currentIndex]} 
                    featured={courses[currentIndex].featured}
                    isDragging={isDragging}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows - positioned outside carousel */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 sm:left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-indigo-600 transition-all duration-200 z-20"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-0 sm:right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-indigo-600 transition-all duration-200 z-20"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-4 sm:mt-5 md:mt-6">
          {courses.map((course, index) => {
            const handleDotClick = () => {
              if (index === currentIndex) return;
              
              // Consistent direction: right (next) = 1, left (prev) = -1
              const direction = index > currentIndex ? 1 : -1;
              setDirection(direction);
              setCurrentIndex(index);
            };
            
            return (
              <button
                key={course.id}
                onClick={handleDotClick}
                className={`h-2 sm:h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-indigo-600 w-6 sm:w-8"
                    : "bg-gray-300 hover:bg-gray-400 w-2 sm:w-3"
                }`}
              />
            );
          })}
        </div>

      </PageContainer>
    </section>
  );
}

function CourseCard({ course, featured, isDragging }: { course: Course; featured?: boolean; isDragging?: boolean }) {
  const router = useRouter();
  const levelDisplay = LEVEL_MAP[course.level] || "Cơ bản";
  const [hasMoved, setHasMoved] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation if user was dragging or moved mouse significantly
    if (isDragging || hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    router.push(`/courses/${course.slug}`);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartPos({ x: e.clientX, y: e.clientY });
    setHasMoved(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startPos) {
      const deltaX = Math.abs(e.clientX - startPos.x);
      const deltaY = Math.abs(e.clientY - startPos.y);
      // If mouse moved more than 5px, consider it a drag
      if (deltaX > 5 || deltaY > 5) {
        setHasMoved(true);
      }
    }
  };

  const handleMouseUp = () => {
    // Reset after a short delay to allow click to process
    setTimeout(() => {
      setHasMoved(false);
      setStartPos(null);
    }, 50);
  };

  return (
    <div 
      className={`h-full bg-gradient-to-br from-white to-gray-50 flex flex-col sm:flex-row ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Content Section */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between">
        <div>
          {featured && (
            <Badge variant="featured" size="sm" className="mb-2">
              ⭐ Nổi bật
            </Badge>
          )}

          <h3 className="course-card-title font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-gray-600 mb-2 sm:mb-3 text-sm line-clamp-1">
            {course.subtitle}
          </p>

          {course.instructor?.name && (
            <p className="text-gray-600 mb-2 sm:mb-3 text-sm">
              GV: <span className="font-semibold text-indigo-600">{course.instructor.name}</span>
            </p>
          )}

          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{course.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{course.students.toLocaleString()}</span>
            </div>
            <Badge variant={levelDisplay === "Nâng cao" ? "warning" : levelDisplay === "Trung cấp" ? "primary" : "success"} size="sm">
              {levelDisplay}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{course.price}</div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="relative inline-block text-white font-semibold rounded-lg p-[2px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
          >
            <span className="block px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-transparent text-sm">
              {course.isFree ? "Học ngay" : "Xem chi tiết"}
            </span>
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full h-24 sm:w-32 sm:h-auto md:w-40 relative overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.className = "w-full h-24 sm:w-32 sm:h-auto md:w-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center";
                parent.innerHTML = '<div class="text-center text-indigo-600"><div class="text-xs font-semibold">Course</div></div>';
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <div className="text-center text-indigo-600">
              <div className="text-xs font-semibold">Course</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}