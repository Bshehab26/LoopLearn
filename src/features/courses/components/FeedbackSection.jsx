import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../store/AppProvider';
import { getCourseFeedbacks, addOrUpdateFeedback, deleteFeedback } from '../api/course.api';
import RatingStars from './RatingStars';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import Modal from '../../../shared/components/Modal';

const FeedbackSection = ({ courseId }) => {
  const { user, isAuthenticated } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFeedback, setUserFeedback] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'info' });
  const showModal = (title, message, onConfirm = null, type = 'info') =>
    setModal({ isOpen: true, title, message, onConfirm, type });
  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null, type: 'info' });

  const fetchFeedbacks = async () => {
    try {
      const response = await getCourseFeedbacks(courseId);
      if (response.success) {
        const data = response.data || [];
        setFeedbacks(data);

        // Determine if the current user has already given feedback
        if (user && user.id) {
          const own = data.find(f => f.studentId === user.id);
          setUserFeedback(own || null);
          setHasRated(!!own);
          if (own) {
            setRating(own.rating);
            setComment(own.comment);
          } else {
            setRating(5);
            setComment('');
          }
        }
      }
    } catch (err) {
      console.error(err);
      showModal('Error', 'Failed to load feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showModal('Sign in required', 'Please sign in to leave feedback.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await addOrUpdateFeedback(courseId, rating, comment);
      if (response.success) {
        await fetchFeedbacks();
        setEditing(false);
      } else {
        showModal('Error', response.message || 'Failed to submit feedback.');
      }
    } catch (err) {
      showModal('Error', 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    showModal(
      'Delete Feedback',
      'Are you sure you want to delete your feedback?',
      async () => {
        try {
          const response = await deleteFeedback(courseId);
          if (response.success) {
            await fetchFeedbacks();
            setUserFeedback(null);
            setHasRated(false);
            setRating(5);
            setComment('');
            setEditing(false);
          } else {
            showModal('Error', response.message || 'Failed to delete feedback.');
          }
        } catch (err) {
          showModal('Error', 'Failed to delete feedback.');
        }
        closeModal();
      },
      'danger'
    );
  };

  const handleEdit = () => {
    setEditing(true);
    if (userFeedback) {
      setRating(userFeedback.rating);
      setComment(userFeedback.comment);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    if (userFeedback) {
      setRating(userFeedback.rating);
      setComment(userFeedback.comment);
    } else {
      setRating(5);
      setComment('');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-xl"></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Feedback</h2>

      {feedbacks.length === 0 && !hasRated && (
        <p className="text-gray-500 text-sm mb-6">No feedback yet. Be the first to share your thoughts!</p>
      )}

      <div className="space-y-4 mb-8">
        {feedbacks.map((fb, idx) => {
          const isOwn = user && user.id && fb.studentId === user.id;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`bg-gray-50 p-4 rounded-xl border ${isOwn ? 'border-purple-200 bg-purple-50/30' : 'border-gray-100'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {fb.avatar ? (
                    <img
                      src={fb.avatar}
                      alt={fb.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-semibold">
                      {fb.username?.slice(0, 2).toUpperCase() || '??'}
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-800">{fb.username}</span>
                    {isOwn && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                        You
                      </span>
                    )}
                    <RatingStars rating={fb.rating} size="sm" showLabel />
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(fb.postedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{fb.comment}</p>
            </motion.div>
          );
        })}
      </div>

      {/* User's own feedback form / display */}
      {isAuthenticated && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          {hasRated && userFeedback && !editing ? (
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-800">Your Feedback</span>
                  <RatingStars rating={userFeedback.rating} size="sm" showLabel />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="text-sm text-purple-600 hover:text-purple-700 transition flex items-center gap-1"
                  >
                    <HiOutlinePencil size={14} /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1"
                  >
                    <HiOutlineTrash size={14} /> Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{userFeedback.comment}</p>
            </div>
          ) : (
            // Show form if user hasn't rated or is editing
            (!hasRated || editing) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <RatingStars rating={rating} setRating={setRating} interactive size="md" />
                </div>
                <div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this course..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {submitting
                      ? 'Saving...'
                      : editing
                      ? 'Update Feedback'
                      : 'Post Feedback'}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )
          )}
        </div>
      )}

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

export default FeedbackSection;