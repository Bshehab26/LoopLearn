// src/features/courses/components/RatingStars.jsx

import React, { useState } from 'react';
import { HiStar, HiOutlineStar } from 'react-icons/hi';

const RATING_STARS = [1, 2, 3, 4, 5];

/**
 * RatingStars – Interactive or static star rating display.
 *
 * @param {number} rating         - Current rating value (1–5)
 * @param {function} setRating    - Optional callback for interactive mode (receives new rating)
 * @param {boolean} interactive   - If true, allows clicking to set rating
 * @param {string} size           - 'sm' (16px), 'md' (20px), 'lg' (28px)
 * @param {boolean} showLabel     - If true, shows numeric rating next to stars
 * @param {string} className      - Additional CSS classes
 */
const RatingStars = ({
  rating = 0,
  setRating = null,
  interactive = false,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSize = size === 'lg' ? 28 : size === 'sm' ? 16 : 20;
  const displayRating = hoverRating || rating;

  const handleStarClick = (star) => {
    if (interactive && setRating) setRating(star);
  };

  const handleMouseEnter = (star) => {
    if (interactive) setHoverRating(star);
  };

  const handleMouseLeave = () => {
    if (interactive) setHoverRating(0);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex gap-0.5">
        {RATING_STARS.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={
              interactive
                ? 'cursor-pointer transition-transform hover:scale-110'
                : 'cursor-default'
            }
            aria-label={`Rate ${star} stars`}
            disabled={!interactive}
          >
            {displayRating >= star ? (
              <HiStar size={starSize} className="text-yellow-500 fill-yellow-500" />
            ) : (
              <HiOutlineStar size={starSize} className="text-gray-300" />
            )}
          </button>
        ))}
      </div>
      {showLabel && rating > 0 && (
        <span className="text-sm font-semibold text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;