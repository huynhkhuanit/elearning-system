"use client";

import { ArrowLeft, CheckCircle, Clock, Users, Star, Play, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import RoadmapTree from "@/components/RoadmapTree";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Cơ bbản" | "Trung cấp" | "Nâng cao";
  isCompleted?: boolean;
  isCurrent?: boolean;
  lessons: number;
  students: number;
  rating: number;
  isComingSoon?: boolean;
  technologies: string[];
}

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
  courses: Course[];
  careerPaths: string[];
  salary: string;
  roadmapTree?: any;
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
    roadmapTree: {
      id: "frontend-root",
      title: "Front-end",
      description: "Web Development",
      type: "core",
      status: "available",
      children: [
        {
          id: "internet",
          title: "Internet",
          type: "core",
          status: "completed",
          duration: "1 week",
          children: [
            {
              id: "how-internet-works",
              title: "How does the internet work?",
              type: "beginner",
              status: "completed",
              duration: "2 days"
            },
            {
              id: "what-is-http",
              title: "What is HTTP?",
              type: "beginner",
              status: "completed", 
              duration: "1 day"
            },
            {
              id: "domain-name",
              title: "What is Domain Name?",
              type: "beginner",
              status: "completed",
              duration: "1 day"
            },
            {
              id: "hosting",
              title: "What is hosting?",
              type: "beginner",
              status: "current",
              duration: "1 day"
            },
            {
              id: "dns",
              title: "DNS and how it works?",
              type: "beginner",
              status: "available",
              duration: "2 days"
            },
            {
              id: "browsers",
              title: "Browsers and how they work?",
              type: "beginner",
              status: "available",
              duration: "1 day"
            }
          ]
        },
        {
          id: "html-css-js",
          title: "HTML, CSS & JavaScript",
          type: "core",
          status: "current",
          children: [
            {
              id: "html",
              title: "HTML",
              type: "core",
              status: "completed",
              duration: "2 weeks"
            },
            {
              id: "css",
              title: "CSS",
              type: "core", 
              status: "completed",
              duration: "3 weeks"
            },
            {
              id: "javascript",
              title: "JavaScript",
              type: "core",
              status: "current",
              duration: "4 weeks"
            }
          ]
        },
        {
          id: "package-managers",
          title: "Package Managers",
          type: "optional",
          status: "available",
          children: [
            {
              id: "npm",
              title: "npm",
              type: "optional",
              status: "available",
              duration: "1 week"
            },
            {
              id: "yarn",
              title: "yarn", 
              type: "alternative",
              status: "available",
              duration: "1 week"
            }
          ]
        }
      ]
    },
    courses: [
      {
        id: "html-css",
        title: "HTML CSS từ Zero đến Hero",
        description: "Học HTML CSS từ cơ bản, từng bước một cách chi tiết và dễ hiểu nhất.",
        duration: "30h",
        level: "Cơ bản",
        isCompleted: true,
        lessons: 156,
        students: 50000,
        rating: 4.9,
        technologies: ["HTML", "CSS", "Responsive"]
      },
      {
        id: "javascript",
        title: "JavaScript cơ bản",
        description: "Học JavaScript từ cơ bản, hiểu rõ các khái niệm và cách sử dụng trong thực tế.",
        duration: "42h",
        level: "Cơ bản",
        isCurrent: true,
        lessons: 120,
        students: 35000,
        rating: 4.8,
        technologies: ["JavaScript", "ES6", "DOM"]
      },
      {
        id: "javascript-advanced", 
        title: "JavaScript nâng cao",
        description: "Nâng cao kỹ năng JavaScript với ES6+, Async/Await, Modules và Design Patterns.",
        duration: "38h",
        level: "Nâng cao",
        lessons: 95,
        students: 25000,
        rating: 4.7,
        technologies: ["ES6+", "Async", "Modules", "OOP"]
      },
      {
        id: "react-js",
        title: "ReactJS từ cơ bản đến nâng cao",
        description: "Học ReactJS từ cơ bản, tạo các ứng dụng web hiện đại và tương tác.",
        duration: "45h",
        level: "Trung cấp",
        lessons: 180,
        students: 40000,
        rating: 4.9,
        technologies: ["React", "JSX", "Hooks", "Context"]
      },
      {
        id: "nodejs-api",
        title: "Node.js & ExpressJS",
        description: "Xây dựng API RESTful với Node.js và Express framework.",
        duration: "35h",
        level: "Trung cấp",
        lessons: 85,
        students: 20000,
        rating: 4.6,
        technologies: ["Node.js", "Express", "MongoDB", "JWT"]
      },
      {
        id: "responsive-design",
        title: "Responsive Web Design",
        description: "Thiết kế web responsive, tối ưu cho mọi thiết bị di động.",
        duration: "20h",
        level: "Cơ bản",
        lessons: 45,
        students: 30000,
        rating: 4.8,
        technologies: ["CSS Grid", "Flexbox", "Bootstrap", "Media Queries"]
      },
      {
        id: "sass-scss",
        title: "Sass/SCSS Advanced",
        description: "Viết CSS hiệu quả hơn với Sass/SCSS và các tính năng nâng cao.",
        duration: "15h",
        level: "Trung cấp",
        isComingSoon: true,
        lessons: 30,
        students: 0,
        rating: 0,
        technologies: ["Sass", "SCSS", "Mixins", "Variables"]
      },
      {
        id: "webpack-tools",
        title: "Webpack & Build Tools",
        description: "Tối ưu và build ứng dụng với Webpack, Vite và các công cụ hiện đại.",
        duration: "25h",
        level: "Nâng cao",
        isComingSoon: true,
        lessons: 50,
        students: 0,
        rating: 0,
        technologies: ["Webpack", "Vite", "Babel", "NPM"]
      }
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
    roadmapTree: {
      id: "backend-root",
      title: "Back-end",
      description: "Server Development",
      type: "core",
      status: "available",
      children: [
        {
          id: "internet-basics",
          title: "Internet Basics",
          type: "core",
          status: "completed",
          duration: "1 week",
          children: [
            {
              id: "how-internet-works-backend",
              title: "How does internet work?",
              type: "beginner",
              status: "completed",
              duration: "2 days"
            },
            {
              id: "http-https",
              title: "HTTP/HTTPS",
              type: "beginner",
              status: "completed",
              duration: "1 day"
            }
          ]
        },
        {
          id: "programming-language",
          title: "Programming Language",
          type: "core",
          status: "current",
          children: [
            {
              id: "nodejs",
              title: "Node.js",
              type: "core",
              status: "current",
              duration: "4 weeks"
            },
            {
              id: "python",
              title: "Python",
              type: "alternative",
              status: "available",
              duration: "4 weeks"
            },
            {
              id: "php",
              title: "PHP",
              type: "alternative",
              status: "available",
              duration: "4 weeks"
            }
          ]
        },
        {
          id: "database",
          title: "Database",
          type: "core",
          status: "available",
          children: [
            {
              id: "mysql",
              title: "MySQL",
              type: "core",
              status: "available",
              duration: "3 weeks"
            },
            {
              id: "mongodb",
              title: "MongoDB",
              type: "alternative",
              status: "available",
              duration: "2 weeks"
            }
          ]
        }
      ]
    },
    courses: [
      {
        id: "nodejs-basic",
        title: "Node.js cơ bản",
        description: "Học Node.js từ cơ bản, xây dựng server và API đầu tiên.",
        duration: "40h",
        level: "Cơ bản",
        isCompleted: true,
        lessons: 120,
        students: 28000,
        rating: 4.8,
        technologies: ["Node.js", "npm", "CommonJS", "File System"]
      },
      {
        id: "express-api",
        title: "Express.js & RESTful API",
        description: "Xây dựng API hoàn chỉnh với Express.js framework.",
        duration: "45h",
        level: "Trung cấp",
        isCurrent: true,
        lessons: 135,
        students: 22000,
        rating: 4.7,
        technologies: ["Express.js", "REST API", "Middleware", "Routing"]
      },
      {
        id: "database-mysql",
        title: "MySQL Database",
        description: "Quản lý dữ liệu với MySQL, từ cơ bản đến tối ưu hiệu suất.",
        duration: "35h",
        level: "Cơ bản",
        lessons: 90,
        students: 25000,
        rating: 4.6,
        technologies: ["MySQL", "SQL", "Database Design", "Optimization"]
      },
      {
        id: "mongodb",
        title: "MongoDB & NoSQL",
        description: "Làm việc với MongoDB và các khái niệm NoSQL database.",
        duration: "30h", 
        level: "Trung cấp",
        lessons: 75,
        students: 18000,
        rating: 4.5,
        technologies: ["MongoDB", "NoSQL", "Aggregation", "Indexing"]
      },
      {
        id: "authentication",
        title: "Authentication & Security",
        description: "Bảo mật ứng dụng với JWT, OAuth và các phương pháp authentication.",
        duration: "25h",
        level: "Trung cấp",
        lessons: 60,
        students: 15000,
        rating: 4.8,
        technologies: ["JWT", "OAuth", "Passport.js", "Security"]
      },
      {
        id: "microservices",
        title: "Microservices Architecture",
        description: "Thiết kế và phát triển ứng dụng theo mô hình microservices.",
        duration: "40h",
        level: "Nâng cao",
        isComingSoon: true,
        lessons: 100,
        students: 0,
        rating: 0,
        technologies: ["Microservices", "Docker", "API Gateway", "Message Queue"]
      }
    ]
  }
};

export default function RoadmapDetailPage({ params }: { params: { slug: string } }) {
  const roadmap = roadmapDetails[params.slug];
  
  if (!roadmap) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/roadmap" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại lộ trình học
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {roadmap.title}
              </h1>
              <p className="text-xl text-indigo-600 font-medium mb-4">
                {roadmap.subtitle}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {roadmap.description}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{roadmap.totalCourses}</div>
                  <div className="text-sm text-gray-500">Khóa học</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{roadmap.totalDuration}</div>
                  <div className="text-sm text-gray-500">Thời gian</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{roadmap.totalStudents.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Học viên</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{roadmap.salary}</div>
                  <div className="text-sm text-gray-500">Lương khởi điểm</div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="lg:w-80">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-semibold text-gray-900 mb-4">Bạn sẽ học được gì?</h3>
                <ul className="space-y-2 mb-6">
                  {roadmap.whatYouWillLearn.slice(0, 5).map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Bắt đầu học ngay
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roadmap Tree Visualization */}
        {roadmap.roadmapTree && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <RoadmapTree
              title="Sơ đồ lộ trình học chi tiết"
              subtitle="Visualize your learning path step by step"
              description="Theo dõi tiến độ học tập của bạn qua từng bước cụ thể và có hệ thống"
              tree={roadmap.roadmapTree}
            />
          </motion.div>
        )}

        {/* Course List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Các khóa học trong lộ trình</h2>
          
          <div className="space-y-4">
            {roadmap.courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-all duration-200 ${
                  course.isCurrent ? 'border-indigo-500 ring-2 ring-indigo-100' : 
                  course.isCompleted ? 'border-green-200' : 
                  course.isComingSoon ? 'border-gray-200 opacity-60' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Status Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      course.isCompleted ? 'bg-green-100' :
                      course.isCurrent ? 'bg-indigo-100' :
                      course.isComingSoon ? 'bg-gray-100' : 'bg-gray-50'
                    }`}>
                      {course.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : course.isCurrent ? (
                        <Play className="w-5 h-5 text-indigo-600" />
                      ) : course.isComingSoon ? (
                        <Clock className="w-5 h-5 text-gray-400" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-gray-500" />
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        <Badge 
                          variant={course.level === 'Cơ bản' ? 'success' : course.level === 'Trung cấp' ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {course.level}
                        </Badge>
                        {course.isComingSoon && (
                          <Badge variant="secondary" size="sm">
                            Sắp ra mắt
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {course.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {course.technologies.map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Course Stats */}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.lessons} bài học</span>
                        </div>
                        {!course.isComingSoon && (
                          <>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{course.students.toLocaleString()} học viên</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>{course.rating}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {course.isComingSoon ? (
                      <button disabled className="px-4 py-2 text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed">
                        Sắp ra mắt
                      </button>
                    ) : course.isCompleted ? (
                      <button className="px-4 py-2 text-green-600 border border-green-200 hover:bg-green-50 rounded-lg transition-colors">
                        Xem lại
                      </button>
                    ) : course.isCurrent ? (
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        Tiếp tục học
                      </button>
                    ) : (
                      <button className="px-4 py-2 text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors">
                        Bắt đầu
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Career Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Trophy className="w-5 h-5 text-purple-600 mr-2" />
                  Con đường sự nghiệp
                </h3>
                <ul className="space-y-2">
                  {roadmap.careerPaths.map((path, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-gray-700">{path}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Yêu cầu tuyển dụng</h3>
                <ul className="space-y-2">
                  {roadmap.prerequisites.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}