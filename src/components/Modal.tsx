"use client";

import { ReactNode, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "auto";
export type ModalVariant = "default" | "success" | "error" | "warning" | "info" | "destructive";
export type ModalAnimation = "fade" | "scale" | "slide" | "bounce" | "none";

interface ModalProps {
  // Basic props
  isOpen: boolean;
  onClose: () => void;

  // Content props
  title?: string;
  subtitle?: string;
  children: ReactNode;

  // Layout props
  size?: ModalSize;
  variant?: ModalVariant;
  animation?: ModalAnimation;

  // Interaction props
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  preventBodyScroll?: boolean;

  // Styling props
  className?: string;
  backdropClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;

  // Advanced props
  headerIcon?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;

  // Callback props
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
  onBackdropClick?: () => void;

  // Accessibility props
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const sizeClasses = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full mx-4",
  auto: "max-w-auto",
};

const variantClasses = {
  default: {
    header: "border-gray-100",
    icon: "text-gray-600",
    title: "text-gray-900",
  },
  success: {
    header: "border-green-100",
    icon: "text-green-600",
    title: "text-green-900",
  },
  error: {
    header: "border-red-100",
    icon: "text-red-600",
    title: "text-red-900",
  },
  warning: {
    header: "border-yellow-100",
    icon: "text-yellow-600",
    title: "text-yellow-900",
  },
  info: {
    header: "border-blue-100",
    icon: "text-blue-600",
    title: "text-blue-900",
  },
  destructive: {
    header: "border-red-100",
    icon: "text-red-600",
    title: "text-red-900",
  },
};

const variantIcons = {
  default: null,
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  destructive: XCircle,
};

const animationVariants = {
  fade: {
    backdrop: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    modal: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  },
  scale: {
    backdrop: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    modal: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 }
    },
  },
  slide: {
    backdrop: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    modal: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 20, opacity: 0 }
    },
  },
  bounce: {
    backdrop: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    modal: {
      initial: { scale: 0.3, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.3, opacity: 0 },
      transition: { type: "spring", duration: 0.6, bounce: 0.4 }
    },
  },
  none: {
    backdrop: { initial: {}, animate: {}, exit: {} },
    modal: { initial: {}, animate: {}, exit: {} },
  },
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  variant = "default",
  animation = "scale",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  preventBodyScroll = true,
  className = "",
  backdropClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  headerIcon,
  footer,
  loading = false,
  onAfterOpen,
  onAfterClose,
  onBackdropClick,
  role = "dialog",
  ariaLabel,
  ariaDescribedBy,
}: ModalProps) {
  // Get current variant styles
  const currentVariant = variantClasses[variant];
  const animationConfig = animationVariants[animation];
  const VariantIcon = variantIcons[variant];

  // Auto icon based on variant
  const defaultIcon = VariantIcon ? (
    <VariantIcon className={`w-6 h-6 ${currentVariant.icon}`} />
  ) : headerIcon;

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll
  useEffect(() => {
    if (!preventBodyScroll || !isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, preventBodyScroll]);

  // Handle modal lifecycle
  useEffect(() => {
    if (isOpen) {
      onAfterOpen?.();
    } else {
      onAfterClose?.();
    }
  }, [isOpen, onAfterOpen, onAfterClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (closeOnBackdropClick) {
        onClose();
      } else {
        onBackdropClick?.();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        {...animationConfig.backdrop}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 ${backdropClassName}`}
        onClick={handleBackdropClick}
        role={role}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={ariaDescribedBy || (subtitle ? "modal-subtitle" : undefined)}
      >
        <motion.div
          {...animationConfig.modal}
          className={`
            bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} ${className}
            max-h-[90vh] overflow-hidden flex flex-col
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          )}

          {/* Header */}
          {(title || defaultIcon || showCloseButton) && (
            <div className={`flex items-center justify-between p-6 border-b ${currentVariant.header} ${headerClassName}`}>
              <div className="flex items-center space-x-4">
                {defaultIcon && (
                  <div className="flex-shrink-0">
                    {defaultIcon}
                  </div>
                )}
                {(title || subtitle) && (
                  <div>
                    {title && (
                      <h2
                        id="modal-title"
                        className={`text-xl font-bold leading-tight ${currentVariant.title}`}
                      >
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p
                        id="modal-subtitle"
                        className="text-sm text-gray-600 mt-1"
                      >
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label="Đóng modal"
                  disabled={loading}
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`flex-1 overflow-y-auto p-6 ${bodyClassName}`}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`border-t ${currentVariant.header} p-6 bg-gray-50/50 ${footerClassName}`}>
              {footer}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
