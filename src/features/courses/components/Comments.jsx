/**
 * Comments.jsx
 * Course reviews and comments component with rating system.
 * Features: Rating stars, comment submission, likes, sorting, and reply functionality.
 * 
 * @module features/courses/components/Comments
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAuth, useUI } from '../../../store/AppProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineHeart, HiOutlineChat, HiOutlineFlag, 
  HiOutlineStar, HiStar, HiOutlineCheckCircle
} from 'react-icons/hi';

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
  { value: 'highest-rated', label: 'Highest Rated' },
];

/** Rating star values */
const RATING_STARS = [1, 2, 3, 4, 5];

/** Mock comments for development (remove when backend is ready) */
const MOCK_COMMENTS = [
  { 
    id: 1, 
    username: 'sara_dev', 
    userId: 'user_1',
    text: 'This course is absolutely amazing! The instructor explains everything so clearly. I learned so much and feel confident applying these concepts in real projects. The hands-on exercises were particularly helpful.', 
    date: '2025-03-12T10:30:00Z', 
    rating: 5,
    likes: 24,
    liked: false,
    replies: [],
  },
  { 
    id: 2, 
    username: 'mohamedx', 
    userId: 'user_2',
    text: 'Great content, really helped me understand the concepts. Highly recommended for anyone starting out!', 
    date: '2025-03-18T14:20:00Z', 
    rating: 4,
    likes: 12,
    liked: false,
    replies: [],
  },
  { 
    id: 3, 
    username: 'nour_learns', 
    userId: 'user_3',
    text: 'I was stuck on this topic for weeks. After this course everything clicked! The instructor has a great teaching style.', 
    date: '2025-04-01T09:15:00Z', 
    rating: 5,
    likes: 31,
    liked: false,
    replies: [
      {
        id: 31,
        username: 'instructor_jane',
        userId: 'instructor_1',
        text: 'So glad to hear that! Keep up the great work! 🎉',
        date: '2025-04-02T11:00:00Z',
        likes: 5,
        liked: false,
      }
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets avatar color based on username
 * @param {string} username - User's username
 * @returns {Object} Color object with bg and color properties
 */
const getAvatarColor = (username) => {
  if (!username) return AVATAR_COLORS[0];
  const index = username.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

/**
 * Gets user initials from username
 * @param {string} username - User's username
 * @returns {string} User initials (2 letters)
 */
const getUserInitials = (username) => {
  if (!username) return '??';
  return username.slice(0, 2).toUpperCase();
};

/**
 * Formats date to "time ago" string
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted time ago
 */
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
};

/**
 * Calculates rating distribution for display
 * @param {Array} comments - List of comments
 * @returns {Array} Rating distribution data
 */
const calculateRatingDistribution = (comments) => {
  const totalComments = comments.length;
  if (totalComments === 0) return [];
  
  return RATING_STARS.map(star => {
    const count = comments.filter(c => Math.floor(c.rating || 5) === star).length;
    const percentage = (count / totalComments) * 100;
    return { star, count, percentage };
  }).reverse();
};

/**
 * Calculates average rating from comments
 * @param {Array} comments - List of comments
 * @returns {number} Average rating
 */
const calculateAverageRating = (comments) => {
  if (comments.length === 0) return 0;
  const sum = comments.reduce((acc, c) => acc + (c.rating || 5), 0);
  return sum / comments.length;
};

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Rating Stars Component
 */
const RatingStars = ({ rating, setRating, interactive = false, size = 'md', showLabel = false }) => {
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
    <div className="flex items-center gap-1">
      <div className='flex gap-0.5'>
        {RATING_STARS.map((star) => (
          <button
            key={star}
            type='button'
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
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
        <span className="text-sm font-semibold text-gray-700 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

/**
 * Individual Comment Card Component
 */
const CommentCard = ({ comment, isOwner, isInstructor, onLike, onDelete, onReport, onReply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const color = getAvatarColor(comment.username);
  const initials = getUserInitials(comment.username);
  const needsTruncation = comment.text?.length > TRUNCATE_LENGTH;
  const displayText = !isExpanded && needsTruncation
    ? `${comment.text.slice(0, TRUNCATE_LENGTH)}...`
    : comment.text;
  
  const handleSubmitReply = () => {
    if (replyText.trim() && onReply) {
      onReply(comment.id, replyText.trim());
      setReplyText('');
      setShowReplyForm(false);
    }
  };
  
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
          {initials}
        </div>
        
        {/* Content */}
        <div className='flex-1 min-w-0'>
          {/* Header */}
          <div className='flex items-center justify-between gap-2 mb-1 flex-wrap'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='text-sm font-semibold text-gray-800'>
                {comment.username}
                {isInstructor && !isOwner && (
                  <span className="ml-2 text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                    Instructor
                  </span>
                )}
              </span>
              {isOwner && (
                <span className='text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600'>
                  You
                </span>
              )}
              {comment.rating && (
                <RatingStars rating={comment.rating} size='sm' />
              )}
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
                  <button 
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className='flex items-center gap-1 text-xs text-gray-400 hover:text-purple-500 transition'
                  >
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
          
          {/* Reply Form */}
          <AnimatePresence>
            {showReplyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='mt-3 pt-3 border-t border-gray-100'
              >
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim()}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    Post Reply
                  </button>
                  <button
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Replies */}
          {comment.replies?.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  isOwner={false}
                  isInstructor={false}
                  onLike={onLike}
                  onDelete={onDelete}
                  onReport={onReport}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
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
  
  const currentLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Newest First';
  
  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 hover:border-purple-300 transition flex items-center gap-2'
      >
        Sort by: {currentLabel}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden'
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
                    : 'hover:bg-gray-50 text-gray-700'
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
  const totalReviews = comments.length;
  
  if (totalReviews === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-white border border-purple-100 mb-8'
    >
      <div className='text-center md:text-left'>
        <div className='text-5xl font-bold text-purple-600'>{averageRating.toFixed(1)}</div>
        <RatingStars rating={averageRating} size='md' />
        <p className='text-xs text-gray-500 mt-1'>Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
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
const CommentForm = ({ onSubmit, loading, user, isAuthenticated }) => {
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
      textareaRef.current?.focus();
    }
  };
  
  if (!isAuthenticated) {
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
          {user?.username?.slice(0, 2).toUpperCase() || 'U'}
        </div>
        
        <div className='flex-1'>
          <div className='mb-3'>
            <label className='text-sm font-medium text-gray-700 mb-1 block'>Your Rating</label>
            <RatingStars rating={rating} setRating={setRating} interactive size='md' />
          </div>
          
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError('');
            }}
            placeholder='Write your review... What did you think about this course?'
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
  const { user, isAuthenticated } = useAuth();  // ✅ Fixed: using useAuth instead of AppContext
  
  // State
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // Use mock data flag (set to false when backend is ready)
  const USE_MOCK_DATA = true;
  
  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        setComments(MOCK_COMMENTS);
      } else {
        // TODO: Replace with actual API call when backend is ready
        // const response = await getCourseComments(courseId);
        // if (response.success) setComments(response.data);
        setComments(MOCK_COMMENTS);
      }
      
      setLoading(false);
    };
    
    fetchComments();
  }, [courseId]);
  
  // Submit new comment
  const handleSubmit = useCallback(async (text, rating) => {
    setSubmitting(true);
    
    const newComment = {
      id: Date.now(),
      username: user?.username || 'Anonymous',
      userId: user?.id,
      text,
      rating,
      date: new Date().toISOString(),
      likes: 0,
      liked: false,
      replies: [],
    };
    
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setComments(prev => [newComment, ...prev]);
      setSubmitting(false);
      return true;
    }
    
    // TODO: Replace with actual API call when backend is ready
    // const response = await createComment(courseId, { text, rating });
    // if (response.success) setComments(prev => [response.data, ...prev]);
    
    setComments(prev => [newComment, ...prev]);
    setSubmitting(false);
    return true;
  }, [user, courseId]);
  
  // Like comment
  const handleLike = useCallback((commentId) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId
              ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
              : reply
          )
        };
      }
      return comment;
    }));
  }, []);
  
  // Delete comment
  const handleDelete = useCallback((commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  }, []);
  
  // Report comment
  const handleReport = useCallback((commentId) => {
    alert('Thank you for reporting. We will review this comment.');
    // TODO: Implement API call for reporting
  }, []);
  
  // Reply to comment
  const handleReply = useCallback((commentId, replyText) => {
    const newReply = {
      id: Date.now(),
      username: user?.username || 'Anonymous',
      userId: user?.id,
      text: replyText,
      date: new Date().toISOString(),
      likes: 0,
      liked: false,
    };
    
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    }));
  }, [user]);
  
  // Sort comments
  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    switch(sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'most-liked':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'highest-rated':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [comments, sortBy]);
  
  // Loading skeleton
  if (loading) {
    return (
      <div className="mt-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-100 rounded-xl mb-4"></div>
          <div className="h-24 bg-gray-100 rounded-xl mb-4"></div>
          <div className="h-24 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }
  
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
        isAuthenticated={isAuthenticated}
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
                isOwner={user?.username === comment.username || user?.id === comment.userId}
                isInstructor={comment.username?.toLowerCase().includes('instructor')}
                onLike={handleLike}
                onDelete={handleDelete}
                onReport={handleReport}
                onReply={handleReply}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Comments;