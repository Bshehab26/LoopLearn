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

  const videoId = lecture?.videoUrl ? getYouTubeId(lecture.videoUrl) : null;

  const reportProgress = useCallback(
    async (currentTime, duration, force = false) => {
      if (!lecture) return;
      const lastSecond = Math.floor(currentTime);
      if (!force && lastSecond <= lastReportedSecond) return;
      setLastReportedSecond(lastSecond);
      
      // Notify parent for UI update immediately
      if (onProgress) {
        onProgress(lecture.id, lastSecond, duration);
      }

      try {
        await updateLessonProgress(lecture.id, lastSecond, duration);
        console.log(`Progress updated: ${lastSecond}/${duration}`);
      } catch (err) {
        console.error('Progress update failed:', err);
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
    if (event.data === 0) {
      // Video ended – send final progress
      const duration = player.getDuration();
      reportProgress(duration, duration, true);
      setShowNext(true);
    }

    if (event.data === 1) {
      const duration = player.getDuration();
      progressTimer.current = setInterval(() => {
        const currentTime = player.getCurrentTime();
        reportProgress(currentTime, duration);
      }, 5000);
    } else {
      clearInterval(progressTimer.current);
    }
  };

  useEffect(() => {
    return () => clearInterval(progressTimer.current);
  }, []);

  const handleMarkComplete = () => {
    onComplete();
    setShowNext(false);
  };

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
            },
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
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

      <div className="flex items-center gap-3">
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