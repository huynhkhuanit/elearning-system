import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Liên hệ với chúng tôi</h1>
          <p className="text-xl text-gray-600">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại tin nhắn cho chúng tôi.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">huynhkhuanit@gmail.com</p>
                    <p className="text-gray-600">support@dhvlearnx.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Điện thoại</h4>
                    <p className="text-gray-600">1900-xxxx</p>
                    <p className="text-gray-600">(+84) 909 123 456</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Địa chỉ</h4>
                    <p className="text-gray-600">
                      Tòa nhà DHV, Quận 1<br />
                      TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Bạn cần hỗ trợ gì?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                  <textarea 
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                    placeholder="Nhập nội dung tin nhắn..."
                  ></textarea>
                </div>

                <button 
                  type="button"
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Gửi tin nhắn</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
