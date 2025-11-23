"use client";

import { 
  ArrowLeft, CheckCircle, Clock, Users, Star, Play, BookOpen, Trophy, Award, Zap, 
  ChevronRight, Target, Briefcase, DollarSign, BarChart, HelpCircle, MessageCircle, 
  Shield, Globe, Code, Layers, Terminal, ChevronDown, ChevronUp 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import PageContainer from "@/components/PageContainer";
import { use, useState } from "react";

interface RoadmapDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  totalDuration: string;
  totalCourses: number;
  totalStudents: number;
  difficulty: "Cơ bản" | "Trung cấp" | "Nâng cao";
  prerequisites: string[];
  whatYouWillLearn: string[];
  careerPaths: string[];
  salary: string;
  color: string;
  gradient: string;
  benefits: { title: string; description: string; icon: any }[];
  curriculum: { phase: string; title: string; description: string; duration: string; topics: string[] }[];
  faqs: { question: string; answer: string }[];
}

const roadmapDetails: Record<string, RoadmapDetail> = {
  frontend: {
    id: "frontend",
    title: "Lộ trình Front-end Developer",
    subtitle: "Trở thành chuyên gia phát triển giao diện web",
    description: "Lộ trình học Front-end từ cơ bản đến nâng cao, bao gồm HTML, CSS, JavaScript và các framework hiện đại như React, Vue.js. Bạn sẽ học cách tạo ra những giao diện web đẹp, tương tác và responsive.",
    totalDuration: "8-12 tháng",
    totalCourses: 8,
    totalStudents: 45000,
    difficulty: "Cơ bản",
    prerequisites: [
      "Kiến thức cơ bản về máy tính",
      "Đam mê về thiết kế và giao diện",
      "Kiên nhẫn và tỉ mỉ"
    ],
    whatYouWillLearn: [
      "Tạo giao diện web với HTML, CSS",
      "Lập trình JavaScript từ cơ bản đến nâng cao", 
      "Sử dụng các framework React, Vue.js",
      "Responsive design và mobile-first",
      "Tương tác với API và xử lý dữ liệu",
      "Version control với Git/GitHub",
      "Deploy và hosting website"
    ],
    careerPaths: [
      "Front-end Developer",
      "UI/UX Developer",
      "Full-stack Developer",
      "React Developer",
      "Vue.js Developer"
    ],
    salary: "15-30 triệu VNĐ",
    color: "blue",
    gradient: "from-blue-600 to-indigo-600",
    benefits: [
      { title: "Nhu cầu tuyển dụng cao", description: "Front-end luôn là vị trí được săn đón nhiều nhất tại các công ty công nghệ.", icon: Target },
      { title: "Trực quan & Sáng tạo", description: "Kết quả công việc hiển thị ngay lập tức, thỏa sức sáng tạo giao diện.", icon: PaletteIcon },
      { title: "Cộng đồng lớn mạnh", description: "Hàng triệu lập trình viên sẵn sàng hỗ trợ và chia sẻ kiến thức.", icon: Globe }
    ],
    curriculum: [
      {
        phase: "Giai đoạn 1",
        title: "Nền tảng Web",
        description: "Làm quen với cách web hoạt động và xây dựng giao diện tĩnh.",
        duration: "1-2 tháng",
        topics: ["HTML5 & Semantic Web", "CSS3 & Flexbox/Grid", "Responsive Design", "Git cơ bản"]
      },
      {
        phase: "Giai đoạn 2",
        title: "Lập trình JavaScript",
        description: "Biến giao diện tĩnh thành động và xử lý logic phức tạp.",
        duration: "2-3 tháng",
        topics: ["JS Core (ES6+)", "DOM Manipulation", "Async/Await & API", "Thuật toán cơ bản"]
      },
      {
        phase: "Giai đoạn 3",
        title: "Framework hiện đại",
        description: "Xây dựng ứng dụng web quy mô lớn với ReactJS.",
        duration: "3-4 tháng",
        topics: ["React Fundamentals", "Hooks & Context", "State Management (Redux)", "Next.js Basics"]
      }
    ],
    faqs: [
      { question: "Tôi không có bằng CNTT có học được không?", answer: "Hoàn toàn được! Front-end là một trong những hướng đi dễ tiếp cận nhất cho người trái ngành. Chỉ cần bạn kiên trì và thực hành đều đặn." },
      { question: "Cần bao lâu để có thể đi làm?", answer: "Trung bình từ 6-8 tháng nếu bạn dành 2-3 tiếng mỗi ngày để học nghiêm túc. Tuy nhiên, tốc độ còn tùy thuộc vào khả năng tiếp thu của mỗi người." },
      { question: "Khóa học có dự án thực tế không?", answer: "Có, lộ trình này bao gồm 5+ dự án lớn nhỏ từ Landing Page, Todo App đến trang E-commerce hoàn chỉnh." }
    ]
  },
  backend: {
    id: "backend",
    title: "Lộ trình Back-end Developer", 
    subtitle: "Trở thành chuyên gia phát triển hệ thống backend",
    description: "Lộ trình học Back-end từ cơ bản đến nâng cao, tập trung vào xây dựng API, quản lý database, và kiến trúc hệ thống. Bạn sẽ học Node.js, PHP, Python và các công nghệ backend hiện đại.",
    totalDuration: "10-15 tháng",
    totalCourses: 10,
    totalStudents: 32000,
    difficulty: "Trung cấp",
    prerequisites: [
      "Kiến thức cơ bản về lập trình",
      "Logic tư duy tốt",
      "Hiểu biết về database cơ bản"
    ],
    whatYouWillLearn: [
      "Lập trình server-side với Node.js, PHP",
      "Quản lý database MySQL, MongoDB",
      "Xây dựng RESTful API",
      "Authentication & Authorization",
      "Microservices architecture", 
      "DevOps cơ bản",
      "Testing và Security"
    ],
    careerPaths: [
      "Backend Developer",
      "Full-stack Developer", 
      "DevOps Engineer",
      "System Architect",
      "Database Administrator"
    ],
    salary: "18-35 triệu VNĐ",
    color: "purple",
    gradient: "from-purple-600 to-violet-600",
    benefits: [
      { title: "Mức lương hấp dẫn", description: "Backend Developer thường có mức lương khởi điểm cao hơn các vị trí khác.", icon: DollarSign },
      { title: "Tư duy logic", description: "Rèn luyện tư duy giải quyết vấn đề và tối ưu hệ thống.", icon: BrainIcon },
      { title: "Cơ hội thăng tiến", description: "Dễ dàng phát triển lên các vị trí cao cấp như System Architect, CTO.", icon: TrendingUpIcon }
    ],
    curriculum: [
      {
        phase: "Giai đoạn 1",
        title: "Ngôn ngữ & Logic",
        description: "Nắm vững ngôn ngữ lập trình và tư duy thuật toán.",
        duration: "2 tháng",
        topics: ["Cấu trúc dữ liệu & Giải thuật", "Ngôn ngữ (Node.js/Java/Go)", "OOP & Design Patterns"]
      },
      {
        phase: "Giai đoạn 2",
        title: "Database & API",
        description: "Làm việc với dữ liệu và xây dựng giao diện lập trình ứng dụng.",
        duration: "3 tháng",
        topics: ["SQL & NoSQL", "RESTful API Design", "Authentication (JWT/OAuth)", "Caching (Redis)"]
      },
      {
        phase: "Giai đoạn 3",
        title: "Architecture & DevOps",
        description: "Xây dựng hệ thống lớn, bảo mật và dễ mở rộng.",
        duration: "3-4 tháng",
        topics: ["Microservices", "Docker & CI/CD", "System Design", "Cloud Basics (AWS)"]
      }
    ],
    faqs: [
      { question: "Backend khó hơn Frontend phải không?", answer: "Backend đòi hỏi tư duy logic và trừu tượng cao hơn, nhưng không nhất thiết là khó hơn. Nếu bạn thích làm việc với dữ liệu và hệ thống, bạn sẽ thấy nó thú vị." },
      { question: "Nên học ngôn ngữ nào đầu tiên?", answer: "Node.js (JavaScript) là lựa chọn tốt nếu bạn muốn hướng tới Full-stack. Java hoặc Go là lựa chọn tốt cho các hệ thống lớn, doanh nghiệp." }
    ]
  },
  fullstack: {
    id: "fullstack",
    title: "Lộ trình Full-stack Developer",
    subtitle: "Trở thành chuyên gia phát triển web hoàn chỉnh",
    description: "Lộ trình học Full-stack kết hợp cả Front-end và Back-end, từ xây dựng giao diện người dùng đến phát triển server và database. Bạn sẽ học cách tạo ra các ứng dụng web hoàn chỉnh.",
    totalDuration: "12-18 tháng",
    totalCourses: 15,
    totalStudents: 28000,
    difficulty: "Trung cấp",
    prerequisites: [
      "Kiến thức cơ bản về lập trình",
      "Hiểu biết về HTML/CSS",
      "Mong muốn học cả frontend và backend"
    ],
    whatYouWillLearn: [
      "Xây dựng giao diện với React/Vue",
      "Phát triển API với Node.js/Express",
      "Quản lý database SQL/NoSQL",
      "Authentication và bảo mật",
      "Triển khai ứng dụng lên cloud",
      "DevOps và CI/CD cơ bản",
      "Testing và debugging"
    ],
    careerPaths: [
      "Full-stack Developer",
      "Web Developer",
      "Software Engineer",
      "Tech Lead",
      "Freelance Developer"
    ],
    salary: "20-40 triệu VNĐ",
    color: "indigo",
    gradient: "from-indigo-600 to-blue-600",
    benefits: [
      { title: "Đa năng & Linh hoạt", description: "Có thể làm việc ở cả phía client và server, dễ dàng thích nghi dự án.", icon: Layers },
      { title: "Thu nhập cao", description: "Full-stack Developer luôn được trả lương cao vì giá trị mang lại lớn.", icon: DollarSign },
      { title: "Khả năng làm Product", description: "Tự mình xây dựng được một sản phẩm hoàn chỉnh từ A-Z.", icon: RocketIcon }
    ],
    curriculum: [
      {
        phase: "Giai đoạn 1",
        title: "Front-end Foundation",
        description: "Xây dựng giao diện người dùng chuyên nghiệp.",
        duration: "3-4 tháng",
        topics: ["HTML/CSS/JS Advanced", "React/Vue Ecosystem", "UI/UX Basics"]
      },
      {
        phase: "Giai đoạn 2",
        title: "Back-end Mastery",
        description: "Xây dựng server và xử lý dữ liệu.",
        duration: "3-4 tháng",
        topics: ["Node.js & Express", "Database Design", "API Security"]
      },
      {
        phase: "Giai đoạn 3",
        title: "Integration & DevOps",
        description: "Kết nối, triển khai và vận hành ứng dụng.",
        duration: "2-3 tháng",
        topics: ["Full-stack Integration", "Docker & Deployment", "Performance Optimization"]
      }
    ],
    faqs: [
      { question: "Học Full-stack có bị quá tải không?", answer: "Khối lượng kiến thức khá lớn, nên bạn cần lộ trình rõ ràng. Chúng tôi chia nhỏ thành từng giai đoạn để bạn không bị ngợp." },
      { question: "Nên học sâu một mảng hay học cả hai?", answer: "Nên bắt đầu sâu một mảng (Front hoặc Back) rồi mở rộng sang mảng còn lại. Lộ trình này được thiết kế theo hướng đó." }
    ]
  },
  mobile: {
    id: "mobile",
    title: "Lộ trình Mobile Developer",
    subtitle: "Trở thành chuyên gia phát triển ứng dụng di động",
    description: "Lộ trình học Mobile Development tập trung vào việc phát triển ứng dụng di động đa nền tảng. Bạn sẽ học React Native để tạo app chạy trên cả iOS và Android.",
    totalDuration: "8-12 tháng",
    totalCourses: 12,
    totalStudents: 22000,
    difficulty: "Cơ bản",
    prerequisites: [
      "Kiến thức JavaScript cơ bản",
      "Hiểu biết về React",
      "Đam mê ứng dụng di động"
    ],
    whatYouWillLearn: [
      "React Native fundamentals",
      "Navigation và routing",
      "State management",
      "API integration",
      "Device features (camera, GPS)",
      "Push notifications",
      "App store deployment",
      "Performance optimization"
    ],
    careerPaths: [
      "Mobile Developer",
      "React Native Developer",
      "Cross-platform Developer",
      "iOS/Android Developer",
      "App Developer"
    ],
    salary: "18-35 triệu VNĐ",
    color: "green",
    gradient: "from-emerald-600 to-teal-600",
    benefits: [
      { title: "Thị trường rộng mở", description: "Smartphone là vật bất ly thân, nhu cầu app mobile không bao giờ giảm.", icon: SmartphoneIcon },
      { title: "Cross-platform", description: "Viết code một lần, chạy được trên cả iOS và Android.", icon: Layers },
      { title: "Trải nghiệm người dùng", description: "Tạo ra những ứng dụng mượt mà, chạm vuốt trực tiếp.", icon: HandIcon }
    ],
    curriculum: [
      {
        phase: "Giai đoạn 1",
        title: "Cơ bản về Mobile",
        description: "Hiểu về môi trường mobile và React Native.",
        duration: "2 tháng",
        topics: ["JS & ES6+", "React Native Basics", "Layout & Styling"]
      },
      {
        phase: "Giai đoạn 2",
        title: "Tính năng nâng cao",
        description: "Xử lý các tính năng đặc thù của mobile.",
        duration: "3 tháng",
        topics: ["Navigation", "State Management", "API & Networking", "Device Features"]
      },
      {
        phase: "Giai đoạn 3",
        title: "Release & Store",
        description: "Tối ưu và đưa ứng dụng lên store.",
        duration: "1-2 tháng",
        topics: ["Performance", "Testing", "App Store & Play Store Publish"]
      }
    ],
    faqs: [
      { question: "Cần máy Mac để học không?", answer: "Để build cho iOS bạn cần máy Mac. Tuy nhiên, với React Native và Expo, bạn có thể bắt đầu học trên Windows/Linux và test trên điện thoại thật." }
    ]
  },
  devops: {
    id: "devops",
    title: "Lộ trình DevOps Engineer",
    subtitle: "Trở thành chuyên gia DevOps và triển khai hệ thống",
    description: "Lộ trình học DevOps tập trung vào việc tự động hóa quy trình phát triển phần mềm, triển khai và vận hành hệ thống. Bạn sẽ học Linux, cloud computing, và các công cụ DevOps hiện đại.",
    totalDuration: "10-15 tháng",
    totalCourses: 14,
    totalStudents: 18000,
    difficulty: "Nâng cao",
    prerequisites: [
      "Kiến thức lập trình cơ bản",
      "Hiểu biết về hệ điều hành",
      "Mong muốn làm việc với infrastructure"
    ],
    whatYouWillLearn: [
      "Linux system administration",
      "Version control với Git",
      "Cloud platforms (AWS/Azure)",
      "Containerization với Docker",
      "CI/CD pipelines",
      "Infrastructure as Code",
      "Monitoring và logging",
      "Security best practices"
    ],
    careerPaths: [
      "DevOps Engineer",
      "Site Reliability Engineer",
      "Cloud Engineer",
      "Infrastructure Engineer",
      "Platform Engineer"
    ],
    salary: "25-45 triệu VNĐ",
    color: "red",
    gradient: "from-red-600 to-orange-600",
    benefits: [
      { title: "Vị trí then chốt", description: "Cầu nối quan trọng giữa Development và Operations.", icon: Shield },
      { title: "Lương cực cao", description: "Một trong những vị trí có mức lương cao nhất ngành IT.", icon: DollarSign },
      { title: "Công nghệ hiện đại", description: "Làm việc với Cloud, Container, K8s và các công nghệ mới nhất.", icon: CloudIcon }
    ],
    curriculum: [
      {
        phase: "Giai đoạn 1",
        title: "System & Network",
        description: "Nắm vững hệ điều hành Linux và mạng máy tính.",
        duration: "2-3 tháng",
        topics: ["Linux Admin", "Bash Scripting", "Networking Basics"]
      },
      {
        phase: "Giai đoạn 2",
        title: "Container & CI/CD",
        description: "Đóng gói và tự động hóa quy trình.",
        duration: "3 tháng",
        topics: ["Docker", "Jenkins/GitLab CI", "Git Advanced"]
      },
      {
        phase: "Giai đoạn 3",
        title: "Cloud & Orchestration",
        description: "Quản lý hạ tầng trên mây và Kubernetes.",
        duration: "4 tháng",
        topics: ["AWS/Azure", "Terraform", "Kubernetes", "Monitoring (ELK/Prometheus)"]
      }
    ],
    faqs: [
      { question: "DevOps có cần biết code không?", answer: "Có, bạn cần biết script (Bash, Python) và hiểu quy trình phát triển phần mềm để hỗ trợ team Dev tốt nhất." }
    ]
  }
};

// Icon components for mapping
function PaletteIcon(props: any) { return <Zap {...props} /> }
function BrainIcon(props: any) { return <Users {...props} /> }
function TrendingUpIcon(props: any) { return <BarChart {...props} /> }
function RocketIcon(props: any) { return <Zap {...props} /> }
function SmartphoneIcon(props: any) { return <Zap {...props} /> }
function HandIcon(props: any) { return <Users {...props} /> }
function CloudIcon(props: any) { return <Zap {...props} /> }

export default function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const roadmap = roadmapDetails[slug];
  
  if (!roadmap) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section - Immersive & Premium */}
      <div className={`relative bg-gradient-to-br ${roadmap.gradient} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-black/5"></div>
        
        {/* Animated Background Shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <PageContainer size="lg" className="relative py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link href="/roadmap" className="inline-flex items-center text-white/90 hover:text-white transition-colors text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách lộ trình
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="warning" className="mb-4 bg-white/20 text-white border-none backdrop-blur-sm">
                Lộ trình chuẩn 2025
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-[800] mb-6 leading-tight tracking-tight">
                {roadmap.title}
              </h1>
              <p className="text-xl text-white/90 font-medium mb-8 leading-relaxed max-w-xl">
                {roadmap.subtitle}. {roadmap.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="flex items-center bg-black/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
                  <Clock className="w-5 h-5 mr-3 text-white/80" />
                  <div>
                    <div className="text-xs text-white/60 uppercase font-semibold">Thời gian</div>
                    <div className="font-bold">{roadmap.totalDuration}</div>
                  </div>
                </div>
                <div className="flex items-center bg-black/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
                  <Users className="w-5 h-5 mr-3 text-white/80" />
                  <div>
                    <div className="text-xs text-white/60 uppercase font-semibold">Học viên</div>
                    <div className="font-bold">{roadmap.totalStudents.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center bg-black/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
                  <BarChart className="w-5 h-5 mr-3 text-white/80" />
                  <div>
                    <div className="text-xs text-white/60 uppercase font-semibold">Độ khó</div>
                    <div className="font-bold">{roadmap.difficulty}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href={`/roadmap/${slug}/flow`}>
                  <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Bắt đầu học ngay
                  </button>
                </Link>
                <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300">
                  Xem chi tiết
                </button>
              </div>
            </motion.div>
            
            {/* Hero Card / Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-white/50 text-sm font-mono">roadmap.config.js</div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/20 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse delay-75"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse delay-150"></div>
                  <div className="h-32 bg-white/5 rounded-xl border border-white/10 mt-6 flex items-center justify-center">
                    <Code className="w-16 h-16 text-white/20" />
                  </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white text-indigo-900 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">Mức lương</div>
                    <div className="font-bold text-lg">{roadmap.salary}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </PageContainer>
      </div>

      <PageContainer size="lg" className="py-16 -mt-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Why this roadmap? (Benefits) */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className={`w-6 h-6 mr-3 text-${roadmap.color}-600`} />
                Tại sao nên chọn lộ trình này?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {roadmap.benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-${roadmap.color}-50 flex items-center justify-center mb-4 text-${roadmap.color}-600`}>
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Curriculum Preview */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <BookOpen className={`w-6 h-6 mr-3 text-${roadmap.color}-600`} />
                Nội dung lộ trình
              </h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {roadmap.curriculum.map((phase, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-indigo-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <span className="font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{phase.phase}</span>
                        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">{phase.duration}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{phase.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{phase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.topics.map((topic, i) => (
                          <span key={i} className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* What You Will Learn (Checklist) */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-green-400" />
                Kết quả đạt được
              </h2>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {roadmap.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HelpCircle className={`w-6 h-6 mr-3 text-${roadmap.color}-600`} />
                Câu hỏi thường gặp
              </h2>
              <div className="space-y-4">
                {roadmap.faqs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar - Right Column (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Action Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 overflow-hidden relative"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${roadmap.gradient}`}></div>
                
                <div className="text-center mb-6 pt-2">
                  <div className="text-sm text-gray-500 font-medium mb-1">Học phí trọn đời</div>
                  <div className="text-4xl font-bold text-gray-900">Miễn phí</div>
                  <div className="text-sm text-green-600 font-medium mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">
                    Không giới hạn thời gian
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center"><Play className="w-4 h-4 mr-2" /> Số lượng khóa học</span>
                    <span className="font-semibold">{roadmap.totalCourses}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center"><Clock className="w-4 h-4 mr-2" /> Thời lượng</span>
                    <span className="font-semibold">{roadmap.totalDuration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center"><Award className="w-4 h-4 mr-2" /> Chứng chỉ</span>
                    <span className="font-semibold">Có</span>
                  </div>
                </div>

                <Link href={`/roadmap/${slug}/flow`} className="block w-full">
                  <button className={`w-full py-4 bg-gradient-to-r ${roadmap.gradient} hover:opacity-90 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}>
                    <Zap className="w-5 h-5" />
                    <span>Bắt đầu học ngay</span>
                  </button>
                </Link>
              </motion.div>

              {/* Career Paths */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className={`w-5 h-5 mr-2 text-${roadmap.color}-600`} />
                  Cơ hội nghề nghiệp
                </h3>
                <div className="space-y-3">
                  {roadmap.careerPaths.map((path, index) => (
                    <div key={index} className="flex items-center justify-between group cursor-default p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <span className="text-gray-700 font-medium">{path}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Proof */}
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 text-center">
                <h3 className="font-bold text-indigo-900 mb-2">Tham gia cộng đồng</h3>
                <p className="text-sm text-indigo-700 mb-4">Học tập cùng 45,000+ thành viên khác</p>
                <div className="flex justify-center -space-x-3 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600">+99</div>
                </div>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                  Tham gia Discord &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
