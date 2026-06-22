// src/features/courses/components/VideoPlayer.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlinePlay } from 'react-icons/hi';
import { updateLessonProgress } from '../api/course.api';
import { getYouTubeId, formatDuration } from '../../../shared/utils/helpers';

const VideoPlayer = ({ lecture, onComplete, isCompleted, onNext, onProgress }) => {
  const [player, setPlayer] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [lastReportedSecond, setLastReportedSecond] = useState(0);
  const progressTimer = useRef(null);
  const isMounted = useRef(true);

  const videoId = lecture?.videoUrl ? getYouTubeId(lecture.videoUrl) : null;

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    };
  }, []);

  const reportProgress = useCallback(
    async (currentTime, duration, force = false) => {
      if (!lecture || !isMounted.current) return;
      const lastSecond = Math.floor(currentTime);
      if (!force && lastSecond <= lastReportedSecond) return;
      setLastReportedSecond(lastSecond);
      
      if (onProgress) {
        onProgress(lecture.id, lastSecond, duration);
      }

      try {
        await updateLessonProgress(lecture.id, lastSecond, duration);
      } catch (err) {
        // Silently fail - don't break the video experience
        console.debug('Progress update failed (non-critical):', err.message);
      }
    },
    [lecture, lastReportedSecond, onProgress]
  );

  const handleReady = (event) => {
    setPlayer(event.target);
    if (lecture?.progress?.lastSecondWatched > 0) {
      event.target.seekTo(lecture.progress.lastSecondWatched, true);
    }
  };

  const handleStateChange = (event) => {
    // Video ended
    if (event.data === 0) {
      const duration = player?.getDuration?.() || 0;
      if (duration > 0) {
        reportProgress(duration, duration, true);
      }
      setShowNext(true);
    }

    // Video playing
    if (event.data === 1) {
      const duration = player?.getDuration?.() || 0;
      if (duration > 0 && progressTimer.current === null) {
        progressTimer.current = setInterval(() => {
          if (player && isMounted.current) {
            try {
              const currentTime = player.getCurrentTime();
              const dur = player.getDuration();
              if (dur > 0) {
                reportProgress(currentTime, dur);
              }
            } catch (err) {
              // Player might not be ready
              console.debug('Progress interval error:', err.message);
            }
          }
        }, 5000);
      }
    } else {
      // Paused, buffering, etc. - clear interval
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    }
  };

  const handleMarkComplete = () => {
    if (onComplete) {
      onComplete();
    }
    setShowNext(false);
  };

  // If no lecture, show placeholder
  if (!lecture) {
    return (
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 mb-6">
        <div className="w-full aspect-video flex items-center justify-center">
          <div className="text-center">
            <HiOutlinePlay size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Select a lecture to start learning</p>
          </div>
        </div>
      </div>
    );
  }

  // If no video ID, show placeholder
  if (!videoId) {
    return (
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 mb-6">
        <div className="w-full aspect-video flex items-center justify-center">
          <div className="text-center">
            <HiOutlineClock size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Video content coming soon</p>
            <p className="text-gray-500 text-xs mt-2">{lecture.title}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl overflow-hidden shadow-xl mb-6">
        <YouTube
          videoId={videoId}
          iframeClassName="w-full aspect-video"
          opts={{
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0,
              controls: 1,
              fs: 1,
              iv_load_policy: 3,
              playsinline: 1,
            },
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
          // Add these to prevent YouTube from interfering with React
          onError={(e) => {
            console.debug('YouTube player error:', e);
          }}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{lecture.title}</h2>
        {lecture.duration && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <HiOutlineClock size={16} />
            <span>{formatDuration(lecture.duration)}</span>
          </div>
        )}
        {lecture.description && (
          <p className="text-gray-600 leading-relaxed">{lecture.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {!isCompleted && (
          <button
            onClick={handleMarkComplete}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
          >
            <HiOutlineCheckCircle size={16} />
            Mark as Complete
          </button>
        )}
        {isCompleted && (
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-50 text-green-700">
            <HiOutlineCheckCircle size={16} />
            Completed ✓
          </span>
        )}
        {showNext && onNext && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-purple-600 text-purple-600 hover:bg-purple-50 transition"
          >
            Next Lecture →
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;