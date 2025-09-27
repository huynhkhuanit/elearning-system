import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface BadgeProps {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "featured" | "outline-primary" | "outline-success" | "gradient-orange" | "gradient-green";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  primary: "bg-indigo-100 text-indigo-800",
  secondary: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  featured: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
  "outline-primary": "border-2 border-indigo-200 text-indigo-700 bg-transparent",
  "outline-success": "border-2 border-green-200 text-green-700 bg-transparent",
  "gradient-orange": "bg-gradient-to-r from-orange-400 to-red-500 text-white",
  "gradient-green": "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
};

const sizeStyles = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

export default function Badge({
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  className = "",
}: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium transition-colors duration-200";

  const variantClasses = variantStyles[variant];
  const sizeClasses = sizeStyles[size];

  return (
    <span className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
      {Icon && <Icon className={`w-3 h-3 mr-1 ${size === "sm" ? "w-2.5 h-2.5" : size === "lg" ? "w-4 h-4" : "w-3 h-3"}`} />}
      {children}
    </span>
  );
}
