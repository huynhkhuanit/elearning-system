import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface BadgeProps {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "featured" | "outline-primary" | "outline-success" | "gradient-orange" | "gradient-green" | "gradient-primary" | "gradient-success";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  borderWidth?: "none" | "thin" | "normal" | "thick";
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  primary: "bg-indigo-500 text-white",
  secondary: "bg-gray-600 text-white",
  success: "bg-emerald-500 text-white",
  warning: "bg-amber-500 text-white",
  danger: "bg-red-500 text-white",
  featured: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
  "outline-primary": "border border-indigo-300 text-indigo-600 bg-card",
  "outline-success": "border border-emerald-300 text-emerald-600 bg-card",
  "gradient-orange": "bg-gradient-to-r from-orange-400 to-red-500 text-white",
  "gradient-green": "bg-gradient-to-r from-emerald-400 to-green-500 text-white",
  "gradient-primary": "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
  "gradient-success": "bg-gradient-to-r from-emerald-500 to-green-600 text-white",
};

const sizeStyles = {
  xs: "p-1.5 text-xs uppercase", // 3px 6px padding, uppercase text
  sm: "p-1.5 text-xs uppercase", // 3px 6px padding, uppercase text
  md: "p-1.5 text-sm uppercase", // 3px 6px padding, uppercase text
  lg: "p-1.5 text-sm uppercase", // 3px 6px padding, uppercase text
  xl: "p-1.5 text-base uppercase", // 3px 6px padding, uppercase text
};

const borderWidthStyles = {
  none: "border-0",
  thin: "border",
  normal: "border-2",
  thick: "border-4",
};

const borderRadiusStyles = {
  none: "rounded-none",
  sm: "rounded-sm", // 4px border radius
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export default function Badge({
  variant = "primary",
  size = "md",
  borderWidth = "none",
  borderRadius = "sm",
  icon: Icon,
  children,
  className = "",
}: BadgeProps) {
  const variantClasses = variantStyles[variant];
  const sizeClasses = sizeStyles[size];
  const borderWidthClasses = borderWidthStyles[borderWidth];
  const borderRadiusClasses = borderRadiusStyles[borderRadius];

  // Base classes - shadow only for outline variants, no fixed width/height
  const isOutline = variant.startsWith('outline-');
  const baseClasses = `inline-flex items-center font-semibold transition-all duration-200 ${
    isOutline ? 'shadow-sm hover:shadow-md' : ''
  }`;

  // Icon size based on badge size
  const iconSizeClasses = {
    xs: "w-2.5 h-2.5",
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
    xl: "w-4 h-4",
  };

  const iconMarginClasses = {
    xs: "mr-1",
    sm: "mr-1.5",
    md: "mr-1.5",
    lg: "mr-2",
    xl: "mr-2",
  };

  return (
    <span className={`${baseClasses} ${variantClasses} ${sizeClasses} ${borderWidthClasses} ${borderRadiusClasses} ${className}`}>
      {Icon && (
        <Icon className={`${iconSizeClasses[size]} ${iconMarginClasses[size]}`} />
      )}
      <span className="leading-none">{children}</span>
    </span>
  );
}
