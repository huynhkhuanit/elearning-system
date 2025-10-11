"use client";

import { MessageCircle, User, Calendar, ThumbsUp, Eye, Search, Plus, Filter, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Badge from "@/components/Badge";
import PageContainer from "@/components/PageContainer";
import { useState } from "react";

interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  views: number;
  likes: number;
  answers: number;
  tags: string[];
  status: "open" | "answered" | "closed";
}

const questionsData: Question[] = [
  {
    id: 1,
    title: "Làm thế nào để tối ưu hiệu suất React app?",
    content: "Tôi có một React app khá lớn và đang gặp vấn đề về hiệu suất. App load chậm và có lag khi user tương tác. Có những cách nào để tối ưu không? Tôi đã thử React.memo nhưng vẫn chưa cải thiện được nhiều.",
    author: "developer123",
    publishDate: "2 giờ trước",
    views: 45,
    likes: 12,
    answers: 3,
    tags: ["React", "Performance", "Optimization"],
    status: "answered"
  },
  {
    id: 2,
    title: "Sự khác biệt giữa var, let và const trong JavaScript?",
    content: "Mình mới học JS và chưa hiểu rõ sự khác biệt giữa 3 cách khai báo biến này. Khi nào thì dùng var, let hay const? Có thể giải thích kèm ví dụ được không?",
    author: "newbie_coder",
    publishDate: "5 giờ trước",
    views: 128,
    likes: 8,
    answers: 5,
    tags: ["JavaScript", "Variables", "ES6"],
    status: "answered"
  },
  {
    id: 3,
    title: "Cách kết nối MongoDB với Node.js như thế nào?",
    content: "Tôi đang học backend và muốn kết nối MongoDB với Node.js app. Có hướng dẫn chi tiết nào không? Tôi đã cài đặt MongoDB và mongoose rồi nhưng vẫn gặp lỗi khi connect.",
    author: "backend_learner",
    publishDate: "1 ngày trước",
    views: 89,
    likes: 15,
    answers: 2,
    tags: ["Node.js", "MongoDB", "Database"],
    status: "open"
  },
  {
    id: 4,
    title: "CSS Grid hay Flexbox cho responsive design?",
    content: "Mình đang phân vân nên sử dụng CSS Grid hay Flexbox cho layout responsive. Dự án hiện tại cần responsive từ mobile đến desktop, khi nào thì nên dùng cái nào?",
    author: "ui_designer",
    publishDate: "2 ngày trước",
    views: 67,
    likes: 6,
    answers: 4,
    tags: ["CSS", "Grid", "Flexbox", "Responsive"],
    status: "answered"
  },
  {
    id: 5,
    title: "TypeScript có cần thiết cho dự án nhỏ không?",
    content: "Mình đang làm một dự án web nhỏ với vanilla JavaScript. Có nên migrate sang TypeScript không? Lợi ích thực sự của TypeScript so với JavaScript là gì?",
    author: "js_enthusiast",
    publishDate: "3 ngày trước",
    views: 156,
    likes: 11,
    answers: 7,
    tags: ["TypeScript", "JavaScript", "Best Practices"],
    status: "answered"
  },
  {
    id: 6,
    title: "Cách deploy ứng dụng Next.js lên Vercel?",
    content: "Mình vừa hoàn thành project Next.js đầu tiên và muốn deploy lên Vercel. Có ai hướng dẫn step by step được không? Có cần config gì đặc biệt không?",
    author: "nextjs_newbie",
    publishDate: "1 tuần trước",
    views: 203,
    likes: 9,
    answers: 1,
    tags: ["Next.js", "Deployment", "Vercel"],
    status: "open"
  }
];

const statusOptions = ["Tất cả", "Đang mở", "Đã trả lời", "Đã đóng"];
const sortOptions = ["Mới nhất", "Cũ nhất", "Nhiều lượt xem", "Nhiều like"];

export default function QAPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("Mới nhất");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-100 text-green-800";
      case "open":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "answered":
        return "Đã trả lời";
      case "open":
        return "Đang mở";
      case "closed":
        return "Đã đóng";
      default:
        return "Không xác định";
    }
  };

  const filteredQuestions = questionsData.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "Tất cả" || 
                         (selectedStatus === "Đang mở" && question.status === "open") ||
                         (selectedStatus === "Đã trả lời" && question.status === "answered") ||
                         (selectedStatus === "Đã đóng" && question.status === "closed");
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageContainer size="lg" className="py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-[900] text-foreground mb-4">
            Hỏi đáp <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">lập trình</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Đặt câu hỏi và nhận được câu trả lời từ cộng đồng developer
          </p>
          
          {/* Search and Actions */}
          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-full bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Đặt câu hỏi</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedStatus === status
                      ? "bg-indigo-500 text-white"
                      : "bg-card text-muted-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-border rounded-lg bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                        {getStatusText(question.status)}
                      </span>
                      <div className="flex items-center space-x-2 flex-wrap">
                        {question.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" size="sm">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-foreground mb-3 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {question.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {question.content}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-small text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{question.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{question.publishDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{question.views} lượt xem</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-medium">{question.likes}</span>
                      <span className="text-sm">likes</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">{question.answers}</span>
                      <span className="text-sm">câu trả lời</span>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg">
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy câu hỏi</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn</p>
          </div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">1,234</div>
              <div className="text-gray-600">Câu hỏi</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">956</div>
              <div className="text-gray-600">Câu trả lời</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">2,890</div>
              <div className="text-gray-600">Thành viên</div>
            </div>
          </div>
        </motion.div>

        {/* Load More Button */}
        {filteredQuestions.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-indigo-500 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-all duration-200">
              Xem thêm câu hỏi
            </button>
          </div>
        )}
      </PageContainer>
    </div>
  );
}