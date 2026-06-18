// src/features/courses/components/Comments.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../store/AppProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHeart, HiOutlineChat, HiOutlineFlag,
  HiOutlineCheckCircle, HiOutlinePencil, HiOutlineTrash
} from 'react-icons/hi';
import { getLessonComments, addLessonComment, deleteComment, updateComment } from '../api/course.api';
import RatingStars from './RatingStars';
import Modal from '../../../shared/components/Modal'; // ✅ import Modal

// ============================================================================
// Constants & Helpers
// ============================================================================

const AVATAR_COLORS = [
  { bg: '#EEEDFE', color: '#534AB7' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#D1FAE5', color: '#065F46' },
  { bg: '#FCE7F3', color: '#9D174D' },
  { bg: '#DBEAFE', color: '#1E40AF' },
];

const getAvatarColor = (username) => {
  if (!username) return AVATAR_COLORS[0];
  const index = username.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const getUserInitials = (username) => {
  if (!username) return '??';
  return username.slice(0, 2).toUpperCase();
};

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

// ============================================================================
// Subcomponents
// ============================================================================

const CommentItem = ({
  comment,
  depth = 0,
  isOwner,
  onDelete,
  onReport,
  onReply,
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  const color = getAvatarColor(comment.studentFullName);
  const initials = getUserInitials(comment.studentFullName);
  const needsTruncation = comment.comment?.length > 200;
  const displayText = !isExpanded && needsTruncation
    ? `${comment.comment.slice(0, 200)}...`
    : comment.comment;

  const handleSubmitReply = () => {
    if (replyText.trim() && onReply) {
      onReply(comment.id, replyText.trim());
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onEdit) {
      onEdit(comment.id, editText.trim());
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="comment-item"
      style={{ marginLeft: depth > 0 ? 40 : 0 }}
    >
      <div className="flex gap-3 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
          style={{ background: color.bg, color: color.color }}
        >
          {comment.studentImage ? (
            <img src={comment.studentImage} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-800">
                {comment.studentFullName || 'Anonymous'}
              </span>
              {isOwner && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                  You
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {timeAgo(comment.createdAt)}
              {comment.updatedAt && ' (edited)'}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap mt-1">
              {displayText}
            </p>
          )}

          {needsTruncation && !isEditing && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-purple-600 hover:text-purple-700 mt-1 font-medium"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}

          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-500 transition"
            >
              <HiOutlineChat size={13} /> Reply
            </button>

            {isOwner && !isEditing && (
              <>
                <button
                  onClick={() => { setIsEditing(true); setEditText(comment.comment); }}
                  className="text-xs text-gray-400 hover:text-purple-500 transition"
                >
                  <HiOutlinePencil size={13} />
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition"
                >
                  <HiOutlineTrash size={13} />
                </button>
              </>
            )}

            {!isOwner && (
              <button
                onClick={() => onReport(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition"
              >
                <HiOutlineFlag size={13} /> Report
              </button>
            )}
          </div>

          <AnimatePresence>
            {showReplyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-gray-100"
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

          {/* Render replies recursively */}
          {comment.replies?.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  isOwner={reply.studentId === comment.studentId} // adjust based on user
                  onDelete={onDelete}
                  onReport={onReport}
                  onReply={onReply}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const Comments = ({ lessonId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  // ✅ modal state
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'info' });

  const showModal = (title, message, onConfirm = null, type = 'info') => {
    setModal({ isOpen: true, title, message, onConfirm, type });
  };

  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null, type: 'info' });

  const fetchComments = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const response = await getLessonComments(lessonId);
      if (response.success) {
        setComments(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (text, parentId = null) => {
    if (!isAuthenticated) {
      showModal('Sign in required', 'Please sign in to comment.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await addLessonComment(lessonId, text, parentId);
      if (response.success) {
        await fetchComments();
        setNewComment('');
        return true;
      } else {
        showModal('Error', response.message);
        return false;
      }
    } catch (err) {
      showModal('Error', 'Failed to add comment.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    showModal(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      async () => {
        try {
          const response = await deleteComment(commentId);
          if (response.success) {
            await fetchComments();
          } else {
            showModal('Error', response.message);
          }
        } catch (err) {
          showModal('Error', 'Failed to delete.');
        }
        closeModal();
      },
      'danger'
    );
  };

  const handleUpdate = async (commentId, newText) => {
    try {
      const response = await updateComment(commentId, newText);
      if (response.success) {
        await fetchComments();
      } else {
        showModal('Error', response.message);
      }
    } catch (err) {
      showModal('Error', 'Failed to update.');
    }
  };

  const handleReply = async (parentId, text) => {
    await handleAddComment(text, parentId);
  };

  const handleLike = (commentId) => {
    console.log('Like comment', commentId);
  };

  const handleReport = (commentId) => {
    showModal('Report Sent', 'Thank you for reporting. We will review this comment.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError('');
    const success = await handleAddComment(newComment);
    if (success) setNewComment('');
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-100 rounded-xl"></div>
        <div className="h-24 bg-gray-100 rounded-xl"></div>
        <div className="h-24 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Comments
          <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
            {comments.length}
          </span>
        </h3>
      </div>

      {/* Comment form */}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-purple-100 text-purple-600">
              {user?.username?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments list */}
      <AnimatePresence mode="wait">
        {comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            No comments yet. Be the first to share your thoughts!
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isOwner={comment.studentId === user?.id}
                onLike={handleLike}
                onDelete={handleDelete}
                onReport={handleReport}
                onReply={handleReply}
                onEdit={handleUpdate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        type={modal.type}
        confirmText={modal.type === 'danger' ? 'Delete' : 'OK'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default Comments;