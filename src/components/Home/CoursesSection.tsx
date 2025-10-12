"use client";

import { ArrowRight, Star, Users, Clock, Play } from "lucide-react";
import Badge from "@/components/Badge";
import PageContainer from "@/components/PageContainer";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
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
  gradient: string;
  featured?: boolean;
  totalLessons: number;
}

const GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-yellow-500 to-orange-600",
];

const LEVEL_MAP: Record<string, "Cơ bản" | "Trung cấp" | "Nâng cao"> = {
  BEGINNER: "Cơ bản",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
};

export default function CoursesSection() {
  const [proCourses, setProCourses] = useState<Course[]>([]);
  const [freeCourses, setFreeCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      const data = await response.json();

      if (data.success) {
        const courses = data.data.courses.map((course: any, index: number) => ({
          ...course,
          gradient: GRADIENTS[index % GRADIENTS.length],
          featured: index === 0 && !course.isFree,
        }));

        const pro = courses.filter((c: Course) => c.isPro);
        const free = courses.filter((c: Course) => c.isFree);

        setProCourses(pro);
        setFreeCourses(free);
      } else {
        toast.error("Không thể tải danh sách khóa học");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Đã có lỗi xảy ra khi tải khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course: Course) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đăng ký khóa học");
      router.push("/auth/login");
      return;
    }

    try {
      setEnrollingCourse(course.id);
      const response = await fetch(`/api/courses/${course.slug}/enroll`, {
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
        }
      } else {
        toast.error(data.message || "Không thể đăng ký khóa học");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error("Đã có lỗi xảy ra khi đăng ký");
    } finally {
      setEnrollingCourse(null);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <PageContainer size="lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
          </div>
        </PageContainer>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <PageContainer size="lg">
        {proCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-[900] text-gray-900 mb-2">
                  Khóa học Pro
                  <span className="ml-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 rounded-full">
                     PRO
                  </span>
                </h2>
                <p className="text-gray-600">Khóa học JavaScript chuyên sâu cho developer</p>
              </div>
              <a href="/roadmap" className="hidden md:flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200">
                Xem lộ trình
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {proCourses.map((course, index) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <CourseCard course={course} onEnroll={() => handleEnroll(course)} isEnrolling={enrollingCourse === course.id} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {freeCourses.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-[900] text-gray-900 mb-2">Khóa học miễn phí</h2>
                <p className="text-gray-600">Học miễn phí với các khóa học chất lượng</p>
              </div>
              <a href="/roadmap" className="hidden md:flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200">
                Xem lộ trình
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {freeCourses.map((course, index) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.05 }}>
                  <CourseCard course={course} onEnroll={() => handleEnroll(course)} isEnrolling={enrollingCourse === course.id} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </PageContainer>
    </section>
  );
}

function CourseCard({ course, onEnroll, isEnrolling }: { course: Course; onEnroll: () => void; isEnrolling: boolean }) {
  const levelDisplay = LEVEL_MAP[course.level] || "Cơ bản";
  const router = useRouter();
  
  const { isAuthenticated, user } = useAuth();
  
  const handleClick = async () => {
    // Kiểm tra xem user đã đăng ký khóa học chưa
    if (isAuthenticated && course.isPro) {
      try {
        const response = await fetch(`/api/users/me/courses`, {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.success) {
          const isEnrolled = data.data.courses.some((c: any) => c.slug === course.slug);
          
          if (isEnrolled) {
            // Đã đăng ký -> Chuyển đến trang học
            router.push(`/learn/${course.slug}`);
            return;
          }
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
      }
    }
    
    // Chưa đăng ký hoặc khóa FREE -> Chuyển đến landing page hoặc enroll
    if (course.isPro) {
      router.push(`/courses/${course.slug}`);
    } else {
      onEnroll();
    }
  };
  
  return (
    <motion.div 
      whileHover={{ y: -4 }} 
      className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col hover:bg-[#f7f7f7] cursor-pointer" 
      style={{ backgroundColor: "#f7f7f7" }} 
      onClick={handleClick}
    >
      <div className={`relative h-32 bg-gradient-to-br ${course.gradient} flex items-center justify-center flex-shrink-0`}>
        <div className="text-white text-center">
          <Play className="w-8 h-8 mx-auto mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="text-xs font-semibold opacity-90">Preview</div>
        </div>
        {course.featured && (
          <div className="absolute top-3 right-3">
            <div className="w-[26px] px-[6px] py-[6px] bg-[#0000004d] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">⭐</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-3 flex-1">
          <h3 className="course-card-title font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[2.5rem] flex items-start">
            {course.title}
          </h3>
          <p className="text-small text-gray-600 line-clamp-1">{course.subtitle}</p>
        </div>
        <div className="flex items-center justify-between text-small text-gray-500 mb-3 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{course.rating}</span>
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
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            {course.isPro ? (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-indigo-600">
                  {new Intl.NumberFormat('vi-VN').format(course.priceAmount)}₫
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-base font-bold text-emerald-600">
                  {course.price}
                </span>
              </div>
            )}
          </div>
          <Badge variant={levelDisplay === "Nâng cao" ? "warning" : "success"} size="sm">
            {levelDisplay}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}