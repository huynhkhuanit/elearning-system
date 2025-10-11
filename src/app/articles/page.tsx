"use client";

import { Calendar, User, Eye, MessageCircle, BookOpen, Clock, Search, Filter, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Badge from "@/components/Badge";
import PageContainer from "@/components/PageContainer";
import { useState } from "react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  views: number;
  comments: number;
  category: string;
  tags: string[];
  featured?: boolean;
}

const articlesData: Article[] = [
  {
    id: 1,
    title: "JavaScript ES6+ - Những tính năng mới bạn cần biết",
    excerpt: "Khám phá các tính năng mới nhất của JavaScript ES6+ và cách áp dụng chúng vào dự án thực tế. Từ arrow functions đến async/await, destructuring và nhiều hơn nữa...",
    author: "Nguyễn Văn A",
    publishDate: "15/01/2024",
    readTime: "8 phút",
    views: 1250,
    comments: 24,
    category: "JavaScript",
    tags: ["ES6", "JavaScript", "Frontend"],
    featured: true
  },
  {
    id: 2,
    title: "Hướng dẫn xây dựng REST API với Node.js và Express",
    excerpt: "Học cách tạo một REST API hoàn chỉnh từ đầu với Node.js, Express và MongoDB. Bài viết sẽ hướng dẫn từng bước chi tiết để bạn có thể tự xây dựng API của riêng mình...",
    author: "Trần Thị B",
    publishDate: "12/01/2024",
    readTime: "12 phút",
    views: 890,
    comments: 18,
    category: "Backend",
    tags: ["Node.js", "API", "Backend"]
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox - Khi nào sử dụng cái nào?",
    excerpt: "So sánh chi tiết giữa CSS Grid và Flexbox, kèm theo các ví dụ thực tế để giúp bạn quyết định khi nào nên sử dụng layout system nào...",
    author: "Lê Văn C",
    publishDate: "10/01/2024",
    readTime: "6 phút",
    views: 675,
    comments: 12,
    category: "CSS",
    tags: ["CSS", "Layout", "Frontend"]
  },
  {
    id: 4,
    title: "React Hooks - Từ cơ bản đến nâng cao",
    excerpt: "Tìm hiểu về React Hooks và cách sử dụng chúng để viết code React hiệu quả hơn. Từ useState, useEffect đến custom hooks...",
    author: "Phạm Thị D",
    publishDate: "08/01/2024",
    readTime: "15 phút",
    views: 1420,
    comments: 31,
    category: "React",
    tags: ["React", "Hooks", "Frontend"],
    featured: true
  },
  {
    id: 5,
    title: "TypeScript cho người mới bắt đầu",
    excerpt: "Giới thiệu TypeScript và lý do tại sao bạn nên sử dụng nó trong các dự án JavaScript. Hướng dẫn cài đặt và sử dụng cơ bản...",
    author: "Hoàng Minh E",
    publishDate: "05/01/2024",
    readTime: "10 phút",
    views: 980,
    comments: 15,
    category: "TypeScript",
    tags: ["TypeScript", "JavaScript", "Frontend"]
  },
  {
    id: 6,
    title: "MongoDB cơ bản - Làm việc với NoSQL Database",
    excerpt: "Học cách làm việc với MongoDB, một trong những NoSQL database phổ biến nhất. Từ cài đặt, CRUD operations đến indexing...",
    author: "Vũ Thị F",
    publishDate: "03/01/2024",
    readTime: "14 phút",
    views: 756,
    comments: 22,
    category: "Database",
    tags: ["MongoDB", "Database", "NoSQL"]
  }
];

const categories = ["Tất cả", "JavaScript", "React", "Backend", "CSS", "TypeScript", "Database"];

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredArticles = articlesData.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

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
            Bài viết <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">lập trình</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Chia sẻ kiến thức và kinh nghiệm lập trình từ cộng đồng developer
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-full bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-indigo-500 text-white"
                      : "bg-card text-muted-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-16">
            <h2 className="font-[900] text-foreground mb-8">Bài viết nổi bật</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="featured" size="sm">⭐ Nổi bật</Badge>
                      <Badge variant="secondary" size="sm">{article.category}</Badge>
                    </div>
                    
                    <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-small text-muted-foreground mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{article.publishDate}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        {regularArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="font-[900] text-foreground mb-8">
              {featuredArticles.length > 0 ? "Bài viết khác" : "Tất cả bài viết"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {regularArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  <div className="h-32 bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" size="sm">{article.category}</Badge>
                    </div>
                    
                    <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-3 line-clamp-2 text-small">{article.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-small text-muted-foreground mb-3">
                      <div className="flex items-center space-x-2">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{article.publishDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 2 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{article.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredArticles.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-indigo-500 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-all duration-200">
              Xem thêm bài viết
            </button>
          </div>
        )}
      </PageContainer>
    </div>
  );
}