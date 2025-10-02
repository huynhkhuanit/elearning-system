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
    bgColor: 'bg-white',
    borderColor: 'border-green-400',
    iconBgColor: 'bg-green-500',
    iconColor: 'text-white',
    titleColor: 'text-gray-900',
    messageColor: 'text-gray-600',
    progressColor: 'bg-green-500',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-white',
    borderColor: 'border-red-400',
    iconBgColor: 'bg-red-500',
    iconColor: 'text-white',
    titleColor: 'text-gray-900',
    messageColor: 'text-gray-600',
    progressColor: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-white',
    borderColor: 'border-yellow-400',
    iconBgColor: 'bg-yellow-500',
    iconColor: 'text-white',
    titleColor: 'text-gray-900',
    messageColor: 'text-gray-600',
    progressColor: 'bg-yellow-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-white',
    borderColor: 'border-blue-400',
    iconBgColor: 'bg-blue-500',
    iconColor: 'text-white',
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
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pointer-events-auto"
    >
      <div
        className={`
          relative w-[320px] rounded-lg shadow-lg border overflow-hidden
          ${config.bgColor} ${config.borderColor}
        `}
      >
        {/* Content */}
        <div className="p-3 pr-8">
          <div className="flex items-start gap-2.5">
            {/* Icon with colored background */}
            <div className={`flex-shrink-0 w-7 h-7 rounded-full ${config.iconBgColor} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${config.iconColor}`} />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className={`font-medium text-sm ${config.titleColor}`}>
                {title}
              </h4>
              {message && (
                <p className={`text-xs mt-0.5 ${config.messageColor}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 p-0.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
          <motion.div
            className={`h-full ${config.progressColor}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
