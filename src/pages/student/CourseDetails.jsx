import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';
import Comments from '../../components/student/Comments';

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [watchCourse, setWatchCourse] = useState(null);
  const [visible, setVisible] = useState(false);
  const contentRef = useRef(null);

  const {
    allCourses, coursesLoading,
    calculateRating, calculateNOfLectures,
    calculateChapterTime, calculateCourseDuration,
    currency,
  } = useContext(AppContext);

  useEffect(() => {
    if (allCourses.length > 0) {
      const found = allCourses.find((c) => c._id === id);
      setCourseData(found || null);
    }
  }, [id, allCourses]);

  // Fade-in on mount
  useEffect(() => {
    if (courseData) setTimeout(() => setVisible(true), 50);
  }, [courseData]);

  // IntersectionObserver for content sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('section-visible');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.section-animate').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  if (coursesLoading || !courseData) return <Loading />;

  const discountedPrice = (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2);
  const rating = calculateRating(courseData);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .hero-enter {
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .hero-enter.hero-visible {
          opacity: 1;
        }
        .left-col {
          animation: fadeUp 0.5s ease forwards;
        }
        .right-card {
          animation: slideInRight 0.5s ease 0.15s forwards;
          opacity: 0;
        }
        .section-animate {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .section-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .chapter-row {
          transition: background 0.15s ease;
        }
        .chapter-row:hover { background: #FAFAFA; }
        .enroll-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .enroll-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(83,74,183,0.3);
        }
        .preview-link {
          transition: color 0.15s;
        }
        .preview-link:hover { color: #3C3489; }
        .star-row img { transition: transform 0.1s ease; }
        .star-row img:hover { transform: scale(1.2); }
      `}</style>

      <div className={`hero-enter ${visible ? 'hero-visible' : ''}`}>

        {/* ── HERO BANNER ── */}
        <div
          className="relative w-full px-6 md:px-36 pt-24 md:pt-32 pb-10 text-left overflow-hidden"
          style={{ background: "linear-gradient(135deg, #f3f0ff 0%, #faf9ff 60%, white 100%)" }}
        >
          {/* Decorative blob */}
          <div style={{
            position: "absolute", top: -80, right: -80,
            width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(83,74,183,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="flex md:flex-row flex-col-reverse gap-10 items-start justify-between relative z-10">

            {/* ── LEFT COL ── */}
            <div className="left-col max-w-xl text-gray-600">
              <span
                className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 uppercase tracking-widest"
                style={{ background: "#EEEDFE", color: "#534AB7" }}
              >
                Course
              </span>

              <h1 className="md:text-4xl text-2xl font-semibold text-gray-800 leading-tight mb-4">
                {courseData.courseTitle}
              </h1>

              <p
                dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) + '...' }}
                className="text-sm md:text-base text-gray-500 mb-5"
              />

              {/* Rating row */}
              <div className="star-row flex items-center gap-2 mb-3 text-sm flex-wrap">
                <span className="font-semibold text-gray-800">{rating.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} className="w-4 h-4"
                      src={i < Math.floor(rating) ? assets.star : assets.star_blank} alt="" />
                  ))}
                </div>
                <span className="text-purple-600">
                  {courseData.courseRatings?.length} {courseData.courseRatings?.length === 1 ? 'review' : 'reviews'}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">
                  {courseData.enrolledStudents.length} {courseData.enrolledStudents.length === 1 ? 'student' : 'students'}
                </span>
              </div>

              <p className="text-sm">
                Course by <span className="text-purple-600 font-medium underline cursor-pointer">LoopLearn</span>
              </p>

              {/* Quick stats pills */}
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  { icon: assets.time_clock_icon, label: calculateCourseDuration(courseData) },
                  { icon: assets.lesson_icon, label: `${calculateNOfLectures(courseData)} lessons` },
                  { icon: assets.star, label: `${rating} rating` },
                ].map((s) => (
                  <div key={s.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                    style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.1)", color: "#5F5E5A" }}
                  >
                    <img src={s.icon} alt="" className="w-3.5 h-3.5" />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT CARD ── */}
            <div
              className="right-card rounded-2xl overflow-hidden w-full md:min-w-[320px] md:max-w-[360px]"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12)", background: "white" }}
            >
              {watchCourse ? (
                <YouTube
                  videoId={getYouTubeId(watchCourse.videoId) || watchCourse.videoId}
                  opts={{ playerVars: { autoplay: 1 } }}
                  iframeClassName="w-full aspect-video"
                  onEnd={() => setWatchCourse(null)}
                />
              ) : (
                <img src={courseData.courseThumbnail} alt="thumbnail"
                  className="w-full object-cover" style={{ aspectRatio: "16/9" }} />
              )}

              <div className="p-5">
                {/* Countdown */}
                <div className="flex items-center gap-2 mb-3">
                  <img src={assets.time_left_clock_icon} alt="" className="w-3.5" />
                  <p className="text-sm text-red-500">
                    <span className="font-semibold">5 days</span> left at this price
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-800">
                    {currency}{discountedPrice}
                  </span>
                  <span className="text-gray-400 line-through text-base">
                    {currency}{courseData.coursePrice}
                  </span>
                  <span
                    className="text-sm font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#EEEDFE", color: "#534AB7" }}
                  >
                    {courseData.discount}% off
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-5 flex-wrap">
                  <div className="flex items-center gap-1">
                    <img src={assets.star} alt="" className="w-4" />
                    <span>{rating}</span>
                  </div>
                  <div style={{ width: "0.5px", height: 14, background: "rgba(0,0,0,0.15)" }} />
                  <div className="flex items-center gap-1">
                    <img src={assets.time_clock_icon} alt="" className="w-4" />
                    <span>{calculateCourseDuration(courseData)}</span>
                  </div>
                  <div style={{ width: "0.5px", height: 14, background: "rgba(0,0,0,0.15)" }} />
                  <div className="flex items-center gap-1">
                    <img src={assets.lesson_icon} alt="" className="w-4" />
                    <span>{calculateNOfLectures(courseData)} lessons</span>
                  </div>
                </div>

                {/* Enroll button */}
                <button
                  className="enroll-btn w-full py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg, #534AB7 0%, #3C3489 100%)" }}
                >
                  {isAlreadyEnrolled ? "✓ Already Enrolled" : "Enroll Now"}
                </button>

                {/* Includes */}
                <div className="mt-5 pt-4" style={{ borderTop: "0.5px solid rgba(0,0,0,0.07)" }}>
                  <p className="text-sm font-semibold text-gray-800 mb-3">This course includes:</p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Lifetime access with free updates",
                      "Step-by-step, hands-on projects",
                      "Downloadable resources & source code",
                      "Quizzes to test your knowledge",
                      "Certificate of completion",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
                        <span style={{ color: "#534AB7", marginTop: 1 }}>✓</span>
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
        <div className="px-6 md:px-36 py-12 max-w-3xl" ref={contentRef}>

          {/* Course Structure */}
          <div className="section-animate mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Course Structure</h2>
            <div className="flex flex-col gap-2">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "0.5px solid rgba(0,0,0,0.09)", background: "white" }}
                >
                  <div
                    className="chapter-row flex items-center justify-between px-4 py-3.5 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "#EEEDFE" }}
                      >
                        <img
                          className={`w-3 transition-transform duration-200 ${openSections[index] ? 'rotate-180' : ''}`}
                          src={assets.down_arrow_icon} alt=""
                        />
                      </div>
                      <p className="font-medium text-sm text-gray-800">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0 ml-4">
                      {chapter.chapterContent.length} lectures · {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className="px-4 pb-3 pt-1 flex flex-col gap-1" style={{ borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <img src={assets.play_icon} alt="" className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-xs text-gray-700">{lecture.lectureTitle}</span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                            {lecture.isPreviewFree && (
                              <span
                                onClick={() => setWatchCourse({ videoId: lecture.lectureUrl.split('/').pop() })}
                                className="preview-link text-xs cursor-pointer font-medium"
                                style={{ color: "#534AB7" }}
                              >
                                Preview
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="section-animate mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Description</h2>
            <div
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
              className="rich-text text-sm text-gray-600 leading-relaxed"
            />
          </div>

          {/* ✅ Comments */}
          <div className="section-animate">
            <Comments courseId={id} />
          </div>

        </div>

      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;