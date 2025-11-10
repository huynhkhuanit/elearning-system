export default function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Avatar Section */}
      <div>
        <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Username */}
        <div>
          <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
          <div className="h-3 w-48 bg-gray-200 rounded mt-1"></div>
        </div>

        {/* Phone */}
        <div>
          <div className="h-5 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
          <div className="h-3 w-64 bg-gray-200 rounded mt-1"></div>
        </div>

        {/* Bio */}
        <div>
          <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-24 w-full bg-gray-200 rounded-lg"></div>
          <div className="h-3 w-56 bg-gray-200 rounded mt-1"></div>
        </div>

        {/* Social Links Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mb-4"></div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

