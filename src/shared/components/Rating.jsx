// src/shared/components/Rating.jsx
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// ============================================================================
// Constants
// ============================================================================

const STAR_COLORS = {
  filled: '#FFB800',
  half: '#FFB800',
  empty: '#E5E7EB',
};

// ============================================================================
// Helper Components
// ============================================================================

const Star = ({ type, size = 16 }) => {
  if (type === 'full') {
    return <FaStar size={size} color={STAR_COLORS.filled} />;
  }
  if (type === 'half') {
    return <FaStarHalfAlt size={size} color={STAR_COLORS.half} />;
  }
  return <FaRegStar size={size} color={STAR_COLORS.empty} />;
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * Rating component - Displays star rating
 * @param {number} rating - Rating value (0-5)
 * @param {number} totalRatings - Total number of ratings
 * @param {number} size - Icon size in pixels
 * @param {boolean} showNumber - Whether to show numeric rating
 * @param {boolean} showTotal - Whether to show total ratings count
 * @param {function} onRating - Callback when rating is clicked (for interactive)
 */
const Rating = ({ 
  rating = 0, 
  totalRatings = 0, 
  size = 16, 
  showNumber = false, 
  showTotal = false,
  onRating = null,
}) => {
  const normalizedRating = Math.min(5, Math.max(0, rating));
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} type="full" size={size} />
        ))}
        {hasHalfStar && <Star type="half" size={size} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} type="empty" size={size} />
        ))}
      </div>

      {/* Numeric Rating */}
      {showNumber && (
        <span className="text-sm font-semibold text-gray-700">
          {normalizedRating.toFixed(1)}
        </span>
      )}

      {/* Total Ratings Count */}
      {showTotal && totalRatings > 0 && (
        <span className="text-xs text-gray-500">
          ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
};

export default Rating;