"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { ToastType } from '@/contexts/ToastContext';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    titleColor: 'text-gray-900',
    messageColor: 'text-gray-600',
    progressColor: 'bg-green-500',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-600',
    titleColor: 'text-gray-900',
    messageColor: 'text-gray-600',
    progressColor: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    titleColor: 'text-gray-900',
    messageColor: 'text-gray-600',
    progressColor: 'bg-yellow-500',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    titleColor: 'text-gray-900',
    messageColor: 'text-gray-600',
    progressColor: 'bg-blue-500',
  },
};

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [progress, setProgress] = useState(100);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-auto"
    >
      <div className="relative w-[340px] bg-white rounded-lg shadow-lg border border-gray-200/80 overflow-hidden backdrop-blur-sm">
        {/* Content */}
        <div className="px-3 py-2.5 pr-7">
          <div className="flex items-center gap-2">
            {/* Icon - Simple, no background */}
            <Icon className={`w-4 h-4 flex-shrink-0 ${config.iconColor}`} strokeWidth={2.5} />

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className={`font-medium text-[13px] leading-tight ${config.titleColor}`}>
                  {title}
                </span>
                {message && (
                  <span className={`text-[12px] leading-tight ${config.messageColor}`}>
                    {message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-3 h-3" strokeWidth={2} />
        </button>

        {/* Progress Bar - Ultra thin */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-100/50">
          <motion.div
            className={config.progressColor}
            style={{ height: '100%' }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
