import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-4xl",
  md: "max-w-6xl",
  lg: "max-w-7xl",
  full: "max-w-full"
};

export default function PageContainer({ children, size = "lg", className = "" }: PageContainerProps) {
  return (
    <div className={`${sizeClasses[size]} mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}
