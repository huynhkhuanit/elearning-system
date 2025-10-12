"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Star, Users, Clock, Award, CheckCircle, PlayCircle, 
  BookOpen, Target, TrendingUp, Shield, ChevronDown, ChevronUp, Quote, Zap,
  Code2, Layers, Database, Layout, Package, Settings, Terminal, GitBranch
} from "lucide-react";
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
  category: {
    id: string;
    name: string;
    slug: string;
  };
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
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
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

  const faqData = [
    {
      question: "Khóa học này có phù hợp với người hoàn toàn mới?",
      answer: "Khóa học này hoàn toàn phù hợp với người mới, chưa có nền tảng vì được thiết kế bài bản, chú trọng đi từ căn bản nhất tới nâng cao. Luôn hướng tới mục tiêu cung cấp nguồn kiến thức và hướng dẫn chi tiết nhất có thể."
    },
    {
      question: "Tôi có thể xem video bao nhiêu lần?",
      answer: "Với những video đã học qua, bạn có thể thỏa thích xem lại bất cứ video nào mà bạn muốn, không giới hạn số lần xem video. Chúng tôi khuyến khích bạn xem càng nhiều càng tốt để có thể nắm vững kiến thức hơn."
    },
    {
      question: "Tôi có thể ứng dụng được ngay sau khi học không?",
      answer: "Chắc chắn rồi! Chúng tôi luôn hướng tới các bạn học đi đôi với hành. Vì thế, sau mỗi bài học video hoặc văn bản, bạn sẽ được làm rất nhiều bài tập để cô đọng lại kiến thức, nắm vững cú pháp."
    },
    {
      question: "Tôi có được hỗ trợ trong quá trình học không?",
      answer: "Tất nhiên rồi! Tại mỗi bài học, bạn luôn có thể đặt câu hỏi, trao đổi và tương tác với các bạn cùng học. Ngoài ra, chuyên viên hỗ trợ sẽ luôn tận tình hướng dẫn nếu bạn gặp khó khăn."
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Simple & Clean như F8 */}
      <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 border-b border-gray-200">
        <PageContainer size="lg" className="py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Pro Badge */}
            {course.isPro && (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-5 py-2 rounded-full text-sm font-bold mb-6 shadow-md">
                <span>⭐</span>
                <span>KHÓA HỌC PRO</span>
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              {course.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              {course.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {enrolling ? "Đang xử lý..." : course.isFree ? "HỌC THỬ MIỄN PHÍ" : "MUA NGAY"}
              </button>
              
              {!course.isFree && (
                <div className="text-center sm:text-left">
                  <p className="text-3xl font-black text-orange-600">
                    {new Intl.NumberFormat('vi-VN').format(course.priceAmount)}₫
                  </p>
                  <p className="text-sm text-gray-600">Mua một lần, học mãi mãi</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-700">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="font-bold">{course.rating}</span>
                <span className="text-gray-600">({course.students.toLocaleString()} đánh giá)</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">{course.students.toLocaleString()} học viên</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">{course.duration}</span>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>


      {/* Khoá học này dành cho ai? - F8 Style */}
      <PageContainer size="lg" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            Khoá học này dành cho ai?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-400 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-3xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Sinh Viên IT</h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Bạn muốn học các kiến thức thực tế ở trường không dạy? Bạn muốn có kiến thức vững chắc để đi thực tập tại doanh nghiệp?
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-400 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-3xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Người Trái Ngành</h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Bạn là người mới bắt đầu và đang tìm hiểu về nghề lập trình? Bạn đang chưa biết bắt đầu từ đâu và cần một lộ trình bài bản?
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-400 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-3xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Người Đã Đi Làm</h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Bạn muốn nâng cao tay nghề? Bạn đang làm Backend muốn chuyển sang Frontend hoặc trở thành Fullstack Developer?
            </p>
          </div>
        </div>
      </PageContainer>

      {/* Bạn sẽ học được những gì? - F8 Style Grid */}
      <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-16">
        <PageContainer size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Bạn sẽ học được những gì?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Nắm vững kiến thức nền tảng từ cơ bản đến nâng cao",
              "Thực hành với 10+ dự án thực tế có thể áp dụng ngay",
              "Áp dụng vào công việc và tăng thu nhập ngay lập tức",
              "Phát triển tư duy lập trình và giải quyết vấn đề",
              "Chuẩn bị đầy đủ cho phỏng vấn việc làm cao cấp",
              "Xây dựng portfolio chuyên nghiệp và ấn tượng",
              "Networking với cộng đồng developer chất lượng cao",
              "Được mentor trực tiếp từ giảng viên giàu kinh nghiệm",
              "Hiểu rõ best practices và coding standards",
              "Làm chủ các công cụ và thư viện phổ biến",
              "Tối ưu hiệu suất và bảo mật cho ứng dụng",
              "Deploy và quản lý ứng dụng trên production",
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all">
                <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Bạn sẽ làm được những gì? */}
      <PageContainer size="lg" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            Bạn sẽ làm được những gì?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Khóa học hướng dẫn bạn thực hành nhiều dự án thực tế. Từ đó, bạn có thể tự làm hầu hết mọi ứng dụng mà bạn thấy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { number: 1, title: "Website Thương mại điện tử", desc: "Xây dựng trang web bán hàng với giỏ hàng, thanh toán" },
            { number: 2, title: "Ứng dụng Quản lý", desc: "Dashboard admin với CRUD operations đầy đủ" },
            { number: 3, title: "Landing Page Marketing", desc: "Trang giới thiệu sản phẩm chuyển đổi cao" },
            { number: 4, title: "Blog/Portfolio cá nhân", desc: "Trang blog và portfolio để showcase dự án" },
          ].map((project) => (
            <div key={project.number} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-orange-400 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">Dự án {project.number}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-700">{project.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* Nội dung khóa học */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Bạn sẽ học được những gì?
            </h2>
            <div className="flex items-center justify-center gap-8 text-white/80 text-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-orange-400" />
                <span className="font-bold">{course.totalLessons}</span>
                <span>Bài học</span>
              </div>
              <span className="text-white/40">•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-400" />
                <span className="font-bold">{course.duration}</span>
                <span>Thời lượng</span>
              </div>
              <span className="text-white/40">•</span>
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-orange-400" />
                <span className="font-bold">{LEVEL_MAP[course.level]}</span>
              </div>
            </div>
          </div>

          {/* Course Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-6 text-white">
            {[
              "Hiểu cấu trúc chuẩn HTML",
              "Hiểu rõ về các thẻ Meta",
              "Thuộc tính, thuộc tính toàn cục",
              "Sử dụng liên kết chuyên sâu",
              "Sử dụng Emmet cơ bản",
              "Hiểu rõ tính kế thừa trong CSS",
              "Phân biệt thẻ inline và block",
              "Hiểu Box-model của mỗi phần tử",
              "Hiểu rõ về các đơn vị trong CSS",
              "Kiến thức về Typography",
              "Làm việc với hình ảnh và nền",
              "Thành thạo sử dụng Position",
              "Kỹ thuật sử dụng biến trong CSS",
              "CSS selectors nâng cao (có game)",
              "Thực sự hiểu về Semantic",
              "Sử dụng Flexbox chi tiết (tặng game)",
              "Sử dụng CSS Grid (có game và công cụ)",
              "Forms và validations không cần JavaScript",
              "Kỹ thuật Responsive với Grid System",
              "Tự xây dựng Grid System giống Bootstrap",
              "Sử dụng Animations và tối ưu hiệu năng",
              "Sử dụng Sass và xây dựng Grid System",
              "Hiểu về Web accessibility tự duy tối ưu UX",
              "Hiểu rõ về màu sắc, mã màu thấp lục phần",
              "Luyện mắt thẩm mỹ siêu chi tiết qua Quiz",
              "Sử dụng Github đưa trang web lên Internet",
              "Kiến thức SEO cơ bản để SEO-OnPage",
              "Tính hợp lệ của HTML, dùng thẻ chính xác",
              "Tự duy ứng dụng pseudo-classes/elements",
              "Đặt tên class theo chuẩn BEM",
              "Biết cách đặt tên class siêu dễ",
              "Có chế cache của trình duyệt",
              "CDN là gì và ứng dụng của CDN",
              "Hiểu về mạng LAN và mở web qua LAN",
              "Hiển thị ảnh khi chia sẻ lên Facebook",
              "Tối ưu Pre-connect/khẩn giải DNS trước",
              "Hiểu đúng cách sử dụng thẻ br, entities",
              "Kỹ thuật giữ dụng tỉ lệ hình ảnh và video",
              "Biết cách ứng dụng vị EM để giữ tỉ lệ",
              "Xây dựng Breakpoints cho trang web",
              "Tự duy Typography cho Font Scale",
              "Sử dụng các hàm min(), max(), clamp()",
              "Kỹ thuật tối ưu hình ảnh với SRC-SET",
              "Kỹ thuật 7-1 Pattern khi dùng SCSS",
              "Giới thiệu custom tag (Web components)",
              "Xây dựng Menu đa cấp và Mega Menu",
              "Cách sử dụng robots.txt, sitemap.xml",
              "Cách submit URL trang web lên Google",
              "Cách tạo Favicon cho tất cả các thiết bị",
              "Thực hành dự án số 8 (Multiple Pages)",
              "Thực hành làm Dark/Light mode dự án 8",
              "Tăng ban thêm 20+ Figma bản trả phí",
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3 group">
                <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/90 leading-relaxed hover:text-white transition-colors text-[15px]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mô tả khóa học */}
      <PageContainer size="lg" className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 text-center">
            Mô tả khóa học
          </h2>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed bg-white rounded-2xl border-2 border-gray-200 p-8">
            <p className="whitespace-pre-line">{course.description}</p>
          </div>
        </div>
      </PageContainer>

      {/* Người hướng dẫn tận tâm - F8 Style */}
      <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-16">
        <PageContainer size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Người hướng dẫn tận tâm
            </h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl border-2 border-gray-200 p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold text-5xl shadow-xl flex-shrink-0">
                {course.instructor.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2">
                  {course.instructor.name}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Senior Developer & Technical Instructor
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="text-3xl font-black text-orange-500 mb-1">{course.rating}</div>
                    <div className="text-sm text-gray-600 font-semibold">Đánh giá</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="text-3xl font-black text-orange-500 mb-1">{course.students.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 font-semibold">Học viên</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="text-3xl font-black text-orange-500 mb-1">10+</div>
                    <div className="text-sm text-gray-600 font-semibold">Khóa học</div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  Với hơn 10 năm kinh nghiệm trong lĩnh vực phát triển phần mềm và đào tạo, 
                  tôi đã giúp hàng nghìn học viên thành công trong sự nghiệp lập trình.
                </p>
                <p className="text-orange-600 font-bold italic">
                  *Tôi đã bỏ ra nhiều tháng để làm nội dung cho khóa học này!
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Phản hồi từ học viên */}
      <PageContainer size="lg" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            Phản hồi từ học viên
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              name: "Nguyễn Văn A",
              role: "Frontend Developer",
              content: "Khóa học rất chi tiết và dễ hiểu. Thầy giảng dạy tận tâm, mỗi video đều ngắn gọn nhưng đầy đủ kiến thức. Sau khi học xong tôi đã có thể tự làm được nhiều dự án thực tế.",
              rating: 5
            },
            {
              name: "Trần Thị B",
              role: "Học viên khóa Pro",
              content: "Đây là khóa học đáng giá nhất mà tôi từng tham gia. Giá cả phải chăng, nội dung chất lượng, hỗ trợ tận tình. Recommend cho bất kỳ ai muốn học lập trình!",
              rating: 5
            },
          ].map((review, index) => (
            <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-400 hover:shadow-lg transition-all">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-orange-200 mb-3" />
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{review.content}"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-600">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* Tại sao nên học khóa học này? */}
      <div className="bg-gray-50 py-16">
        <PageContainer size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Tại sao nên học khóa học này?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Khác biệt khóa Pro */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Khác biệt khóa Pro</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Khóa học đầy đủ và chi tiết nhất</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Thực hành nhiều dự án thực tế</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>400+ bài học, 300+ bài tập</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Đáp án cho mọi bài tập</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Kênh hỏi đáp riêng tư</span>
                </li>
              </ul>
            </div>

            {/* Nền tảng hàng đầu */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Nền tảng hàng đầu</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Đa dạng loại hình học: Video, Quiz, Test</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Code song song cùng video</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Chạy thử nghiệm ngay với Code Snippet</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Chức năng ghi chú Pro hỗ trợ Highlight</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Dark/Light mode cho riêng khóa Pro</span>
                </li>
              </ul>
            </div>

            {/* Người thầy tâm huyết */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Người thầy tâm huyết</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Bỏ ra nhiều tháng xây dựng khóa học</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Quay 500+ videos cho khóa này</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Soạn 200+ bài viết và 300+ bài tập</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Trả lời 2000+ hỏi đáp của học viên</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Rèn luyện kỹ năng giảng dạy</span>
                </li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Câu hỏi thường gặp - F8 Accordion Style */}
      <PageContainer size="lg" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
            Câu hỏi thường gặp
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.question}</h3>
                {expandedFaq === index ? (
                  <ChevronUp className="w-6 h-6 text-orange-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </PageContainer>

      {/* CTA Final - F8 Style */}
      <div className="bg-gradient-to-br from-orange-500 via-yellow-500 to-pink-500 py-16">
        <PageContainer size="lg">
          <div className="text-center text-white">
            <h2 className="text-3xl lg:text-5xl font-black mb-6">
              Sẵn sàng bắt đầu học ngay?
            </h2>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              Tham gia cùng {course.students.toLocaleString()}+ học viên đang tin tưởng khóa học này
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full sm:w-auto bg-white text-orange-600 hover:bg-gray-100 font-black py-5 px-12 rounded-full transition-all duration-300 shadow-2xl hover:shadow-3xl disabled:opacity-50 text-lg"
              >
                {enrolling ? "Đang xử lý..." : "ĐĂNG KÝ NGAY"}
              </button>
              {!course.isFree && (
                <div className="text-center sm:text-left">
                  <p className="text-3xl font-black">{new Intl.NumberFormat('vi-VN').format(course.priceAmount)}₫</p>
                  <p className="text-sm opacity-90">Mua một lần, học mãi mãi</p>
                </div>
              )}
            </div>
            {course.isPro && (
              <div className="mt-6 flex items-center justify-center space-x-2">
                <Shield className="w-6 h-6" />
                <span className="font-bold">Đảm bảo hoàn tiền 100% trong 30 ngày</span>
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
