"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserCircle, Eye, EyeOff, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Modal from "./Modal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { register, isLoading } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    full_name: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      toast.error("Mật khẩu phải chứa chữ hoa, chữ thường và số");
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
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      
      // Reset form and switch to login after 1.5 seconds
      setTimeout(() => {
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          username: "",
          full_name: "",
        });
        setSuccess(false);
        onClose();
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchToLogin = () => {
    onClose();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={true}
      closeOnBackdropClick={true}
    >
      <div className="space-y-6">
        {/* Header with Icon and Title */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <UserCircle className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tạo tài khoản mới</h2>
          <p className="text-gray-600 text-sm">
            Điền thông tin bên dưới để bắt đầu học tập
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Username - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold text-gray-900 mb-2">
                Họ và tên
              </label>
              <div className="relative group">
                <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                  placeholder="nguyen_van_a"
                />
              </div>
            </div>
          </div>

          {/* Email Field - Full width */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Password & Confirm Password - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Requirements
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-indigo-800">
                <p className="font-semibold mb-1">Yêu cầu mật khẩu:</p>
                <ul className="space-y-0.5 text-indigo-700">
                  <li>• Tối thiểu 6 ký tự</li>
                  <li>• Có chữ hoa và chữ thường</li>
                  <li>• Có ít nhất 1 chữ số</li>
                </ul>
              </div>
            </div>
          </div> */}

          {/* Terms & Conditions */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-4 h-4 text-indigo-600 bg-white border-2 border-gray-300 rounded transition-colors cursor-pointer mt-0.5 flex-shrink-0"
            />
            <label htmlFor="terms" className="text-xs text-gray-700 leading-relaxed cursor-pointer select-none">
              Tôi đồng ý với{" "}
              <button type="button" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                Điều khoản dịch vụ
              </button>{" "}
              và{" "}
              <button type="button" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                Chính sách bảo mật
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Đăng ký thành công</span>
              </>
            ) : (
              <>
                <span>Tạo tài khoản</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">hoặc</span>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm">
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={handleSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all"
          >
            Đăng nhập ngay
          </button>
        </p>
      </div>
    </Modal>
  );
}
