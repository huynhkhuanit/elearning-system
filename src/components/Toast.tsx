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
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    messageColor: 'text-green-700',
    progressColor: 'bg-green-500',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    messageColor: 'text-red-700',
    progressColor: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    messageColor: 'text-yellow-700',
    progressColor: 'bg-yellow-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    messageColor: 'text-blue-700',
    progressColor: 'bg-blue-500',
  },
};

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
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
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pointer-events-auto"
    >
      <div
        className={`
          relative w-[380px] rounded-xl shadow-2xl border-l-4 overflow-hidden
          ${config.bgColor} ${config.borderColor}
        `}
      >
        {/* Content */}
        <div className="p-4 pr-10">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold text-sm leading-tight ${config.titleColor}`}>
                {title}
              </h4>
              {message && (
                <p className={`text-xs mt-1 leading-relaxed ${config.messageColor}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`
            absolute top-3 right-3 p-1 rounded-md transition-colors
            ${config.iconColor} hover:bg-black/5
          `}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
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
