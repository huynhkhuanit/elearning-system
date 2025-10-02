"use client";

import { useToast } from "@/contexts/ToastContext";
import PageContainer from "@/components/PageContainer";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export default function ToastDemoPage() {
  const toast = useToast();

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: '#ffffff' }}>
      <PageContainer size="md">
        <div className="text-center mb-12">
          <h1 className="font-[900] text-gray-900 mb-4">
            Toast Notification Demo
          </h1>
          <p className="text-gray-600">
            Test các loại thông báo toast với icons và màu sắc khác nhau
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Success Toast */}
          <button
            onClick={() => toast.success("Thao tác của bạn đã được thực hiện thành công!")}
            className="group p-8 bg-green-50 border-2 border-green-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Success Toast</h3>
            </div>
            <p className="text-sm text-green-700 text-left">
              Hiển thị khi thao tác thành công: đăng nhập, đăng ký, cập nhật, v.v.
            </p>
          </button>

          {/* Error Toast */}
          <button
            onClick={() => toast.error("Không thể thực hiện thao tác. Vui lòng thử lại sau.")}
            className="group p-8 bg-red-50 border-2 border-red-200 rounded-2xl hover:border-red-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-red-900">Error Toast</h3>
            </div>
            <p className="text-sm text-red-700 text-left">
              Hiển thị khi có lỗi: đăng nhập thất bại, validation error, server error.
            </p>
          </button>

          {/* Warning Toast */}
          <button
            onClick={() => toast.warning("Hành động này có thể ảnh hưởng đến dữ liệu của bạn.")}
            className="group p-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl hover:border-yellow-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-yellow-900">Warning Toast</h3>
            </div>
            <p className="text-sm text-yellow-700 text-left">
              Cảnh báo người dùng về hành động có thể gây rủi ro hoặc cần xác nhận.
            </p>
          </button>

          {/* Info Toast */}
          <button
            onClick={() => toast.info("Đây là một thông báo mang tính thông tin cho bạn biết.")}
            className="group p-8 bg-blue-50 border-2 border-blue-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">Info Toast</h3>
            </div>
            <p className="text-sm text-blue-700 text-left">
              Cung cấp thông tin hữu ích, tips, hoặc cập nhật cho người dùng.
            </p>
          </button>
        </div>

        {/* Custom Duration */}
        <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">Custom Duration</h3>
          <p className="text-sm text-indigo-700 mb-6">
            Bạn có thể tùy chỉnh thời gian hiển thị của toast (mặc định: 5 giây)
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toast.success("Toast 2 giây!", 2000)}
              className="px-6 py-3 bg-white border-2 border-indigo-200 rounded-lg hover:border-indigo-500 transition-all duration-200 text-sm font-medium text-indigo-900"
            >
              2 giây
            </button>
            <button
              onClick={() => toast.info("Toast 3 giây (default)", 3000)}
              className="px-6 py-3 bg-white border-2 border-indigo-200 rounded-lg hover:border-indigo-500 transition-all duration-200 text-sm font-medium text-indigo-900"
            >
              3 giây
            </button>
            <button
              onClick={() => toast.warning("Toast 5 giây - Thời gian dài hơn", 5000)}
              className="px-6 py-3 bg-white border-2 border-indigo-200 rounded-lg hover:border-indigo-500 transition-all duration-200 text-sm font-medium text-indigo-900"
            >
              5 giây
            </button>
          </div>
        </div>

        {/* Multiple Toasts */}
        <div className="mt-8 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <h3 className="text-xl font-bold text-purple-900 mb-4">Multiple Toasts</h3>
          <p className="text-sm text-purple-700 mb-6">
            Hiển thị nhiều toast cùng lúc - chúng sẽ xếp chồng lên nhau
          </p>
          <button
            onClick={() => {
              toast.success("Đây là toast thứ nhất");
              setTimeout(() => toast.info("Đây là toast thứ hai"), 500);
              setTimeout(() => toast.warning("Đây là toast thứ ba"), 1000);
            }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Show Multiple Toasts
          </button>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Quay về trang chủ
          </a>
        </div>
      </PageContainer>
    </div>
  );
}
