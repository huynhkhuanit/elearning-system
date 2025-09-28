"use client";

import { BookOpen, Code, Database, Globe, Smartphone, Brain, Trophy, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import Badge from "@/components/Badge";

interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  courses: string[];
  color: string;
}

const roadmapData: RoadmapItem[] = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Học lập trình giao diện người dùng với HTML, CSS, JavaScript và các framework hiện đại",
    icon: Globe,
    duration: "6-8 tháng",
    level: "Cơ bản",
    courses: ["HTML/CSS", "JavaScript", "React.js", "TypeScript"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Phát triển server-side với Node.js, database và API design",
    icon: Database,
    duration: "8-10 tháng",
    level: "Trung cấp",
    courses: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "API Design"],
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 3,
    title: "Mobile Developer",
    description: "Xây dựng ứng dụng di động với React Native hoặc Flutter",
    icon: Smartphone,
    duration: "7-9 tháng",
    level: "Trung cấp",
    courses: ["React Native", "Flutter", "Mobile UI/UX", "App Store Deploy"],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    title: "Data Science",
    description: "Phân tích dữ liệu và machine learning với Python",
    icon: Brain,
    duration: "10-12 tháng",
    level: "Nâng cao",
    courses: ["Python", "Pandas", "NumPy", "Machine Learning", "TensorFlow"],
    color: "from-orange-500 to-red-500"
  }
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Lộ trình <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">học tập</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chọn lộ trình phù hợp với mục tiêu nghề nghiệp của bạn
          </p>
        </motion.div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roadmapData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
            >
              <div className={`h-32 bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                <item.icon className="w-16 h-16 text-white" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <Badge variant="primary" size="sm">{item.level}</Badge>
                </div>
                
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{item.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{item.courses.length} khóa học</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Các khóa học:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.courses.map((course, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium">
                    Bắt đầu học ngay
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy lộ trình phù hợp?
          </h2>
          <p className="text-gray-600 mb-6">
            Liên hệ với chúng tôi để được tư vấn lộ trình học tập cá nhân hóa
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium">
            Tư vấn miễn phí
          </button>
        </motion.div>
      </div>
    </div>
  );
}