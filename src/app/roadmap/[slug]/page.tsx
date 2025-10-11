"use client";

import { ArrowLeft, CheckCircle, Clock, Users, Star, Play, BookOpen, Trophy, Award, Zap } from "lucide-react";
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
    }
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
    }
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
    roadmapTree: {
      id: "fullstack-root",
      title: "Full-stack",
      description: "Complete Web Development",
      type: "core",
      status: "available",
      children: [
        {
          id: "frontend-basics",
          title: "Front-end Basics",
          type: "core",
          status: "available",
          duration: "6 weeks",
          children: [
            {
              id: "html-css",
              title: "HTML & CSS",
              type: "core",
              status: "available",
              duration: "3 weeks"
            },
            {
              id: "javascript-fundamentals",
              title: "JavaScript Fundamentals",
              type: "core",
              status: "available",
              duration: "3 weeks"
            }
          ]
        },
        {
          id: "frontend-advanced",
          title: "Advanced Front-end",
          type: "core",
          status: "available",
          children: [
            {
              id: "react-framework",
              title: "React Framework",
              type: "core",
              status: "available",
              duration: "6 weeks"
            },
            {
              id: "build-tools",
              title: "Build Tools",
              type: "optional",
              status: "available",
              duration: "2 weeks"
            }
          ]
        },
        {
          id: "backend-development",
          title: "Back-end Development",
          type: "core",
          status: "available",
          children: [
            {
              id: "nodejs-backend",
              title: "Node.js Backend",
              type: "core",
              status: "available",
              duration: "4 weeks"
            },
            {
              id: "database-integration",
              title: "Database Integration",
              type: "core",
              status: "available",
              duration: "3 weeks"
            }
          ]
        },
        {
          id: "deployment-devops",
          title: "Deployment & DevOps",
          type: "optional",
          status: "available",
          children: [
            {
              id: "cloud-deployment",
              title: "Cloud Deployment",
              type: "optional",
              status: "available",
              duration: "2 weeks"
            },
            {
              id: "ci-cd",
              title: "CI/CD",
              type: "optional",
              status: "available",
              duration: "2 weeks"
            }
          ]
        }
      ]
    }
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
    roadmapTree: {
      id: "mobile-root",
      title: "Mobile Development",
      description: "Cross-platform Mobile Apps",
      type: "core",
      status: "available",
      children: [
        {
          id: "programming-basics",
          title: "Programming Basics",
          type: "core",
          status: "available",
          duration: "4 weeks",
          children: [
            {
              id: "javascript-mobile",
              title: "JavaScript for Mobile",
              type: "core",
              status: "available",
              duration: "2 weeks"
            },
            {
              id: "react-basics",
              title: "React Basics",
              type: "core",
              status: "available",
              duration: "2 weeks"
            }
          ]
        },
        {
          id: "react-native",
          title: "React Native",
          type: "core",
          status: "available",
          children: [
            {
              id: "rn-fundamentals",
              title: "React Native Fundamentals",
              type: "core",
              status: "available",
              duration: "4 weeks"
            },
            {
              id: "navigation",
              title: "Navigation",
              type: "core",
              status: "available",
              duration: "2 weeks"
            }
          ]
        },
        {
          id: "mobile-features",
          title: "Mobile Features",
          type: "optional",
          status: "available",
          children: [
            {
              id: "device-features",
              title: "Device Features",
              type: "optional",
              status: "available",
              duration: "3 weeks"
            },
            {
              id: "api-integration",
              title: "API Integration",
              type: "optional",
              status: "available",
              duration: "2 weeks"
            }
          ]
        }
      ]
    }
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
    roadmapTree: {
      id: "devops-root",
      title: "DevOps Engineering",
      description: "Infrastructure and Deployment",
      type: "core",
      status: "available",
      children: [
        {
          id: "linux-basics",
          title: "Linux Basics",
          type: "core",
          status: "available",
          duration: "3 weeks",
          children: [
            {
              id: "command-line",
              title: "Command Line",
              type: "core",
              status: "available",
              duration: "1 week"
            },
            {
              id: "system-admin",
              title: "System Administration",
              type: "core",
              status: "available",
              duration: "2 weeks"
            }
          ]
        },
        {
          id: "version-control",
          title: "Version Control",
          type: "core",
          status: "available",
          children: [
            {
              id: "git-advanced",
              title: "Advanced Git",
              type: "core",
              status: "available",
              duration: "2 weeks"
            }
          ]
        },
        {
          id: "cloud-platforms",
          title: "Cloud Platforms",
          type: "core",
          status: "available",
          children: [
            {
              id: "aws-services",
              title: "AWS Services",
              type: "core",
              status: "available",
              duration: "4 weeks"
            },
            {
              id: "docker-containers",
              title: "Docker & Containers",
              type: "core",
              status: "available",
              duration: "3 weeks"
            }
          ]
        },
        {
          id: "ci-cd-pipelines",
          title: "CI/CD Pipelines",
          type: "core",
          status: "available",
          children: [
            {
              id: "jenkins-github",
              title: "Jenkins & GitHub Actions",
              type: "core",
              status: "available",
              duration: "3 weeks"
            },
            {
              id: "monitoring",
              title: "Monitoring & Logging",
              type: "optional",
              status: "available",
              duration: "2 weeks"
            }
          ]
        }
      ]
    }
  }
};

export default function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const roadmap = roadmapDetails[slug];
  
  if (!roadmap) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <PageContainer size="md" className="py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/roadmap" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại lộ trình học
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {roadmap.title}
          </h1>
          <p className="text-xl text-indigo-600 dark:text-indigo-400 font-medium mb-6">
            {roadmap.subtitle}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
            {roadmap.description}
          </p>

          {/* Key Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{roadmap.totalDuration}</div>
              <div className="text-sm text-muted-foreground">Thời gian</div>
            </div>
            <div className="text-center">
              <Badge 
                variant={roadmap.difficulty === 'Cơ bản' ? 'success' : roadmap.difficulty === 'Trung cấp' ? 'warning' : 'danger'}
                size="sm"
              >
                {roadmap.difficulty}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Độ khó</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{roadmap.salary}</div>
              <div className="text-sm text-muted-foreground">Lương khởi điểm</div>
            </div>
          </div>

          {/* Main Action Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href={`/roadmap/${slug}/flow`}>
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl mx-auto">
                <Zap className="w-6 h-6" />
                <span className="text-lg">Xem sơ đồ lộ trình</span>
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              Bạn sẽ học được
            </h3>
            <ul className="space-y-2">
              {roadmap.whatYouWillLearn.slice(0, 4).map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              Con đường sự nghiệp
            </h3>
            <ul className="space-y-2">
              {roadmap.careerPaths.slice(0, 4).map((path, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">{path}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Sẵn sàng bắt đầu hành trình?</h3>
            <p className="mb-6 opacity-90">
              Khám phá sơ đồ lộ trình chi tiết với các node kỹ năng và đường dẫn học tập rõ ràng.
            </p>
            <Link href={`/roadmap/${slug}/flow`}>
              <button className="px-8 py-3 bg-white dark:bg-muted text-indigo-600 dark:text-indigo-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-muted/70 transition-colors duration-200">
                Khám phá sơ đồ lộ trình
              </button>
            </Link>
          </div>
        </motion.div>
      </PageContainer>
    </div>
  );
}