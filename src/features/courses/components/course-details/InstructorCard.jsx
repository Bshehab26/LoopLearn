// src/features/courses/components/course-details/InstructorCard.jsx
//
// Redesigned as a compact "credential card": a brand-gradient header band
// that the avatar overlaps, then name + bio below. Deliberately shows ONLY
// fields the backend actually returns for an instructor — InstructorName,
// InstructorBio, InstructorProfileImageUrl. No fabricated rating, student
// count, or course count.

import React, { useState } from 'react';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const getInitials = (fullName) => {
  if (!fullName || fullName === 'Unknown Instructor') return 'IN';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return fullName.slice(0, 2).toUpperCase();
};

const BIO_PREVIEW_LENGTH = 220;

const InstructorCard = ({
  instructor,
  instructorName,
  instructorBio,
  instructorProfileImageUrl,
}) => {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Support both prop patterns: an `instructor` object or flat props.
  const name = instructor?.instructorName || instructorName || 'Unknown Instructor';
  const bio = (instructor?.instructorBio || instructorBio || '').trim();
  const avatar = instructor?.instructorProfileImageUrl || instructorProfileImageUrl || '';
  const initials = getInitials(name);
  const showImage = avatar && !imgError;
  const bioIsLong = bio.length > BIO_PREVIEW_LENGTH;

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Header band */}
      <div
        className="relative h-20"
        style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
      >
        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Watermark icon */}
        <HiOutlineAcademicCap
          size={64}
          className="absolute -right-3 -top-3 text-white opacity-10 rotate-12"
        />
        <span className="absolute top-3 right-4 text-[10px] font-semibold tracking-wider text-white/80 uppercase">
          Instructor
        </span>
      </div>

      {/* Avatar — absolutely positioned & explicitly stacked above the band,
          straddling the band/content boundary. (The previous negative-margin
          approach could render underneath the band depending on the build —
          this is pinned with top/translate + z-index so it can't happen.) */}
      <div className="absolute z-10 top-20 left-6 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg bg-gradient-to-br from-[#534AB7] to-[#8B83D6] flex items-center justify-center overflow-hidden">
          {showImage ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="font-serif text-2xl font-semibold text-white">{initials}</span>
          )}
        </div>
      </div>

      <div className="px-6 pt-12 pb-6">
        {/* Name */}
        <p className="text-[11px] font-semibold tracking-wide text-purple-600 uppercase mb-1">
          Course Instructor
        </p>
        <h3 className="font-serif text-xl font-semibold text-gray-900 leading-snug mb-3">
          {name}
        </h3>

        {/* Bio */}
        {bio ? (
          <div className="relative pl-4">
            <span className="absolute -left-1 -top-3 font-serif text-5xl text-purple-100 select-none leading-none">
              "
            </span>
            <p
              className={`relative text-[13px] text-gray-600 leading-relaxed whitespace-pre-line ${
                !expanded && bioIsLong ? 'line-clamp-4' : ''
              }`}
            >
              {bio}
            </p>
            {bioIsLong && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mt-1.5 text-[12px] font-medium text-purple-600 hover:text-purple-800 transition"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        ) : (
          <p className="text-[13px] text-gray-400 italic">
            This instructor hasn't added a bio yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default InstructorCard;