import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import Footer from '../../components/student/Footer';
import { getCourseById } from '../../services/api/course.api';

// ─── Shimmer ──────────────────────────────────────────────────────────────────
const Shimmer = ({ style = {} }) => (
  <div style={{ background: "#EEEDFE", borderRadius: 8, overflow: "hidden", position: "relative", ...style }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%)",
      animation: "shimmer 1.5s infinite",
    }} />
  </div>
);

// ─── Star rating display ──────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="14" height="14" viewBox="0 0 24 24"
        fill={s <= Math.floor(rating) ? "#F59E0B" : "none"}
        stroke="#F59E0B" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

// ─── Time ago helper ──────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 30) return `${diff} days ago`;
  if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
  return `${Math.floor(diff / 365)} years ago`;
};

// ─── Avatar initials ──────────────────────────────────────────────────────────
const avatarColors = [
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#FEF3C7", color: "#92400E" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#FCE7F3", color: "#9D174D" },
  { bg: "#DBEAFE", color: "#1E40AF" },
];
const getAvatarColor = (name = "") =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const CourseDetails = () => {
  const { id } = useParams();
  const { currency } = useContext(AppContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({ 0: true });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  /* ── Fetch course from real API ── */
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getCourseById(id);
        setCourse(res.data);
        setTimeout(() => setVisible(true), 50);
      } catch (err) {
        setError(err.response?.status === 404
          ? "Course not found."
          : "Failed to load course. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  /* ── IntersectionObserver for section animations ── */
  useEffect(() => {
    if (!course) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("section-visible");
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".section-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [course]);

  if (loading) return <Loading />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl mb-2">😕</p>
        <p className="text-gray-500">{error}</p>
      </div>
    </div>
  );

  // ✅ Handle both: int enum (0/1/2) if backend sends ints, or string if JsonStringEnumConverter is configured
  const LEVEL_LABELS = { 0: "Beginner", 1: "Intermediate", 2: "Advanced" };
  const levelLabel = typeof course.level === "number"
    ? (LEVEL_LABELS[course.level] ?? "Unknown")
    : (course.level ?? "Unknown");                // already a string e.g. "Beginner"
  const levelColors = {
    Beginner:     { bg: "#D1FAE5", color: "#065F46" },
    Intermediate: { bg: "#FEF3C7", color: "#92400E" },
    Advanced:     { bg: "#FCE7F3", color: "#9D174D" },
  };
  const levelStyle = levelColors[levelLabel] || { bg: "#EEEDFE", color: "#534AB7" };

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        .hero-enter { opacity:0; transition:opacity 0.5s ease; }
        .hero-enter.visible { opacity:1; }
        .left-col { animation:fadeUp 0.5s ease forwards; }
        .right-card { animation:slideInRight 0.55s ease 0.1s forwards; opacity:0; }
        .section-animate { opacity:0; transform:translateY(16px); transition:opacity 0.45s ease,transform 0.45s ease; }
        .section-visible { opacity:1; transform:translateY(0); }
        .lesson-row { transition:background 0.15s ease; }
        .lesson-row:hover { background:#F5F4FF; }
        .enroll-btn { transition:transform 0.2s ease,box-shadow 0.2s ease; }
        .enroll-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(83,74,183,0.3); }
        .comment-card { transition:box-shadow 0.2s ease,transform 0.2s ease; }
        .comment-card:hover { box-shadow:0 4px 16px rgba(83,74,183,0.08); transform:translateY(-1px); }
      `}</style>

      <div className={`hero-enter ${visible ? "visible" : ""}`}>

        {/* ── HERO BANNER ── */}
        <div
          className="relative w-full px-6 md:px-36 pt-24 md:pt-32 pb-12 text-left overflow-hidden"
          style={{ background: "linear-gradient(135deg,#f3f0ff 0%,#faf9ff 60%,white 100%)" }}
        >
          {/* Decorative blob */}
          <div style={{
            position: "absolute", top: -100, right: -100,
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(83,74,183,0.1) 0%,transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="flex md:flex-row flex-col-reverse gap-10 items-start justify-between relative z-10">

            {/* ── LEFT ── */}
            <div className="left-col flex-1 max-w-2xl">

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full uppercase tracking-widest"
                  style={{ background: "#EEEDFE", color: "#534AB7" }}
                >
                  {course.category}
                </span>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: levelStyle.bg, color: levelStyle.color }}
                >
                  {levelLabel}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 leading-tight mb-4">
                {course.title}
              </h1>

              <p className="text-sm md:text-base text-gray-500 mb-5 leading-relaxed">
                {course.description?.slice(0, 220)}
                {course.description?.length > 220 ? "..." : ""}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="font-semibold text-gray-800 text-sm">
                  {course.rating?.toFixed(1)}
                </span>
                <Stars rating={course.rating} />
                <span className="text-sm" style={{ color: "#534AB7" }}>
                  {course.comments?.length || 0} reviews
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-5">
                {course.instructorAvatar ? (
                  <img src={course.instructorAvatar} alt=""
                    className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ background: "#EEEDFE", color: "#534AB7" }}>
                    {course.instructorName?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400">Instructor</p>
                  <p className="text-sm font-medium text-gray-700">{course.instructorName}</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: course.duration ? `${Math.floor(course.duration / 60)}h ${course.duration % 60}m` : "—", icon: "🕐" },  // ✅ FIX: duration is minutes as int
                  { label: `${course.lessons?.length || 0} lessons`, icon: "📚" },
                  { label: levelLabel, icon: "📊" },
                  { label: `Updated ${timeAgo(course.lastUpdatedAt)}`, icon: "🔄" },
                ].map((s) => (
                  <div key={s.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                    style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.1)", color: "#5F5E5A" }}
                  >
                    <span>{s.icon}</span> {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT CARD ── */}
            <div
              className="right-card w-full md:w-80 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12)", background: "white" }}
            >
              {/* Thumbnail */}
              <div className="w-full aspect-video overflow-hidden" style={{ background: "#EEEDFE" }}>
                {course.avatar ? (
                  <img src={course.Avatar} alt={course.title}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
                )}
              </div>

              <div className="p-5">
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-800">
                    {currency}{course.price?.toFixed(2)}
                  </span>
                </div>

                {/* Enroll */}
                <button
                  className="enroll-btn w-full py-3 rounded-xl text-white font-semibold text-sm mb-4"
                  style={{ background: "linear-gradient(135deg,#534AB7 0%,#3C3489 100%)" }}
                >
                  {isEnrolled ? "✓ Already Enrolled" : "Enroll Now"}
                </button>

                {/* Includes */}
                <div className="pt-4" style={{ borderTop: "0.5px solid rgba(0,0,0,0.07)" }}>
                  <p className="text-sm font-semibold text-gray-800 mb-3">This course includes:</p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Lifetime access with free updates",
                      "Step-by-step, hands-on projects",
                      "Downloadable resources & source code",
                      "Certificate of completion",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
                        <span style={{ color: "#534AB7" }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="px-6 md:px-36 py-12">
          <div className="max-w-3xl flex flex-col gap-12">

            {/* Lessons list */}
            <div className="section-animate">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">
                Course Content
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({course.lessons?.length || 0} lessons)
                </span>
              </h2>
              <div className="flex flex-col gap-2">
                {course.lessons?.length > 0 ? (
                  course.lessons.map((lesson, i) => (
                    <div
                      key={i}
                      className="lesson-row flex items-center gap-4 px-4 py-3.5 rounded-xl"
                      style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                        style={{ background: "#EEEDFE", color: "#534AB7" }}
                      >
                        {lesson.number}
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{lesson.title}</p>
                      <span className="text-xs" style={{ color: "#B4B2A9" }}>Lesson {lesson.number}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No lessons available yet.</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="section-animate">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Course</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
            </div>

            {/* Instructor */}
            <div className="section-animate">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">Your Instructor</h2>
              <div
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.08)" }}
              >
                {course.instructorAvatar ? (
                  <img src={course.instructorAvatar} alt=""
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0"
                    style={{ background: "#EEEDFE", color: "#534AB7" }}
                  >
                    {course.instructorName?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800 mb-1">{course.instructorName}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {course.instructorBio || "No bio available."}
                  </p>
                </div>
              </div>
            </div>

            {/* ── COMMENTS (read-only) ── */}
            <div className="section-animate">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Student Reviews
                <span
                  className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full"
                  style={{ background: "#EEEDFE", color: "#534AB7" }}
                >
                  {course.comments?.length || 0}
                </span>
              </h2>

              {/* Rating summary */}
              {course.rating > 0 && (
                <div className="flex items-center gap-3 mb-6 p-4 rounded-xl"
                  style={{ background: "#FAFAFA", border: "0.5px solid rgba(0,0,0,0.07)" }}>
                  <span className="text-4xl font-bold" style={{ color: "#534AB7" }}>
                    {course.rating?.toFixed(1)}
                  </span>
                  <div>
                    <Stars rating={course.rating} />
                    <p className="text-xs text-gray-400 mt-1">Course Rating</p>
                  </div>
                </div>
              )}

              {/* Comments list */}
              {course.comments?.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {course.comments.map((comment, i) => {
                    const color = getAvatarColor(comment.studentName || "S");
                    return (
                      <div
                        key={i}
                        className="comment-card p-4 rounded-2xl"
                        style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.07)" }}
                      >
                        <div className="flex gap-3">
                          {comment.avatar ? (
                            <img src={comment.avatar} alt=""
                              className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                              style={{ background: color.bg, color: color.color }}
                            >
                              {comment.studentName?.slice(0, 2).toUpperCase() || "ST"}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-800">
                                {comment.studentName}
                              </span>
                              <span className="text-xs flex-shrink-0" style={{ color: "#B4B2A9" }}>
                                {timeAgo(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10" style={{ color: "#B4B2A9" }}>
                  <p className="text-3xl mb-2">💬</p>
                  <p className="text-sm">No reviews yet for this course.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;