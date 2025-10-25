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
    <footer className="bg-gray-900 text-white relative z-[3000]">
      {/* ✅ Footer z-[3000]: Menu (9999) > Modal (5000) > Footer (3000) > Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center justify-center transition-all duration-200 cursor-pointer">
                <img
                  src="/assets/img/logo.png" 
                  alt="DHV LearnX Logo" 
                  width={38}
                  height={38}
                  style={{ objectFit: 'contain' }}
                  className="w-[38px] h-[38px] rounded-lg"
                />
              </Link>
              <div>
                <Link href="/" className="text-2xl font-[900]">LearnX</Link>
                <p className="text-gray-400 text-small">Nền tảng học lập trình trực tuyến</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Nền tảng học lập trình hàng đầu Việt Nam.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-3.5 h-3.5" />
                <span>huynhkhuanit@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="w-3.5 h-3.5" />
                <span>1900-xxxx</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>Hồ Chí Minh, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-base mb-4">Lộ trình học</h4>
            <ul className="space-y-2">
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
            <h4 className="font-semibold text-base mb-4">Tài nguyên</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-base mb-4">Cộng đồng</h4>
            <ul className="space-y-2 mb-4">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-xs mb-3 md:mb-0">
            © 2026 DHV LearnX. All rights reserved.
          </div>
          
          <div className="flex space-x-4 text-xs">
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