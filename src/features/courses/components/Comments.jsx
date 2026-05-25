/**
 * Comments.jsx
 * Course reviews and comments component with rating system.
 * Features: Rating stars, comment submission, likes, sorting, and reply functionality.
 * 
 * @module features/courses/components/Comments
 */

import { useState, useContext, useRef, useEffect, useCallback, useMemo } from 'react';
import { AppContext } from '../../../store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineHeart, HiOutlineChat, HiOutlineFlag } from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

/** Avatar color variants for user initials */
const AVATAR_COLORS = [
  { bg: '#EEEDFE', color: '#534AB7' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#D1FAE5', color: '#065F46' },
  { bg: '#FCE7F3', color: '#9D174D' },
  { bg: '#DBEAFE', color: '#1E40AF' },
];

/** Maximum comment length */
const MAX_COMMENT_LENGTH = 500;

/** Comment display truncation length */
const TRUNCATE_LENGTH = 200;

/** Sort options for comments */
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most-liked', label: 'Most Liked' },
];

/** Rating star values */
const RATING_STARS = [1, 2, 3, 4, 5];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets avatar color based on username
 * @param {string} username - User's username
 * @returns {Object} Color object with bg and color properties
 */
const getAvatarColor = (username) => {
  const index = username?.charCodeAt(0) % AVATAR_COLORS.length || 0;
  return AVATAR_COLORS[index];
};

/**
 * Formats date to "time ago" string
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted time ago
 */
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  
  const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 30) return `${diff} days ago`;
  if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
  return `${Math.floor(diff / 365)} years ago`;
};

/**
 * Calculates rating distribution for display
 * @param {Array} comments - List of comments
 * @returns {Array} Rating distribution data
 */
const calculateRatingDistribution = (comments) => {
  const totalComments = comments.length;
  
  return RATING_STARS.map(star => {
    const count = comments.filter(c => Math.floor(c.rating || 5) === star).length;
    const percentage = totalComments > 0 ? (count / totalComments) * 100 : 0;
    return { star, count, percentage };
  }).reverse();
};

/**
 * Calculates average rating from comments
 * @param {Array} comments - List of comments
 * @returns {string} Average rating rounded to 1 decimal
 */
const calculateAverageRating = (comments) => {
  if (comments.length === 0) return '0.0';
  const sum = comments.reduce((acc, c) => acc + (c.rating || 5), 0);
  return (sum / comments.length).toFixed(1);
};

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Rating Stars Component
 */
const RatingStars = ({ rating, setRating, interactive = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const starSize = interactive ? 24 : (size === 'lg' ? 20 : 16);
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
    <div className='flex gap-0.5'>
      {RATING_STARS.map((star) => (
        <button
          key={star}
          type='button'
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`Rate ${star} stars`}
        >
          <svg
            width={starSize}
            height={starSize}
            viewBox='0 0 24 24'
            fill={displayRating >= star ? '#F59E0B' : 'none'}
            stroke='#F59E0B'
            strokeWidth='2'
            className='transition-all duration-200'
          >
            <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
          </svg>
        </button>
      ))}
    </div>
  );
};

/**
 * Individual Comment Card Component
 */
const CommentCard = ({ comment, isOwner, onLike, onDelete, onReport }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const color = getAvatarColor(comment.username);
  const needsTruncation = comment.text?.length > TRUNCATE_LENGTH;
  const displayText = !isExpanded && needsTruncation
    ? `${comment.text.slice(0, TRUNCATE_LENGTH)}...`
    : comment.text;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='comment-card p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300'
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className='flex gap-3'>
        {/* Avatar */}
        <div
          className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0'
          style={{ background: color.bg, color: color.color }}
        >
          {comment.initials}
        </div>
        
        {/* Content */}
        <div className='flex-1 min-w-0'>
          {/* Header */}
          <div className='flex items-center justify-between gap-2 mb-1 flex-wrap'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='text-sm font-semibold text-gray-800'>
                @{comment.username}
              </span>
              {isOwner && (
                <span className='text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600'>
                  You
                </span>
              )}
              {comment.rating && <RatingStars rating={comment.rating} size='sm' />}
            </div>
            <span className='text-xs text-gray-400 flex-shrink-0'>
              {timeAgo(comment.date)}
            </span>
          </div>
          
          {/* Comment Text */}
          <p className='text-sm text-gray-600 leading-relaxed whitespace-pre-wrap'>
            {displayText}
          </p>
          
          {/* Read More Button */}
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-xs text-purple-600 hover:text-purple-700 mt-1 font-medium transition'
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
          
          {/* Action Buttons */}
          <div className='flex items-center gap-4 mt-3'>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1.5 text-xs transition-all ${
                comment.liked ? 'text-purple-600' : 'text-gray-400 hover:text-purple-500'
              }`}
            >
              <HiOutlineHeart size={14} className={comment.liked ? 'fill-purple-600' : ''} />
              <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
            </motion.button>
            
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className='flex gap-3 overflow-hidden'
                >
                  <button className='flex items-center gap-1 text-xs text-gray-400 hover:text-purple-500 transition'>
                    <HiOutlineChat size={13} /> Reply
                  </button>
                  
                  {!isOwner && (
                    <button
                      onClick={() => onReport(comment.id)}
                      className='flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition'
                    >
                      <HiOutlineFlag size={13} /> Report
                    </button>
                  )}
                  
                  {isOwner && (
                    <button
                      onClick={() => onDelete(comment.id)}
                      className='text-xs text-red-400 hover:text-red-600 transition'
                    >
                      Delete
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Sort Dropdown Component
 */
const SortDropdown = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const currentLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Newest';
  
  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 hover:border-purple-300 transition flex items-center gap-2'
      >
        Sort by: {currentLabel}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden'
          >
            {SORT_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition ${
                  sortBy === option.value 
                    ? 'bg-purple-50 text-purple-600 font-medium' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Rating Summary Component
 */
const RatingSummary = ({ comments }) => {
  const averageRating = useMemo(() => calculateAverageRating(comments), [comments]);
  const ratingDistribution = useMemo(() => calculateRatingDistribution(comments), [comments]);
  
  if (comments.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-white border border-purple-100 mb-8'
    >
      <div className='text-center md:text-left'>
        <div className='text-5xl font-bold text-purple-600'>{averageRating}</div>
        <RatingStars rating={parseFloat(averageRating)} />
        <p className='text-xs text-gray-500 mt-1'>Based on {comments.length} reviews</p>
      </div>
      
      <div className='flex-1 space-y-2'>
        {ratingDistribution.map(({ star, count, percentage }) => (
          <div key={star} className='flex items-center gap-3'>
            <span className='text-sm text-gray-600 w-12'>{star} ★</span>
            <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
              <div 
                className='h-full bg-yellow-400 rounded-full transition-all duration-300'
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className='text-xs text-gray-500 w-12'>{count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Comment Form Component
 */
const CommentForm = ({ onSubmit, loading, user }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setError('');
    const success = await onSubmit(text.trim(), rating);
    if (success) {
      setText('');
      setRating(5);
    }
  };
  
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='mb-10 p-4 rounded-xl text-sm text-center bg-purple-50 border border-purple-200 text-purple-700'
      >
        Please <a href='/signin' className='font-medium underline hover:no-underline'>sign in</a> to leave a review
      </motion.div>
    );
  }
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className='mb-10 p-5 rounded-2xl bg-gray-50 border border-gray-100'
    >
      <div className='flex gap-3'>
        <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-purple-100 text-purple-600'>
          {user.username?.slice(0, 2).toUpperCase()}
        </div>
        
        <div className='flex-1'>
          <div className='mb-3'>
            <label className='text-sm font-medium text-gray-700 mb-1 block'>Rating</label>
            <RatingStars rating={rating} setRating={setRating} interactive />
          </div>
          
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError('');
            }}
            placeholder='Write your review...'
            rows={3}
            maxLength={MAX_COMMENT_LENGTH}
            className='w-full px-4 py-3 text-sm rounded-xl outline-none resize-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-100'
            style={{ border: '1px solid #E5E7EB', background: 'white' }}
          />
          
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-xs mt-1 text-red-500'
            >
              {error}
            </motion.p>
          )}
          
          <div className='flex justify-end items-center gap-3 mt-3'>
            <p className='text-xs text-gray-400'>{text.length}/{MAX_COMMENT_LENGTH} characters</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={loading || !text.trim()}
              className='px-5 py-2 rounded-xl text-sm font-medium text-white transition disabled:opacity-50'
              style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                  </svg>
                  Posting...
                </span>
              ) : (
                'Post Review'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * Comments - Course reviews and comments section
 * @param {Object} props
 * @param {string|number} props.courseId - ID of the course
 */
const Comments = ({ courseId }) => {
  const { user } = useContext(AppContext);
  
  // State
  const [comments, setComments] = useState(DUMMY_COMMENTS);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // Handlers
  const handleSubmit = useCallback(async (text, rating) => {
    setSubmitting(true);
    
    // Simulate API call - Replace with actual API
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newComment = {
      id: Date.now(),
      username: user.username,
      initials: user.username.slice(0, 2).toUpperCase(),
      text,
      rating,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      liked: false,
    };
    
    setComments(prev => [newComment, ...prev]);
    setSubmitting(false);
    return true;
  }, [user]);
  
  const handleLike = useCallback((id) => {
    setComments(prev => prev.map(comment =>
      comment.id === id
        ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  }, []);
  
  const handleDelete = useCallback((id) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
  }, []);
  
  const handleReport = useCallback((id) => {
    // TODO: Implement API call for reporting
    alert('Thank you for reporting. We will review this comment.');
  }, []);
  
  // Sorted comments
  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    switch(sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'most-liked':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [comments, sortBy]);
  
  return (
    <div className='mt-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div>
          <h3 className='text-2xl font-bold text-gray-800'>
            Student Reviews
            <span className='ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-purple-100 text-purple-600'>
              {comments.length}
            </span>
          </h3>
          <p className='text-sm text-gray-400 mt-1'>What students are saying about this course</p>
        </div>
        
        <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
      </div>
      
      {/* Rating Summary */}
      <RatingSummary comments={comments} />
      
      {/* Comment Form */}
      <CommentForm 
        onSubmit={handleSubmit}
        loading={submitting}
        user={user}
      />
      
      {/* Comments List */}
      <AnimatePresence mode='wait'>
        {sortedComments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center py-12'
          >
            <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center'>
              <span className='text-4xl'>💬</span>
            </div>
            <p className='text-gray-500'>No reviews yet. Be the first to review this course!</p>
          </motion.div>
        ) : (
          <motion.div
            key={sortBy}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-4'
          >
            {sortedComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isOwner={user?.username === comment.username}
                onLike={handleLike}
                onDelete={handleDelete}
                onReport={handleReport}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// TODO: Remove this when connecting to real API
const DUMMY_COMMENTS = [
  { 
    id: 1, 
    username: 'sara_dev', 
    initials: 'SA', 
    text: 'This course is absolutely amazing! The instructor explains everything so clearly. I learned so much and feel confident applying these concepts in real projects.', 
    date: '2025-03-12', 
    likes: 14, 
    liked: false,
    rating: 5,
  },
  { 
    id: 2, 
    username: 'mohamedx', 
    initials: 'MO', 
    text: 'Great content, really helped me understand the concepts. Highly recommended!', 
    date: '2025-03-18', 
    likes: 8, 
    liked: false,
    rating: 4,
  },
  { 
    id: 3, 
    username: 'nour_learns', 
    initials: 'NO', 
    text: 'I was stuck on this topic for weeks. After this course everything clicked!', 
    date: '2025-04-01', 
    likes: 22, 
    liked: false,
    rating: 5,
  },
];

export default Comments;