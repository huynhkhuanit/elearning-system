"use client";

import { Mail, Phone, MapPin, Facebook, Twitter, Youtube, Github } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  courses: [
    { name: "Frontend Developer", href: "/roadmap" },
    { name: "Backend Developer", href: "/roadmap" },
    { name: "Mobile Developer", href: "/roadmap" },
    { name: "Data Science", href: "/roadmap" },
  ],
  resources: [
    { name: "Bài viết", href: "/articles" },
    { name: "Hỏi đáp", href: "/qa" },
    { name: "Tài liệu", href: "#" },
    { name: "Blog", href: "#" },
  ],
  community: [
    { name: "Discord", href: "#" },
    { name: "Facebook Group", href: "#" },
    { name: "Telegram", href: "#" },
    { name: "Youtube", href: "#" },
  ]
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
  { icon: Github, href: "#", label: "Github" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">DHV</span>
              </div>
              <div>
                <h3 className="text-xl font-[900]">LearnX</h3>
                <p className="text-gray-400 text-sm">Nền tảng học lập trình trực tuyến</p>
              </div>
            </div>
            
            <p className="text-gray-400 leading-relaxed">
              Nền tảng học lập trình trực tuyến hàng đầu Việt Nam, 
              giúp bạn trở thành developer chuyên nghiệp.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>contact@dhvlearnx.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>1900-xxxx</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Lộ trình học</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Tài nguyên</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Cộng đồng</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 DHV LearnX. All rights reserved.
          </div>
          
          <div className="flex space-x-6 text-sm">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}