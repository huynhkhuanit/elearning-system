'use client';

import { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Database,
  Zap,
  AlertCircle,
  CheckCircle,
  Save,
} from 'lucide-react';

export default function AdminSettings() {
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSave = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Cài Đặt Admin</h1>
        <p className="text-slate-400">Quản lý cấu hình và tùy chọn hệ thống</p>
      </div>

      {/* Success Message */}
      {settingsSaved && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-300 font-medium">Cài đặt đã được lưu thành công!</p>
        </div>
      )}

      {/* Notification Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Thông Báo</h2>
            <p className="text-sm text-slate-400 mt-1">Quản lý thông báo và cảnh báo hệ thống</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-indigo-500" />
            <span className="text-slate-300 group-hover:text-slate-100 transition">Nhận thông báo khi có bài học mới</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-indigo-500" />
            <span className="text-slate-300 group-hover:text-slate-100 transition">Nhận cảnh báo lỗi hệ thống</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-5 h-5 rounded accent-indigo-500" />
            <span className="text-slate-300 group-hover:text-slate-100 transition">Nhận báo cáo hàng ngày</span>
          </label>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Bảo Mật</h2>
            <p className="text-sm text-slate-400 mt-1">Quản lý các cài đặt bảo mật và quyền truy cập</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Yêu Cầu Xác Nhận 2FA</label>
            <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
              <option>Không bắt buộc</option>
              <option selected>Bắt buộc cho admin</option>
              <option>Bắt buộc cho tất cả</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-indigo-500" />
            <span className="text-slate-300 group-hover:text-slate-100 transition">Bật đăng nhập an toàn</span>
          </label>
        </div>
      </div>

      {/* Content Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-pink-500/20 rounded-lg">
            <Database className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Nội Dung</h2>
            <p className="text-sm text-slate-400 mt-1">Cấu hình các tùy chọn liên quan đến nội dung</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Markdown Renderer</label>
            <select className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
              <option selected>Mặc định (GitHub Flavored Markdown)</option>
              <option>CommonMark</option>
              <option>Tùy chỉnh</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-indigo-500" />
            <span className="text-slate-300 group-hover:text-slate-100 transition">Cho phép mã HTML trong markdown</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-indigo-500" />
            <span className="text-slate-300 group-hover:text-slate-100 transition">Tô sáng cú pháp mã nguồn</span>
          </label>
        </div>
      </div>

      {/* Performance Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Hiệu Suất</h2>
            <p className="text-sm text-slate-400 mt-1">Tối ưu hóa hiệu suất hệ thống</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Lưu Trữ Cache (Giây)</label>
            <input
              type="number"
              defaultValue="3600"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Kích Thước Tối Đa File Upload (MB)</label>
            <input
              type="number"
              defaultValue="50"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-indigo-500" />
            <span className="text-slate-300 group-hover:text-slate-100 transition">Nén hình ảnh tự động</span>
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-300 font-medium">Lưu Ý</p>
          <p className="text-sm text-amber-200 mt-1">
            Các thay đổi cài đặt sẽ ảnh hưởng đến toàn bộ hệ thống. Hãy cẩn thận khi thay đổi.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Cài Đặt</span>
        </button>
        <button className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition font-medium">
          Hủy
        </button>
      </div>
    </div>
  );
}
