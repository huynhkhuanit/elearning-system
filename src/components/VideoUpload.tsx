"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface VideoUploadProps {
  lessonId: string;
  currentVideoUrl?: string;
  onUploadComplete?: (videoUrl: string, duration: number) => void;
  onError?: (error: string) => void;
}

export default function VideoUpload({
  lessonId,
  currentVideoUrl,
  onUploadComplete,
  onError,
}: VideoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState(currentVideoUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleVideoUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleVideoUpload(files[0]);
    }
  };

  const handleVideoUpload = async (file: File) => {
    setError("");
    setSuccess(false);

    // Validate file size (max 2GB)
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    if (file.size > maxSize) {
      const errorMsg = `File quá lớn. Kích thước tối đa là 2GB, bạn upload ${(
        file.size /
        (1024 * 1024 * 1024)
      ).toFixed(2)}GB`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate file type
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `Định dạng không hỗ trợ. Cho phép: ${allowedTypes.join(
        ", "
      )}`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // 1. Get signature from server
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        folder: "dhvlearnx/videos",
        timestamp: timestamp,
        eager: "w_300,h_300,c_fill,f_jpg", // Thumbnail generation
        eager_async: true,
      };

      const signResponse = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paramsToSign }),
      });

      if (!signResponse.ok) {
        throw new Error("Failed to get upload signature");
      }

      const { signature } = await signResponse.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.CLOUDINARY_API_KEY || "");
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "dhvlearnx/videos");
      formData.append("eager", "w_300,h_300,c_fill,f_jpg");
      formData.append("eager_async", "true");

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Missing Cloudinary Cloud Name");

      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<{ secure_url: string; duration: number }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error("Cloudinary upload failed"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
        xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
        xhr.send(formData);
      });

      const cloudinaryData = await uploadPromise;

      // 3. Save URL to database
      const saveResponse = await fetch(
        `/api/lessons/${lessonId}/video/upload`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoUrl: cloudinaryData.secure_url,
            duration: cloudinaryData.duration,
          }),
        }
      );

      if (!saveResponse.ok) {
        throw new Error("Failed to save video URL");
      }

      const data = await saveResponse.json();

      if (data.success) {
        setUploadedUrl(cloudinaryData.secure_url);
        setSuccess(true);
        onUploadComplete?.(cloudinaryData.secure_url, cloudinaryData.duration || 0);

        // Clear input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Lỗi upload video";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-gray-600 bg-gray-900/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-4">
            <Loader className="w-12 h-12 mx-auto text-indigo-500 animate-spin" />
            <p className="text-gray-300 font-medium">Đang tải lên video...</p>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-300 font-medium mb-2">
              Kéo và thả video hoặc click để chọn
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Hỗ trợ: MP4, WebM, OGG (Tối đa 2GB)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Chọn File
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-medium">Lỗi</p>
            <p className="text-red-200 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-300 hover:text-red-200 ml-auto flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success Message */}
      {success && uploadedUrl && (
        <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-300 font-medium">Tải lên thành công!</p>
            <p className="text-green-200 text-sm mt-1 break-all">
              {uploadedUrl}
            </p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="text-green-300 hover:text-green-200 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Current Video Info */}
      {uploadedUrl && (
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Video hiện tại:</p>
          <p className="text-gray-200 text-sm break-all font-mono">
            {uploadedUrl}
          </p>
          <div className="mt-3 flex gap-2">
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
            >
              Xem trước
            </a>
            <button
              onClick={() => {
                setUploadedUrl("");
                setSuccess(false);
              }}
              className="text-sm px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
