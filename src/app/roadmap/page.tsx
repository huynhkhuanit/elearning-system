"use client";

import { ArrowRight, CheckCircle, Star, Bookmark, Code, Server, Users, Clock, TrendingUp, Award, Smartphone, Database, Shield, BarChart3, Palette, Briefcase, Layers, Cloud, Gamepad2, Brain, Monitor, Zap, Info } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/Modal";
import PageContainer from "@/components/PageContainer";

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
  icon: any;
  description?: string;
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
  },
  {
    id: "cpp",
    title: "Lộ trình học C++",
    subtitle: "C++ Programming Path",
    description: "C++ là ngôn ngữ lập trình mạnh mẽ, được sử dụng rộng rãi trong phát triển phần mềm hệ thống, game và các ứng dụng hiệu suất cao.",
    image: "/images/cpp-roadmap.png",
    technologies: [
      { name: "C++", icon: "/icons/cpp.svg" },
      { name: "OOP", icon: "/icons/oop.svg" },
      { name: "STL", icon: "/icons/stl.svg" },
      { name: "Algorithms", icon: "/icons/algorithms.svg" },
      { name: "Data Structures", icon: "/icons/data.svg" },
      { name: "Memory", icon: "/icons/memory.svg" }
    ],
    buttonText: "XEM CHI TIẾT"
  },
  {
    id: "data-structures",
    title: "Cấu trúc dữ liệu",
    subtitle: "Data Structures & Algorithms",
    description: "Học các cấu trúc dữ liệu cơ bản và nâng cao, thuật toán quan trọng để giải quyết các bài toán lập trình phức tạp một cách hiệu quả.",
    image: "/images/dsa-roadmap.png",
    technologies: [
      { name: "Array", icon: "/icons/array.svg" },
      { name: "LinkedList", icon: "/icons/linkedlist.svg" },
      { name: "Stack", icon: "/icons/stack.svg" },
      { name: "Queue", icon: "/icons/queue.svg" },
      { name: "Tree", icon: "/icons/tree.svg" },
      { name: "Graph", icon: "/icons/graph.svg" },
      { name: "Sorting", icon: "/icons/sort.svg" }
    ],
    buttonText: "XEM CHI TIẾT"
  }
];

const roleBasedRoadmaps: RoleBasedRoadmap[] = [
  // Development
  { id: "frontend", title: "Frontend", category: "development", icon: Code, description: "Xây dựng giao diện web hiện đại" },
  { id: "backend", title: "Backend", category: "development", icon: Server, description: "Phát triển server và API" },
  { id: "fullstack", title: "Full Stack", category: "development", icon: Layers, description: "Kết hợp frontend và backend" },
  { id: "devops", title: "DevOps", category: "development", icon: Cloud, description: "Triển khai và vận hành hệ thống" },
  { id: "blockchain", title: "Blockchain", category: "development", icon: Zap, description: "Công nghệ blockchain và crypto" },
  { id: "game-developer", title: "Game Developer", category: "development", icon: Gamepad2, description: "Phát triển game và ứng dụng giải trí" },
  
  // Data & AI
  { id: "data-analyst", title: "Data Analyst", category: "data", icon: BarChart3, description: "Phân tích và trực quan hóa dữ liệu" },
  { id: "data-engineer", title: "Data Engineer", category: "data", icon: Database, description: "Xây dựng pipeline dữ liệu" },
  { id: "ai-engineer", title: "AI Engineer", category: "data", icon: Brain, description: "Phát triển ứng dụng AI" },
  { id: "machine-learning", title: "Machine Learning", isNew: true, category: "data", icon: Brain, description: "Học máy và deep learning" },
  { id: "ai-data-scientist", title: "AI and Data Scientist", category: "data", icon: Brain, description: "Khoa học dữ liệu và AI" },
  { id: "bi-analyst", title: "BI Analyst", isNew: true, category: "data", icon: BarChart3, description: "Business Intelligence" },
  
  // Mobile & Platform
  { id: "android", title: "Android", category: "mobile", icon: Smartphone, description: "Phát triển ứng dụng Android" },
  { id: "ios", title: "iOS", category: "mobile", icon: Smartphone, description: "Phát triển ứng dụng iOS" },
  
  // Design & UX
  { id: "ux-design", title: "UX Design", category: "design", icon: Palette, description: "Thiết kế trải nghiệm người dùng" },
  
  // Database & Infrastructure
  { id: "postgresql", title: "PostgreSQL", category: "development", icon: Database, description: "Quản trị cơ sở dữ liệu" },
  { id: "qa", title: "QA", category: "development", icon: CheckCircle, description: "Đảm bảo chất lượng phần mềm" },
  { id: "software-architect", title: "Software Architect", category: "development", icon: Layers, description: "Thiết kế kiến trúc hệ thống" },
  { id: "mlops", title: "MLOps", category: "data", icon: Cloud, description: "Vận hành mô hình machine learning" },
  
  // Security
  { id: "cyber-security", title: "Cyber Security", category: "security", icon: Shield, description: "Bảo mật thông tin và hệ thống" },
  
  // Management
  { id: "product-manager", title: "Product Manager", category: "management", icon: Briefcase, description: "Quản lý sản phẩm" },
  { id: "engineering-manager", title: "Engineering Manager", category: "management", icon: Users, description: "Quản lý đội ngũ kỹ thuật" },
  { id: "technical-writer", title: "Technical Writer", category: "management", icon: Monitor, description: "Viết tài liệu kỹ thuật" },
  { id: "developer-relations", title: "Developer Relations", category: "management", icon: Users, description: "Quan hệ cộng đồng developer" },
  
  // Specialized
  { id: "server-side-game-developer", title: "Server Side Game Developer", category: "development", icon: Gamepad2, description: "Phát triển server game" }
];

export default function RoadmapPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoleBasedRoadmap | null>(null);

  // Available roadmaps (có trang chi tiết)
  const availableRoadmaps = ['frontend', 'backend', 'fullstack', 'mobile', 'devops'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'text-blue-500';
      case 'data': return 'text-purple-500';
      case 'design': return 'text-pink-500';
      case 'mobile': return 'text-green-500';
      case 'security': return 'text-red-500';
      default: return 'text-orange-500';
    }
  };

  const handleRoadmapClick = (roadmap: RoleBasedRoadmap, viewType: 'detail' | 'flow' = 'detail') => {
    if (availableRoadmaps.includes(roadmap.id)) {
      // Chuyển hướng đến trang chi tiết hoặc flow
      const path = viewType === 'flow' ? `/roadmap/${roadmap.id}/flow` : `/roadmap/${roadmap.id}`;
      window.location.href = path;
    } else {
      // Hiển thị modal cho roadmap đang phát triển
      setSelectedRoadmap(roadmap);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageContainer size="lg" className="py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-[900] text-gray-900 mb-4">
            Lộ trình học
          </h1>
          <p className="text-gray-600 leading-relaxed max-w-4xl">
            Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học. Ví dụ: Để đi làm với vị trí "Lập trình viên Front-end" bạn nên tập trung vào lộ trình "Front-end".
          </p>
        </motion.div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 justify-items-center">
          {roadmapData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full max-w-[500px] bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Header with Icon */}
              <div className="relative h-28 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-orange-500 flex items-center justify-center shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    {item.id === 'frontend' ? (
                      <Code className="w-6 h-6 text-white" />
                    ) : item.id === 'backend' ? (
                      <Server className="w-6 h-6 text-white" />
                    ) : item.id === 'cpp' ? (
                      <span className="text-white font-bold text-xs">C++</span>
                    ) : (
                      <Database className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="main-roadmap-card-title text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="main-roadmap-card-desc text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Technologies Icons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.technologies.slice(0, 7).map((tech, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200"
                      title={tech.name}
                    >
                      <span className="text-xs font-medium text-gray-600">
                        {tech.name === 'HTML' ? 'H' :
                         tech.name === 'CSS' ? 'C' :
                         tech.name === 'JavaScript' ? 'JS' :
                         tech.name === 'React' ? 'R' :
                         tech.name === 'Node.js' ? 'N' :
                         tech.name === 'PHP' ? 'P' :
                         tech.name === 'MySQL' ? 'M' :
                         tech.name === 'C++' ? 'C++' :
                         tech.name === 'Array' ? 'Ar' :
                         tech.name === 'Tree' ? 'Tr' :
                         tech.name.substring(0, 2).toUpperCase()
                        }
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Button */}
                <div className="flex space-x-2">
                  <Link href={`/roadmap/${item.id}`}>
                    <button className="min-w-[148px] bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-200 text-sm">
                      {item.buttonText}
                    </button>
                  </Link>
                  <Link href={`/roadmap/${item.id}/flow`}>
                    <button className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full transition-all duration-200 text-sm flex items-center justify-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span className="hidden sm:inline">Sơ đồ</span>
                    </button>
                  </Link>
                </div>
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
            <h2 className="font-[900] text-gray-900 mb-4">
              Role Based <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Roadmaps</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Khám phá các lộ trình học được thiết kế đặc biệt cho từng vai trò công việc cụ thể trong ngành công nghệ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {roleBasedRoadmaps.map((roadmap, index) => {
              const IconComponent = roadmap.icon;
              const isAvailable = availableRoadmaps.includes(roadmap.id);
              
              return (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  className="group relative"
                >
                  <div 
                    onClick={() => handleRoadmapClick(roadmap)}
                    className={`
                      relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer bg-white h-32
                      ${roadmap.category === 'development' ? 'border-blue-100 hover:border-blue-300 hover:bg-blue-50' :
                        roadmap.category === 'data' ? 'border-purple-100 hover:border-purple-300 hover:bg-purple-50' :
                        roadmap.category === 'design' ? 'border-pink-100 hover:border-pink-300 hover:bg-pink-50' :
                        roadmap.category === 'mobile' ? 'border-green-100 hover:border-green-300 hover:bg-green-50' :
                        roadmap.category === 'security' ? 'border-red-100 hover:border-red-300 hover:bg-red-50' :
                        'border-orange-100 hover:border-orange-300 hover:bg-orange-50'}
                      hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1
                      ${!isAvailable ? 'opacity-75' : ''}
                    `}
                  >
                    {/* Bookmark Icon */}
                    <div className="absolute top-3 right-3 flex space-x-1">
                      {isAvailable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoadmapClick(roadmap, 'flow');
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg"
                          title="Xem sơ đồ lộ trình"
                        >
                          <Zap className="w-3 h-3" />
                        </button>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isAvailable ? (
                          <Bookmark className={`w-4 h-4 ${getCategoryColor(roadmap.category)}`} />
                        ) : (
                          <Info className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* New Badge */}
                    {roadmap.isNew && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        <span>New</span>
                      </div>
                    )}

                    {/* Coming Soon Badge */}
                    {!isAvailable && (
                      <div className="absolute -top-2 -left-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        <span>Coming Soon</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="text-center h-full flex flex-col justify-center items-center px-2">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className={`w-12 h-12 mb-3 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          roadmap.category === 'development' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          roadmap.category === 'data' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                          roadmap.category === 'design' ? 'bg-gradient-to-br from-pink-500 to-pink-600' :
                          roadmap.category === 'mobile' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          roadmap.category === 'security' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                          'bg-gradient-to-br from-orange-500 to-orange-600'
                        } shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.div>
                      
                      <h3 className={`roadmap-card-title w-full px-1 ${
                        roadmap.category === 'development' ? 'text-blue-900' :
                        roadmap.category === 'data' ? 'text-purple-900' :
                        roadmap.category === 'design' ? 'text-pink-900' :
                        roadmap.category === 'mobile' ? 'text-green-900' :
                        roadmap.category === 'security' ? 'text-red-900' :
                        'text-orange-900'
                      }`} title={roadmap.title}>
                        {roadmap.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
          className="mt-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-10 border border-indigo-100 shadow-xl"
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="font-bold text-gray-900 mb-4">
              Bạn chưa chắc chắn về lộ trình?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Đừng lo lắng! Hãy tham gia cộng đồng của chúng tôi để được tư vấn và hỗ trợ từ các mentor kinh nghiệm trong ngành.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <Users className="w-5 h-5" />
                <span>Tham gia cộng đồng</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group px-8 py-4 border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2">
                <Monitor className="w-5 h-5" />
                <span>Tư vấn 1-1</span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-indigo-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
                <div className="text-gray-600">Học viên tham gia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Mentor chuyên nghiệp</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">95%</div>
                <div className="text-gray-600">Tỷ lệ có việc làm</div>
              </div>
            </div>
          </div>
        </motion.div>
      </PageContainer>

      {/* Modal for Coming Soon Roadmaps */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lộ trình đang phát triển"
        size="md"
        headerIcon={
          selectedRoadmap && (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              selectedRoadmap.category === 'development' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
              selectedRoadmap.category === 'data' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
              selectedRoadmap.category === 'design' ? 'bg-gradient-to-br from-pink-500 to-pink-600' :
              selectedRoadmap.category === 'mobile' ? 'bg-gradient-to-br from-green-500 to-green-600' :
              selectedRoadmap.category === 'security' ? 'bg-gradient-to-br from-red-500 to-red-600' :
              'bg-gradient-to-br from-orange-500 to-orange-600'
            } shadow-lg`}>
              <selectedRoadmap.icon className="w-6 h-6 text-white" />
            </div>
          )
        }
      >
        {selectedRoadmap && (
          <div className="text-center py-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedRoadmap.title}
            </h3>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-amber-800 mb-2">
                Đang trong quá trình phát triển
              </h4>
              <p className="text-amber-700 text-sm leading-relaxed">
                {selectedRoadmap.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h5 className="font-semibold text-gray-700 mb-2">Những gì bạn có thể làm:</h5>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Khám phá các lộ trình khác đang có sẵn</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Đăng ký nhận thông báo khi lộ trình ra mắt</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Tham gia cộng đồng để thảo luận</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Đăng ký thông báo</span>
                <Star className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}