"use client";

import { ArrowLeft, CheckCircle, Clock, Users, Star, Play, BookOpen, Trophy, Award, Zap, ChevronRight, Target, Briefcase, DollarSign, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import PageContainer from "@/components/PageContainer";
import { use } from "react";

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
    gradient: "from-blue-600 to-indigo-600"
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
    gradient: "from-purple-600 to-violet-600"
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
    gradient: "from-indigo-600 to-blue-600"
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
    gradient: "from-emerald-600 to-teal-600"
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
    gradient: "from-red-600 to-orange-600"
  }
};

export default function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const roadmap = roadmapDetails[slug];
  
  if (!roadmap) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-br ${roadmap.gradient} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <PageContainer size="lg" className="relative py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link href="/roadmap" className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách lộ trình
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {roadmap.title}
              </h1>
              <p className="text-xl text-white/90 font-medium mb-6 leading-relaxed">
                {roadmap.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">{roadmap.totalDuration}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">{roadmap.totalStudents.toLocaleString()} học viên</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  <BarChart className="w-5 h-5 mr-2" />
                  <span className="font-medium">{roadmap.difficulty}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full transform -translate-y-1/2"></div>
              {/* Abstract Illustration or Icon could go here */}
            </motion.div>
          </div>
        </PageContainer>
      </div>

      <PageContainer size="lg" className="py-12 -mt-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className={`w-6 h-6 mr-3 text-${roadmap.color}-600`} />
                Tổng quan lộ trình
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {roadmap.description}
              </p>
            </motion.div>

            {/* What You Will Learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className={`w-6 h-6 mr-3 text-${roadmap.color}-600`} />
                Bạn sẽ học được gì?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {roadmap.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Prerequisites */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Zap className={`w-6 h-6 mr-3 text-${roadmap.color}-600`} />
                Yêu cầu đầu vào
              </h2>
              <ul className="space-y-4">
                {roadmap.prerequisites.map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-${roadmap.color}-500`}></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Action Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 overflow-hidden relative"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${roadmap.gradient}`}></div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 font-medium">Mức lương trung bình</span>
                    <Badge variant="success" size="sm">Hấp dẫn</Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 flex items-center">
                    <DollarSign className="w-6 h-6 text-green-500 mr-1" />
                    {roadmap.salary}
                  </div>
                </div>

                <Link href={`/roadmap/${slug}/flow`} className="block w-full">
                  <button className={`w-full py-4 bg-gradient-to-r ${roadmap.gradient} hover:opacity-90 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}>
                    <Zap className="w-5 h-5" />
                    <span>Bắt đầu học ngay</span>
                  </button>
                </Link>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  Truy cập miễn phí trọn đời • Cập nhật liên tục
                </p>
              </motion.div>

              {/* Career Paths */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className={`w-5 h-5 mr-2 text-${roadmap.color}-600`} />
                  Cơ hội nghề nghiệp
                </h3>
                <div className="space-y-3">
                  {roadmap.careerPaths.map((path, index) => (
                    <div key={index} className="flex items-center justify-between group cursor-default">
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{path}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}