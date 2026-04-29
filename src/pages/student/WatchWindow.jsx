import humanizeDuration from "humanize-duration";
import React, { useEffect, useState, useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Comments from "../../components/student/Comments";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Shimmer = ({ style = {} }) => (
  <div style={{ background: "#EEEDFE", borderRadius: 8, overflow: "hidden", position: "relative", ...style }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      animation: "shimmer 1.5s infinite",
    }} />
  </div>
);

const WatchWindowSkeleton = () => (
  <div className="p-4 sm:p-10 grid md:grid-cols-2 gap-10 md:px-36">
    <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Shimmer style={{ height: 24, width: 180, marginBottom: 8 }} />
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1 }}>
            <Shimmer style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0 }} />
            <Shimmer style={{ height: 14, flex: 1, maxWidth: 200 }} />
          </div>
          <Shimmer style={{ height: 13, width: 100 }} />
        </div>
      ))}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
      <Shimmer style={{ width: "100%", aspectRatio: "16/9", borderRadius: 12 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Shimmer style={{ height: 16, width: "55%" }} />
        <Shimmer style={{ height: 14, width: 120 }} />
      </div>
    </div>
  </div>
);
// ──────────────────────────────────────────────────────────────────────────────

const WatchWindow = () => {
  const { enrolledCourses, enrolledLoading, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseDetails, setCourseDetails] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [watchCourse, setWatchCourse] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [visible, setVisible] = useState(false);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    setCourseDetails(course || null);
  }, [courseId, enrolledCourses]);

  useEffect(() => {
    if (courseDetails?.courseContent?.length > 0) {
      const first = courseDetails.courseContent[0].chapterContent[0];
      setWatchCourse({ ...first, chapter: 1, lecture: 1 });
      setOpenSections({ 0: true });
      setTimeout(() => setVisible(true), 50);
    }
  }, [courseDetails]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const markComplete = () => {
    if (watchCourse) {
      setCompleted((prev) => new Set([...prev, watchCourse.lectureTitle]));
    }
  };

  const isCompleted = (title) => completed.has(title);

  if (enrolledLoading) return <WatchWindowSkeleton />;

  if (!courseDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  const videoId = getYouTubeId(watchCourse?.lectureUrl);
  const totalLectures = courseDetails.courseContent.reduce(
    (sum, ch) => sum + ch.chapterContent.length, 0
  );
  const progressPercent = Math.round((completed.size / totalLectures) * 100);

  return (
    <>
      <style>{`
        .watch-container { opacity: 0; transition: opacity 0.4s ease; }
        .watch-container.visible { opacity: 1; }
        .lecture-item { transition: background 0.15s ease; border-radius: 8px; cursor: pointer; }
        .lecture-item:hover { background: #F5F4FF; }
        .lecture-item.active { background: #EEEDFE; }
        .chapter-header { transition: background 0.15s ease; cursor: pointer; }
        .chapter-header:hover { background: #FAFAFA; }
        .complete-btn { transition: all 0.2s ease; }
        .complete-btn:hover:not(:disabled) { background: #534AB7; color: white; }
      `}</style>

      <div className={`watch-container ${visible ? 'visible' : ''}`}>

        {/* ── PROGRESS BAR ── */}
        <div
          className="sticky top-16 z-40 px-6 md:px-10 py-3 flex items-center gap-4"
          style={{ background: "white", borderBottom: "0.5px solid rgba(0,0,0,0.07)" }}
        >
          <p className="text-sm font-medium text-gray-700 truncate flex-1">
            {courseDetails.courseTitle}
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: "#EEEDFE" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%`, background: "#534AB7" }}
              />
            </div>
            <span className="text-xs font-medium" style={{ color: "#534AB7" }}>
              {completed.size}/{totalLectures}
            </span>
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="grid md:grid-cols-[1fr_320px]">

          {/* LEFT: VIDEO + COMMENTS */}
          <div className="p-6 md:p-10 border-r" style={{ borderColor: "rgba(0,0,0,0.07)" }}>

            {/* Video */}
            <div className="rounded-2xl overflow-hidden mb-5" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
              {watchCourse && videoId ? (
                <YouTube videoId={videoId} iframeClassName="w-full aspect-video" opts={{ playerVars: { autoplay: 1 } }} />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center" style={{ background: "#1a1a2e" }}>
                  <p className="text-white/50 text-sm">Select a lecture to start</p>
                </div>
              )}
            </div>

            {/* Lecture meta */}
            {watchCourse && (
              <div
                className="flex items-start justify-between gap-4 mb-8 p-4 rounded-xl"
                style={{ background: "#FAFAFA", border: "0.5px solid rgba(0,0,0,0.07)" }}
              >
                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    {watchCourse.chapter}.{watchCourse.lecture} {watchCourse.lectureTitle}
                  </p>
                  <p className="text-xs text-gray-400">
                    {humanizeDuration(watchCourse.lectureDuration * 60 * 1000, { units: ["h", "m"] })}
                  </p>
                </div>
                <button
                  onClick={markComplete}
                  disabled={isCompleted(watchCourse.lectureTitle)}
                  className="complete-btn flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition"
                  style={
                    isCompleted(watchCourse.lectureTitle)
                      ? { background: "#D1FAE5", color: "#065F46", border: "0.5px solid #6EE7B7" }
                      : { border: "0.5px solid #534AB7", color: "#534AB7" }
                  }
                >
                  {isCompleted(watchCourse.lectureTitle) ? "✓ Completed" : "Mark as Complete"}
                </button>
              </div>
            )}

            {/* Comments */}
            <Comments courseId={courseId} />
          </div>

          {/* RIGHT: COURSE STRUCTURE */}
          <div
            className="hidden md:block overflow-y-auto bg-white"
            style={{ maxHeight: "calc(100vh - 120px)", position: "sticky", top: "120px", borderLeft: "0.5px solid rgba(0,0,0,0.07)" }}
          >
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 px-2">Course Content</h3>

              {courseDetails.courseContent.map((chapter, index) => (
                <div key={index} className="mb-1">
                  <div
                    className="chapter-header flex items-center justify-between px-3 py-2.5 rounded-lg select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <img
                        className={`w-3 flex-shrink-0 transition-transform duration-200 ${openSections[index] ? 'rotate-180' : ''}`}
                        src={assets.down_arrow_icon} alt=""
                      />
                      <p className="text-xs font-semibold text-gray-700 truncate">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {chapter.chapterContent.length}
                    </span>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className="pl-4 pr-2 pb-2 flex flex-col gap-0.5">
                      {chapter.chapterContent.map((lecture, i) => {
                        const isActive = watchCourse?.lectureTitle === lecture.lectureTitle;
                        const done = isCompleted(lecture.lectureTitle);

                        return (
                          <div
                            key={i}
                            onClick={() => setWatchCourse({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                            className={`lecture-item flex items-start gap-2 px-2 py-2 ${isActive ? 'active' : ''}`}
                          >
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{
                                background: done ? "#D1FAE5" : isActive ? "#EEEDFE" : "#F1F0F0",
                                border: isActive ? "1.5px solid #534AB7" : "none",
                              }}
                            >
                              <span style={{ color: done ? "#065F46" : isActive ? "#534AB7" : "#B4B2A9", fontSize: 7 }}>
                                {done ? "✓" : "▶"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs leading-relaxed"
                                style={{ color: isActive ? "#534AB7" : done ? "#888780" : "#444441", fontWeight: isActive ? 500 : 400 }}
                              >
                                {lecture.lectureTitle}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: "#B4B2A9" }}>
                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WatchWindow;