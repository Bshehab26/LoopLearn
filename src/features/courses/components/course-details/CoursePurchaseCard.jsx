// src/features/courses/components/course-details/CoursePurchaseCard.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
  HiOutlineShare,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineLink,
  HiOutlineMail,
  HiOutlineShare as HiOutlineShareAlt,
} from 'react-icons/hi';
import EnrollButton from '../../../payment/components/EnrollButton';

const fmt = (currency, amount) => {
  if (!amount && amount !== 0) return '—';
  const num = Number(amount).toFixed(2);
  const sym = currency || '$';
  return sym.length > 1 ? `${sym} ${num}` : `${sym}${num}`;
};

const CoursePurchaseCard = ({
  course,
  currency,
  isEnrolled,
  onAuthRequired,
  onSuccess,
  isAuthenticated,
  onShare,
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showShareFeedback, setShowShareFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const shareMenuRef = useRef(null);

  const price = Number(course.price ?? 0);
  const originalPrice = Number(course.originalPrice) || price * 2.6;
  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = course.title || 'Check out this course on LoopLearn';

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Share handlers
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setFeedbackMessage('Link copied to clipboard! ✅');
      setShowShareFeedback(true);
      setTimeout(() => setShowShareFeedback(false), 3000);
      setShowShareMenu(false);
      onShare?.();
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setFeedbackMessage('Link copied to clipboard! ✅');
        setShowShareFeedback(true);
        setTimeout(() => setShowShareFeedback(false), 3000);
      } catch (err2) {
        setFeedbackMessage('Failed to copy link. Please copy manually.');
        setShowShareFeedback(true);
        setTimeout(() => setShowShareFeedback(false), 3000);
      }
      document.body.removeChild(textArea);
      setShowShareMenu(false);
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Check out this course: ${shareTitle}`);
    const body = encodeURIComponent(
      `Hi,\n\nI found this great course on LoopLearn and thought you might be interested:\n\n` +
      `${shareTitle}\n${shareUrl}\n\n` +
      `Learn more at LoopLearn - Empowering learners worldwide!\n\n` +
      `Best regards,\n[Your name]`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareMenu(false);
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out "${shareTitle}" on LoopLearn!`,
          url: shareUrl,
        });
        setShowShareMenu(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
          // Fallback to copy link
          handleCopyLink();
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      handleCopyLink();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-[#EEEDFE] to-purple-50
        flex items-center justify-center overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl">📚</span>
        )}
        {!isEnrolled && !course.isFree && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 rounded-full
            px-2.5 py-0.5 flex items-center gap-1 shadow-sm whitespace-nowrap">
            <HiOutlineLockClosed size={10} className="text-[#534AB7]" />
            <span className="text-[11px] font-medium text-[#534AB7]">Premium</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Price block */}
        <div className="mb-3">
          {isEnrolled ? (
            <div className="bg-green-50 text-green-700 rounded-lg p-2.5 text-center text-xs font-medium">
              ✓ You're enrolled in this course
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[22px] font-bold text-[#534AB7] leading-none">
                  {course.isFree ? 'Free' : fmt(currency, price)}
                </span>
                {!course.isFree && originalPrice > price && (
                  <>
                    <span className="text-[13px] text-gray-400 line-through">
                      {fmt(currency, originalPrice)}
                    </span>
                    <span className="text-[11px] bg-[#EAF3DE] text-[#27500A] px-1.5 py-0.5 rounded-full font-medium">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">30-Day Money-Back Guarantee</p>
            </>
          )}
        </div>

        {/* ── EnrollButton & Share Button ── */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <EnrollButton
              course={course}
              isEnrolled={isEnrolled}
              isAuthenticated={isAuthenticated}
              onAuthRequired={onAuthRequired}
              onSuccess={onSuccess}
              hideTrustBadge
            />
          </div>
          
          {/* Share Button with Dropdown - Same height as EnrollButton */}
          <div className="relative flex-1" ref={shareMenuRef}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="w-full h-full min-h-[44px] px-4 py-2.5 rounded-lg bg-gray-50 text-gray-600 
                hover:bg-gray-100 transition text-sm font-medium flex items-center justify-center gap-2 
                border border-gray-200 hover:border-purple-300 hover:text-purple-600"
              aria-label="Share course"
            >
              <HiOutlineShare size={18} />
              Share
            </button>

            {/* Share Menu Dropdown */}
            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl
                shadow-lg border border-gray-100 z-20 overflow-hidden">
                <div className="p-2">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-1 pb-2">
                    Share this course
                  </p>
                  
                  {/* Native Share (if supported) */}
                  {navigator.share && (
                    <button
                      onClick={handleShareNative}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700
                        hover:bg-purple-50 transition rounded-lg group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100">
                        <HiOutlineShareAlt size={16} />
                      </div>
                      <span>Share via...</span>
                    </button>
                  )}
                  
                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700
                      hover:bg-purple-50 transition rounded-lg group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 group-hover:text-purple-600">
                      <HiOutlineLink size={16} />
                    </div>
                    <span>Copy link</span>
                    <span className="ml-auto text-[10px] text-gray-400">⌘C</span>
                  </button>
                  
                  {/* Email */}
                  <button
                    onClick={handleShareEmail}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700
                      hover:bg-purple-50 transition rounded-lg group"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100">
                      <HiOutlineMail size={16} />
                    </div>
                    <span>Email</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stripe trust badge — rendered here (not inside EnrollButton) so it
            spans the full row instead of only stretching the Enroll column */}
        {!course.isFree && !isEnrolled && (
          <p className="mb-3 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            Secured by Stripe · 30-day money-back guarantee
          </p>
        )}

        {/* Feedback message */}
        {showShareFeedback && (
          <div className="mb-3 text-center">
            <span className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              {feedbackMessage}
            </span>
          </div>
        )}

        {/* Course includes */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
            This course includes
          </p>
          {[
            'On-demand video',
            'Full lifetime access',
            'Mobile & desktop access',
            'Certificate of completion',
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-[11px] text-gray-500 py-0.5">
              <HiOutlineCheckCircle size={13} className="text-purple-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {!isAuthenticated && !isEnrolled && (
          <div className="mt-3 p-2.5 bg-gray-50 rounded-lg text-center">
            <p className="text-[11px] text-gray-400">Sign in to enroll in this course</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePurchaseCard;