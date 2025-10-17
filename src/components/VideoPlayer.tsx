"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  Share2,
} from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string | null;
  lessonId: string;
  duration?: number;
  title?: string;
  onProgress?: (data: { currentTime: number; duration: number }) => void;
  onComplete?: () => void;
  autoSave?: boolean; // Auto-save progress every 10 seconds
}

export default function VideoPlayer({
  videoUrl,
  lessonId,
  duration,
  title,
  onProgress,
  onComplete,
  autoSave = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true); // ✅ Always show by default
  const [showSettings, setShowSettings] = useState(false);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAutoHideControls, setShowAutoHideControls] = useState(false); // ✅ Only auto-hide in fullscreen

  // Control hide timeout
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save progress
  const lastSaveTimeRef = useRef(0);

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No video available for this lesson</p>
        </div>
      </div>
    );
  }

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      // Auto-save progress
      if (autoSave && Date.now() - lastSaveTimeRef.current > 10000) {
        saveProgress(time);
        lastSaveTimeRef.current = Date.now();
      }

      onProgress?.({ currentTime: time, duration: videoDuration });
    }
  }, [videoDuration, autoSave, onProgress]);

  // Handle metadata loaded
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  // Handle video ended
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    saveProgress(videoDuration);
    onComplete?.();
  }, [videoDuration, onComplete]);

  // Handle progress bar seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    if (vol > 0 && isMuted) setIsMuted(false);
  };

  // Handle mute/unmute
  const handleMuteToggle = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  // Handle fullscreen
  const handleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement && containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error("Fullscreen request failed:", error);
      }
    } else if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        console.error("Exit fullscreen failed:", error);
      }
    }
  }, []);

  // Handle playback rate
  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
    setShowSettings(false);
  };

  // Handle buffered progress
  const handleProgress = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percent = (bufferedEnd / video.duration) * 100;
        setBufferedPercent(percent);
      }
    }
  }, []);

  // Handle skip forward/backward
  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoDuration, videoRef.current.currentTime + seconds)
      );
    }
  };

  // Save progress to backend
  const saveProgress = async (timestamp: number) => {
    try {
      await fetch(`/api/lessons/${lessonId}/video/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: Math.round(timestamp),
          duration: Math.round(videoDuration),
        }),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  // Hide controls after inactivity (only in fullscreen)
  const handleMouseMove = useCallback(() => {
    // Always show controls when not fullscreen
    if (!isFullscreen) {
      setShowControls(true);
      return;
    }

    // In fullscreen: show on mouse move, hide after 3 seconds
    setShowAutoHideControls(true);
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowAutoHideControls(false);
      }, 3000);
    }
  }, [isPlaying, isFullscreen]);

  // Format time display
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercent = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden group cursor-pointer relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (isFullscreen && isPlaying) {
          // Only hide in fullscreen when playing
          setShowControls(false);
        }
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full block"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onProgress={handleProgress}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        crossOrigin="anonymous"
        onMouseMove={(e) => e.stopPropagation()}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity group-hover:bg-black/50"
          onClick={handlePlayPause}
        >
          <Play className="w-16 h-16 text-white fill-white" />
        </div>
      )}

      {/* Progress Bar (always visible) */}
      <div
        className={`absolute bottom-16 left-0 right-0 h-1 bg-gray-700 cursor-pointer transition-opacity duration-200 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          const newTime = percent * videoDuration;
          if (videoRef.current) {
            videoRef.current.currentTime = newTime;
          }
        }}
      >
        {/* Buffered Progress */}
        <div
          className="h-full bg-gray-500 transition-all"
          style={{ width: `${bufferedPercent}%` }}
        />
        {/* Watched Progress */}
        <div
          className="h-full bg-orange-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls Bar - Always visible */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-8 pb-4 px-4 transition-opacity duration-200 ${
          showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Title */}
        {title && (
          <div className="mb-3 text-white text-sm font-medium truncate">
            {title}
          </div>
        )}

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="p-2 hover:bg-white/20 rounded transition-colors text-white"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => handleSkip(-10)}
              className="p-2 hover:bg-white/20 rounded transition-colors text-white text-xs"
              title="Skip back 10s"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="p-2 hover:bg-white/20 rounded transition-colors text-white text-xs"
              title="Skip forward 10s"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleMuteToggle}
                className="p-2 hover:bg-white/20 rounded transition-colors text-white"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-600 rounded cursor-pointer accent-orange-500"
              />
            </div>

            {/* Time Display */}
            <div className="text-white text-xs font-mono ml-2">
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/20 rounded transition-colors text-white"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Settings Menu */}
              {showSettings && (
                <div className="absolute bottom-12 right-0 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg min-w-max">
                  <div className="p-2 text-white text-sm font-semibold border-b border-gray-700">
                    Playback Speed
                  </div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        playbackRate === rate
                          ? "bg-orange-500 text-white"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Download */}
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = videoUrl;
                link.download = title || "video.mp4";
                link.click();
              }}
              className="p-2 hover:bg-white/20 rounded transition-colors text-white"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={async () => {
                try {
                  await navigator.share({
                    title,
                    text: "Check out this lesson",
                    url: window.location.href,
                  });
                } catch (error) {
                  console.error("Share failed:", error);
                }
              }}
              className="p-2 hover:bg-white/20 rounded transition-colors text-white"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-white/20 rounded transition-colors text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
