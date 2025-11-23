"use client";

import React, { useEffect, useRef } from 'react';
import { X, Download, Printer, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Certificate from './Certificate';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    studentName: string;
    courseName: string;
    completionDate: string;
    instructorName: string;
    courseDuration: string;
  };
}

export default function CertificateModal({ isOpen, onClose, data }: CertificateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti when modal opens
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        clearInterval(interval);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 print:p-0 print:block print:static">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm print:hidden"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:max-w-none print:max-h-none print:rounded-none print:overflow-visible"
          ref={modalRef}
        >
          {/* Header - Hidden on print */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 print:hidden">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chứng chỉ hoàn thành</h2>
              <p className="text-gray-500 text-sm">Chúc mừng bạn đã hoàn thành khóa học!</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30"
              >
                <Printer className="w-4 h-4" />
                <span>In / Tải PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-100 print:p-0 print:bg-white print:overflow-visible">
            <div className="print:landscape">
              <Certificate {...data} />
            </div>
          </div>

          {/* Footer - Hidden on print */}
          <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center print:hidden">
            <div className="text-sm text-gray-500">
              ID chứng chỉ: <span className="font-mono font-bold text-gray-700">DHV-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="flex gap-4">
              <button className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors">
                <Share2 className="w-4 h-4" />
                Chia sẻ lên Facebook
              </button>
              <button className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors">
                <Share2 className="w-4 h-4" />
                Chia sẻ lên LinkedIn
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
