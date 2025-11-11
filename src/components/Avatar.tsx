import Image from "next/image";

interface AvatarProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: {
    container: "w-6 h-6",
    text: "text-xs",
  },
  sm: {
    container: "w-8 h-8",
    text: "text-xs",
  },
  md: {
    container: "w-10 h-10",
    text: "text-sm",
  },
  lg: {
    container: "w-12 h-12",
    text: "text-base",
  },
  xl: {
    container: "w-16 h-16",
    text: "text-lg",
  },
};

export default function Avatar({
  avatarUrl,
  fullName,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizes = sizeMap[size];
  const initials = (fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${sizes.container} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={fullName || "User"}
          width={128}
          height={128}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <span className={`${sizes.text} font-semibold text-white`}>
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

