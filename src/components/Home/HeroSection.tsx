"use client";

import { ChevronLeft, ChevronRight, Star, Users, Clock, ArrowRight, BookOpen, Sparkles, PlayCircle } from "lucide-react";
import Badge from "@/components/Badge";
import PageContainer from "@/components/PageContainer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

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

// Helper function to calculate original price and discount for PRO courses
const calculatePricing = (currentPrice: number) => {
  const originalPrice = Math.round(currentPrice * 1.4);
  const roundedOriginalPrice = Math.round(originalPrice / 100000) * 100000;
  const discountPercent = Math.round(((roundedOriginalPrice - currentPrice) / roundedOriginalPrice) * 100);
  
  return {
    originalPrice: roundedOriginalPrice,
    currentPrice: currentPrice,
    discountPercent,
  };
};

export default function HeroSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);
  
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

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
          featured: index === 0,
        }));
        setCourses(fetchedCourses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course: Course) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đăng ký khóa học");
      return;
    }

    if (enrollingCourse) return;

    try {
      setEnrollingCourse(course.id);
      const response = await fetch(`/api/courses/${course.slug}/enroll`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Đăng ký khóa học thành công!");
        
        if (data.data?.upgradedToPro) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setTimeout(() => {
            router.push(`/learn/${course.slug}`);
          }, 800);
        }
      } else {
        if (data.message && data.message.includes('đã đăng ký')) {
          toast.info("Bạn đã đăng ký khóa học này. Đang chuyển hướng...");
          setTimeout(() => {
            router.push(`/learn/${course.slug}`);
          }, 800);
        } else {
          toast.error(data.message || "Không thể đăng ký khóa học");
        }
      }
    } catch (error) {
      console.error("Error during enrollment:", error);
      toast.error("Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại");
    } finally {
      setEnrollingCourse(null);
    }
  };

  const handleProCourseClick = async (course: Course) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      return;
    }

    if (enrollingCourse) return;

    try {
      setEnrollingCourse(course.id);
      const response = await fetch(`/api/courses/${course.slug}`, {
        credentials: "include",
      });
      
      const data = await response.json();

      if (data.success) {
        if (data.data.isEnrolled) {
          router.push(`/learn/${course.slug}`);
        } else {
          router.push(`/courses/${course.slug}`);
        }
      } else {
        router.push(`/courses/${course.slug}`);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
      router.push(`/courses/${course.slug}`);
    } finally {
      setEnrollingCourse(null);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (courses.length === 0) return;
    
    setDirection(newDirection);
    
    setCurrentIndex((prevIndex) => {
      const isWrapping = 
        (newDirection === 1 && prevIndex === courses.length - 1) ||
        (newDirection === -1 && prevIndex === 0);
      
      if (isWrapping) {
        setSlideKey(prev => prev + 1);
      }
      
      if (newDirection === 1) {
        return prevIndex === courses.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? courses.length - 1 : prevIndex - 1;
      }
    });
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="h-full bg-white rounded-2xl shadow-lg p-4 animate-pulse border border-gray-100">
      <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-70"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03]"></div>
      
      {/* Decorative Blobs */}
      <div className="absolute top-20 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-3xl"></div>

      <PageContainer size="lg" className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start text-left z-10"
          >
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="text-xs font-medium text-indigo-700 uppercase tracking-wide">Nền tảng học lập trình trực tuyến</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.15] mb-6 tracking-tight">
              Khởi đầu hành trình <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Công nghệ</span> của bạn
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Truy cập hơn 100+ khóa học chất lượng cao từ các chuyên gia hàng đầu. 
              Học mọi lúc, mọi nơi và xây dựng sự nghiệp vững chắc.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button 
                onClick={() => {
                  const element = document.getElementById('courses-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group relative px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>Khám phá khóa học</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => router.push('/roadmap')}
                className="px-6 py-3 bg-white border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-600 font-semibold rounded-xl transition-all hover:bg-indigo-50 flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lộ trình học</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 w-full max-w-md pt-6 border-t border-gray-100">
              <div>
                <p className="text-2xl font-bold text-gray-900">10k+</p>
                <p className="text-sm text-gray-500">Học viên</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">50+</p>
                <p className="text-sm text-gray-500">Giảng viên</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <p className="text-sm text-gray-500">Đánh giá</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Carousel */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none lg:mx-0 h-[400px] sm:h-[450px] flex items-center justify-center">
            {/* Abstract Background behind card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-[2rem] -rotate-6 scale-90 opacity-50 blur-sm"></div>
            
            <div className="relative w-full h-full z-10">
              {loading ? (
                <SkeletonCard />
              ) : courses.length === 0 ? (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-500">Chưa có khóa học nào</p>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
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
                        scale: { duration: 0.2 },
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragStart={() => setIsDragging(true)}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                          paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                          paginate(-1);
                        }
                        setTimeout(() => setIsDragging(false), 200);
                      }}
                      className="absolute w-full max-w-[380px]"
                    >
                      <CourseCard 
                        course={courses[currentIndex]} 
                        featured={courses[currentIndex].featured}
                        isDragging={isDragging}
                        onEnroll={() => handleEnroll(courses[currentIndex])}
                        onProClick={() => handleProCourseClick(courses[currentIndex])}
                        isEnrolling={enrollingCourse === courses[currentIndex].id}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-4">
                    <button
                      onClick={() => paginate(-1)}
                      className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex space-x-2">
                      {courses.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const dir = index > currentIndex ? 1 : -1;
                            setDirection(dir);
                            setCurrentIndex(index);
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex ? "w-8 bg-indigo-600" : "w-2 bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => paginate(1)}
                      className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </PageContainer>
    </section>
  );
}

function CourseCard({ 
  course, 
  featured, 
  isDragging, 
  onEnroll, 
  onProClick, 
  isEnrolling 
}: { 
  course: Course; 
  featured?: boolean; 
  isDragging?: boolean;
  onEnroll: () => void;
  onProClick: () => void;
  isEnrolling: boolean;
}) {
  const router = useRouter();
  const levelDisplay = LEVEL_MAP[course.level] || "Cơ bản";
  const [hasMoved, setHasMoved] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      return;
    }

    if (course.isFree) {
      if (isEnrolling) return;
      
      // Check enrollment for free course
      (async () => {
        try {
          const response = await fetch(`/api/courses/${course.slug}`, {
            credentials: "include",
          });
          const data = await response.json();
          
          if (data.success && data.data.isEnrolled) {
            router.push(`/learn/${course.slug}`);
          } else {
            onEnroll();
          }
        } catch (error) {
          console.error("Error checking enrollment:", error);
          toast.error("Có lỗi xảy ra. Vui lòng thử lại");
        }
      })();
    } else {
      onProClick();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartPos({ x: e.clientX, y: e.clientY });
    setHasMoved(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startPos) {
      const deltaX = Math.abs(e.clientX - startPos.x);
      const deltaY = Math.abs(e.clientY - startPos.y);
      if (deltaX > 5 || deltaY > 5) {
        setHasMoved(true);
      }
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      setHasMoved(false);
      setStartPos(null);
    }, 50);
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-2xl hover:shadow-indigo-200/50 ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${isEnrolling ? 'opacity-50' : ''}`}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ${isEnrolling ? 'opacity-50' : ''}`}>
            <Sparkles className="w-12 h-12 text-white/50" />
          </div>
        )}
        
        {/* Loading overlay when enrolling */}
        {isEnrolling && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
              <div className="text-xs font-semibold opacity-90">
                {course.isFree ? "Đang đăng ký..." : "Đang kiểm tra..."}
              </div>
            </div>
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <span className="px-2 py-1 bg-yellow-400/90 backdrop-blur-sm text-yellow-900 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Nổi bật
            </span>
          )}
          <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
            {levelDisplay}
          </span>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
            <PlayCircle className="w-6 h-6 text-indigo-600 fill-indigo-50" />
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight min-h-[3rem]">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          {course.instructor?.avatar ? (
             <img src={course.instructor.avatar} alt="" className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
              {course.instructor?.name?.[0] || "G"}
            </div>
          )}
          <span className="text-sm text-gray-600 truncate max-w-[150px]">
            {course.instructor?.name || "Giảng viên"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration || "2h 30p"}</span>
            </div>
          </div>

          <div className="text-right">
            {course.isPro ? (
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 line-through">
                  {new Intl.NumberFormat('vi-VN').format(calculatePricing(course.priceAmount).originalPrice)}₫
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {new Intl.NumberFormat('vi-VN').format(course.priceAmount)}₫
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-green-600">Miễn phí</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}