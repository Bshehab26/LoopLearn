// src/features/courses/components/course-details/CoursePurchaseCard.jsx
//
// CHANGED: Replaced the manual <button onClick={onEnroll}> with <EnrollButton>
// which handles free vs paid routing, loading states, and inline errors.
// onEnroll prop is no longer needed — pass onSuccess and onAuthRequired instead.

import React, { useState } from 'react';
import {
  HiOutlineShare,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineHeart,
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
  isSaved,
  // ── NEW props (replaces onEnroll) ──────────────────────────────────────────
  onAuthRequired,   // () => void — called when user is not signed in
  onSuccess,        // (data) => void — called after successful free enroll
  isAuthenticated,
  // ── Legacy props (kept for backward compat) ────────────────────────────────
  onSave,
  onShare,
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const price         = Number(course.price ?? 0);
  const originalPrice = Number(course.originalPrice) || price * 2.6;
  const discount      = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

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

        {/* ── EnrollButton — handles free + paid + loading + errors ────────── */}
        <div className="mb-3">
          <EnrollButton
            course={course}
            isEnrolled={isEnrolled}
            isAuthenticated={isAuthenticated}
            onAuthRequired={onAuthRequired}
            onSuccess={onSuccess}
          />
        </div>

        {/* Save / Share */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={onSave}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition
              flex items-center justify-center gap-1.5 border ${
              isSaved
                ? 'bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC]'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
            }`}
          >
            <HiOutlineHeart size={14} />
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu((s) => !s)}
              className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100
                transition text-xs font-medium flex items-center gap-1.5 border border-gray-200"
            >
              <HiOutlineShare size={14} /> Share
            </button>
            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-1.5 w-36 bg-white rounded-lg
                shadow-lg border border-gray-100 z-10">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setShowShareMenu(false);
                    onShare?.();
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-purple-50 transition rounded-lg"
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>

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