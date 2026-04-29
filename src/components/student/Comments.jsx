import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

// Dummy initial comments
const DUMMY_COMMENTS = [
  {
    id: 1,
    username: "sara_dev",
    initials: "SA",
    text: "This course is absolutely amazing! The instructor explains everything so clearly.",
    date: "2025-03-12",
    likes: 14,
    liked: false,
  },
  {
    id: 2,
    username: "mohamedx",
    initials: "MO",
    text: "Great content, really helped me understand the concepts. Highly recommended!",
    date: "2025-03-18",
    likes: 8,
    liked: false,
  },
  {
    id: 3,
    username: "nour_learns",
    initials: "NO",
    text: "I was stuck on this topic for weeks. After this course everything clicked!",
    date: "2025-04-01",
    likes: 22,
    liked: false,
  },
];

const avatarColors = [
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#FEF3C7", color: "#92400E" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#FCE7F3", color: "#9D174D" },
  { bg: "#DBEAFE", color: "#1E40AF" },
];

const getColor = (username) =>
  avatarColors[username.charCodeAt(0) % avatarColors.length];

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 30) return `${diff} days ago`;
  if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
  return `${Math.floor(diff / 365)} years ago`;
};

const Comments = ({ courseId }) => {
  const { user } = useContext(AppContext);
  const [comments, setComments] = useState(DUMMY_COMMENTS);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) { setError("Comment cannot be empty"); return; }
    if (!user) { setError("You must be logged in to comment"); return; }
    setError("");
    setSubmitting(true);

    // Simulate API call — wire to POST /api/comments when backend is ready
    await new Promise((r) => setTimeout(r, 600));

    const newComment = {
      id: Date.now(),
      username: user.username,
      initials: user.username.slice(0, 2).toUpperCase(),
      text: text.trim(),
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      liked: false,
    };

    setComments((prev) => [newComment, ...prev]);
    setText("");
    setSubmitting(false);
  };

  const handleLike = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleDelete = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="mt-10 pt-10" style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
      <style>{`
        .comment-card {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .comment-card:hover {
          box-shadow: 0 4px 16px rgba(83,74,183,0.08);
          transform: translateY(-1px);
        }
        .like-btn:hover { color: #534AB7; }
        .comment-input:focus {
          border: 1px solid #534AB7 !important;
          box-shadow: 0 0 0 3px #EEEDFE;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Comments
            <span
              className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full"
              style={{ background: "#EEEDFE", color: "#534AB7" }}
            >
              {comments.length}
            </span>
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">Share your thoughts about this course</p>
        </div>
      </div>

      {/* Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            {/* User avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5"
              style={{ background: "#EEEDFE", color: "#534AB7" }}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setError(""); }}
                placeholder="Write your comment..."
                rows={3}
                className="comment-input w-full px-4 py-3 text-sm rounded-xl outline-none resize-none"
                style={{
                  border: "0.5px solid rgba(0,0,0,0.12)",
                  background: "#FAFAFA",
                  color: "#2C2C2A",
                  transition: "border 0.15s, box-shadow 0.15s",
                }}
              />
              {error && (
                <p className="text-xs mt-1" style={{ color: "#A32D2D" }}>{error}</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs" style={{ color: "#B4B2A9" }}>
                  {text.length}/500 characters
                </p>
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: "#534AB7" }}
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div
          className="mb-8 p-4 rounded-xl text-sm text-center"
          style={{ background: "#EEEDFE", border: "0.5px solid #AFA9EC", color: "#534AB7" }}
        >
          Please <a href="/signin" className="font-medium underline">sign in</a> to leave a comment.
        </div>
      )}

      {/* Comments list */}
      <div className="flex flex-col gap-4">
        {comments.length === 0 && (
          <div className="text-center py-10" style={{ color: "#B4B2A9" }}>
            <p className="text-3xl mb-2">💬</p>
            <p className="text-sm">No comments yet. Be the first!</p>
          </div>
        )}

        {comments.map((comment) => {
          const color = getColor(comment.username);
          const isOwner = user?.username === comment.username;

          return (
            <div
              key={comment.id}
              className="comment-card p-4 rounded-2xl"
              style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.07)" }}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: color.bg, color: color.color }}
                >
                  {comment.initials}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">
                        @{comment.username}
                      </span>
                      {isOwner && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "#EEEDFE", color: "#534AB7" }}
                        >
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: "#B4B2A9" }}>
                      {timeAgo(comment.date)}
                    </span>
                  </div>

                  {/* Comment text */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {comment.text}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="like-btn flex items-center gap-1.5 text-xs transition"
                      style={{ color: comment.liked ? "#534AB7" : "#888780" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24"
                        fill={comment.liked ? "#534AB7" : "none"}
                        stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {comment.likes > 0 && comment.likes}
                      {comment.likes === 0 ? "Like" : ""}
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs transition hover:text-red-500"
                        style={{ color: "#B4B2A9" }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;