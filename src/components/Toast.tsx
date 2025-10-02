"use client";

import { useEffect } from 'react';
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
  title?: string; // Now optional, we'll use message as main content
  message: string;
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
  const config = toastConfig[type];
  const Icon = config.icon;

  // Auto close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-auto"
    >
      <div className="relative w-[380px] bg-white rounded-lg shadow-lg border border-gray-200/80 overflow-hidden backdrop-blur-sm">
        {/* Content */}
        <div className="px-4 py-3 pr-9">
          <div className="flex items-center gap-3">
            {/* Icon - Simple, no background */}
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} strokeWidth={2.5} />

            {/* Message Content - Single text, larger and bolder */}
            <p className={`flex-1 font-normal text-[14px] leading-snug ${config.titleColor}`}>
              {message}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </button>

        {/* Progress Bar */}
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
