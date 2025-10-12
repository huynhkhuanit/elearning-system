import Image from "next/image";

interface AvatarWithProBadgeProps {
  avatarUrl?: string | null;
  fullName: string;
  isPro: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeMap = {
  xs: {
    container: "w-8 h-8",
    text: "text-xs",
    badge: "w-3 h-3 -top-0.5 -right-0.5",
    padding: "p-[2px]"
  },
  sm: {
    container: "w-10 h-10",
    text: "text-sm",
    badge: "w-3.5 h-3.5 -top-0.5 -right-0.5",
    padding: "p-[2px]"
  },
  md: {
    container: "w-12 h-12",
    text: "text-base",
    badge: "w-4 h-4 -top-1 -right-1",
    padding: "p-[2.5px]"
  },
  lg: {
    container: "w-16 h-16",
    text: "text-lg",
    badge: "w-5 h-5 -top-1 -right-1",
    padding: "p-[3px]"
  },
  xl: {
    container: "w-20 h-20",
    text: "text-xl",
    badge: "w-6 h-6 -top-1.5 -right-1.5",
    padding: "p-[3px]"
  },
  "2xl": {
    container: "w-32 h-32",
    text: "text-3xl",
    badge: "w-8 h-8 -top-2 -right-2",
    padding: "p-[4px]"
  }
};

export default function AvatarWithProBadge({
  avatarUrl,
  fullName,
  isPro,
  size = "md",
  className = ""
}: AvatarWithProBadgeProps) {
  const sizes = sizeMap[size];
  const initials = fullName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Gradient Border Container */}
      <div
        className={`${sizes.container} rounded-full ${sizes.padding} ${
          isPro
            ? "bg-gradient-to-b from-yellow-400 via-orange-500 to-pink-600"
            : "bg-gray-300"
        }`}
      >
        {/* Avatar */}
        <div className="w-full h-full rounded-full overflow-hidden bg-white">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
              <span className={`${sizes.text} font-bold text-white`}>
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* PRO Badge */}
      {isPro && (
        <div
          className={`absolute ${sizes.badge} bg-white rounded-full flex items-center justify-center shadow-lg`}
          style={{
            padding: "2px"
          }}
        >
          <svg
            viewBox="0 0 10 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M9.39379 9.23321C9.0651 9.45156 8.65127 9.35571 8.44241 9.04131C8.43292 9.02701 8.43292 9.02701 8.43292 9.02701L3.97587 10.9373C3.74252 11.0512 3.45241 10.9555 3.31001 10.7412L0.16768 6.01085C0.0252788 5.79648 0.0495717 5.49198 0.244949 5.321L3.73367 1.95298C3.73367 1.95298 3.73367 1.95298 3.72418 1.93869C3.51533 1.62429 3.58739 1.20567 3.91608 0.987317C4.23048 0.778461 4.6586 0.864817 4.86746 1.17922C5.06682 1.47933 4.98996 1.92174 4.67556 2.13059C4.54694 2.21604 4.39464 2.23482 4.24713 2.22982L4.07259 4.19953C4.05299 4.54211 4.3428 4.82333 4.68548 4.78107L6.87956 4.5182C6.87517 4.29455 6.97071 4.0663 7.18508 3.9239C7.49948 3.71504 7.9276 3.8014 8.14594 4.13009C8.3548 4.44449 8.25895 4.85832 7.94455 5.06718C7.73019 5.20958 7.48275 5.20917 7.26879 5.10413L6.17594 7.02475C6.00415 7.32425 6.16054 7.7147 6.48392 7.82944L8.35779 8.41781C8.41985 8.29419 8.5057 8.17537 8.63432 8.08993C8.94872 7.88107 9.36734 7.95314 9.58569 8.28183C9.79455 8.59623 9.70819 9.02435 9.39379 9.23321Z"
              fill="#F5C70E"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

