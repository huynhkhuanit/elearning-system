"use client";

import { ArrowRight, CheckCircle, Star, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Technology {
  name: string;
  icon: string;
}

interface RoadmapItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  technologies: Technology[];
  buttonText: string;
  featured?: boolean;
}

interface RoleBasedRoadmap {
  id: string;
  title: string;
  isNew?: boolean;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'development' | 'data' | 'design' | 'management' | 'security' | 'mobile';
}

const roadmapData: RoadmapItem[] = [
  {
    id: "frontend",
    title: "Lộ trình học Front-end",
    subtitle: "Front-end Development Path",
    description: "Lập trình viên Front-end là người xây dựng ra giao diện websites. Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.",
    image: "/images/frontend-roadmap.png",
    technologies: [
      { name: "HTML", icon: "/icons/html.svg" },
      { name: "CSS", icon: "/icons/css.svg" },
      { name: "JavaScript", icon: "/icons/js.svg" },
      { name: "Bootstrap", icon: "/icons/bootstrap.svg" },
      { name: "Sass", icon: "/icons/sass.svg" },
      { name: "React", icon: "/icons/react.svg" },
      { name: "Redux", icon: "/icons/redux.svg" }
    ],
    buttonText: "XEM CHI TIẾT",
    featured: true
  },
  {
    id: "backend",
    title: "Lộ trình học Back-end",
    subtitle: "Back-end Development Path", 
    description: "Trái với Front-end thì lập trình viên Back-end là người làm việc với dữ liệu, công việc thường nặng tính logic hơn. Chúng ta sẽ cùng tìm hiểu thêm về lộ trình học Back-end nhé.",
    image: "/images/backend-roadmap.png",
    technologies: [
      { name: "HTML", icon: "/icons/html.svg" },
      { name: "CSS", icon: "/icons/css.svg" },
      { name: "JavaScript", icon: "/icons/js.svg" },
      { name: "Node.js", icon: "/icons/nodejs.svg" },
      { name: "PHP", icon: "/icons/php.svg" },
      { name: "MySQL", icon: "/icons/mysql.svg" }
    ],
    buttonText: "XEM CHI TIẾT"
  }
];

const roleBasedRoadmaps: RoleBasedRoadmap[] = [
  // Development
  { id: "frontend", title: "Frontend", category: "development" },
  { id: "backend", title: "Backend", category: "development" },
  { id: "fullstack", title: "Full Stack", category: "development" },
  { id: "devops", title: "DevOps", category: "development" },
  { id: "blockchain", title: "Blockchain", category: "development" },
  { id: "game-developer", title: "Game Developer", category: "development" },
  
  // Data & AI
  { id: "data-analyst", title: "Data Analyst", category: "data" },
  { id: "data-engineer", title: "Data Engineer", category: "data" },
  { id: "ai-engineer", title: "AI Engineer", category: "data" },
  { id: "machine-learning", title: "Machine Learning", isNew: true, category: "data" },
  { id: "ai-data-scientist", title: "AI and Data Scientist", category: "data" },
  { id: "bi-analyst", title: "BI Analyst", isNew: true, category: "data" },
  
  // Mobile & Platform
  { id: "android", title: "Android", category: "mobile" },
  { id: "ios", title: "iOS", category: "mobile" },
  
  // Design & UX
  { id: "ux-design", title: "UX Design", category: "design" },
  
  // Database & Infrastructure
  { id: "postgresql", title: "PostgreSQL", category: "development" },
  { id: "qa", title: "QA", category: "development" },
  { id: "software-architect", title: "Software Architect", category: "development" },
  { id: "mlops", title: "MLOps", category: "data" },
  
  // Security
  { id: "cyber-security", title: "Cyber Security", category: "security" },
  
  // Management
  { id: "product-manager", title: "Product Manager", category: "management" },
  { id: "engineering-manager", title: "Engineering Manager", category: "management" },
  { id: "technical-writer", title: "Technical Writer", category: "management" },
  { id: "developer-relations", title: "Developer Relations", category: "management" },
  
  // Specialized
  { id: "server-side-game-developer", title: "Server Side Game Developer", category: "development" }
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-[900] text-gray-900 mb-4">
            Lộ trình học
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-4xl">
            Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học. Ví dụ: Để đi làm với vị trí "Lập trình viên Front-end" bạn nên tập trung vào lộ trình "Front-end".
          </p>
        </motion.div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {roadmapData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Header with Image */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center p-8">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    {/* Placeholder for image */}
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {item.id === 'frontend' ? '🌐' : '🗄️'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                  {item.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.technologies.map((tech, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                      title={tech.name}
                    >
                      <span className="text-xs font-medium text-gray-600">
                        {tech.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Button */}
                <Link href={`/roadmap/${item.id}`}>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                    <span>{item.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Role Based Roadmaps Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Role Based Roadmaps
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Khám phá các lộ trình học được thiết kế đặc biệt cho từng vai trò công việc cụ thể trong ngành công nghệ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {roleBasedRoadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
                className="group relative"
              >
                <Link href={`/roadmap/${roadmap.id}`}>
                  <div className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                    ${roadmap.category === 'development' ? 'border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200' :
                      roadmap.category === 'data' ? 'border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200' :
                      roadmap.category === 'design' ? 'border-pink-200 hover:border-pink-400 bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200' :
                      roadmap.category === 'mobile' ? 'border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200' :
                      roadmap.category === 'security' ? 'border-red-200 hover:border-red-400 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200' :
                      'border-orange-200 hover:border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200'}
                    hover:shadow-lg hover:scale-105
                  `}>
                    {/* Bookmark Icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Bookmark className={`w-4 h-4 ${
                        roadmap.category === 'development' ? 'text-blue-500' :
                        roadmap.category === 'data' ? 'text-purple-500' :
                        roadmap.category === 'design' ? 'text-pink-500' :
                        roadmap.category === 'mobile' ? 'text-green-500' :
                        roadmap.category === 'security' ? 'text-red-500' :
                        'text-orange-500'
                      }`} />
                    </div>

                    {/* New Badge */}
                    {roadmap.isNew && (
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>New</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        roadmap.category === 'development' ? 'bg-blue-200' :
                        roadmap.category === 'data' ? 'bg-purple-200' :
                        roadmap.category === 'design' ? 'bg-pink-200' :
                        roadmap.category === 'mobile' ? 'bg-green-200' :
                        roadmap.category === 'security' ? 'bg-red-200' :
                        'bg-orange-200'
                      }`}>
                        <span className={`text-lg font-bold ${
                          roadmap.category === 'development' ? 'text-blue-600' :
                          roadmap.category === 'data' ? 'text-purple-600' :
                          roadmap.category === 'design' ? 'text-pink-600' :
                          roadmap.category === 'mobile' ? 'text-green-600' :
                          roadmap.category === 'security' ? 'text-red-600' :
                          'text-orange-600'
                        }`}>
                          {roadmap.title.charAt(0)}
                        </span>
                      </div>
                      
                      <h3 className={`font-semibold text-sm group-hover:font-bold transition-all duration-200 ${
                        roadmap.category === 'development' ? 'text-blue-900' :
                        roadmap.category === 'data' ? 'text-purple-900' :
                        roadmap.category === 'design' ? 'text-pink-900' :
                        roadmap.category === 'mobile' ? 'text-green-900' :
                        roadmap.category === 'security' ? 'text-red-900' :
                        'text-orange-900'
                      }`}>
                        {roadmap.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Category Legend */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Development</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Data & AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Mobile</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Design</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Management</span>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bạn chưa chắc chắn về lộ trình?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Đừng lo lắng! Hãy tham gia cộng đồng của chúng tôi để được tư vấn và hỗ trợ từ các mentor kinh nghiệm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200">
                Tham gia cộng đồng
              </button>
              <button className="px-6 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg transition-all duration-200">
                Tư vấn 1-1
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}