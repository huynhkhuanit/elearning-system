import { Search, X } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <a href="/" className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer">
            <span className="text-white font-bold text-xl">DHV</span>
          </a>
          <div className="hidden sm:block">
            <a href="/" className="text-2xl font-bold text-gray-900 transition-colors duration-200">
              LearnX
            </a>
            <p className="text-xs text-gray-500">Nền tảng học lập trình trực tuyến</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học, bài viết, video..."
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full bg-white text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
              <X className="h-5 w-5" />
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Mobile search button */}
          <a href="/" className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
            <Search className="h-5 w-5" />
          </a>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <a href="/" className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-all duration-200 rounded-full cursor-pointer">
              Đăng ký
            </a>

            <a href="/" className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg cursor-pointer">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </header>
  );
} 
