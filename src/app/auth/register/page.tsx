"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserCircle, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PageContainer from "@/components/PageContainer";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    full_name: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError("Mật khẩu phải chứa chữ hoa, chữ thường và số");
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        full_name: formData.full_name,
      });
      
      setSuccess(true);
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#ffffff' }}>
      <PageContainer size="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-[900] text-gray-900 mb-2">
              Đăng ký tài khoản
            </h1>
            <p className="text-gray-600">
              Tạo tài khoản để bắt đầu hành trình học tập
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Đăng ký thành công!</p>
                  <p className="text-xs text-green-700 mt-1">Đang chuyển đến trang đăng nhập...</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder="nguyen_van_a"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Chỉ chứa chữ, số và dấu gạch dưới</p>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Tối thiểu 6 ký tự, có chữ hoa, chữ thường và số</p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Đăng ký thành công
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Đăng ký
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">hoặc</span>
              </div>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href="/auth/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Quay về trang chủ
            </Link>
          </div>
        </motion.div>
      </PageContainer>
    </div>
  );
}
