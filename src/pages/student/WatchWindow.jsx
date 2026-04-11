import humanizeDuration from "humanize-duration";
import React, { useEffect, useState, useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/Appcontext";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";

const WatchWindow = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseDetails, setCourseDetails] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [watchCourse, setWatchCourse] = useState(null);

  // ✅ safer YouTube ID extraction
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const getCourseDetails = () => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    setCourseDetails(course);
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    getCourseDetails();
  }, [courseId, enrolledCourses]);

  // ✅ auto load first lecture
  useEffect(() => {
    if (courseDetails?.courseContent?.length > 0) {
      const firstLecture =
        courseDetails.courseContent[0].chapterContent[0];

      setWatchCourse({
        ...firstLecture,
        chapter: 1,
        lecture: 1,
      });
    }
  }, [courseDetails]);

  if (!courseDetails) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  const videoId = getYouTubeId(watchCourse?.lectureUrl);

  return (
    <>
      <div className="p-4 sm:p-10 grid md:grid-cols-2 gap-10 md:px-36">
        
        {/* LEFT */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {courseDetails.courseContent.map((chapter, index) => (
              <div
                className="border border-gray-300 bg-white mb-2 rounded shadow-sm"
                key={index}
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-gray-50"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className={`transition-transform ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                      src={assets.down_arrow_icon}
                      alt=""
                    />
                    <p className="font-medium text-sm md:text-base">
                      {chapter.chapterTitle}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {chapter.chapterContent.length} lectures •{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t">
                    {chapter.chapterContent.map((lecture, i) => {
                      const isActive =
                        watchCourse?.lectureTitle === lecture.lectureTitle;

                      return (
                        <li
                          key={i}
                          className={`flex items-start justify-between py-2 px-2 rounded ${
                            isActive ? "bg-purple-50" : ""
                          }`}
                        >
                          <div className="flex gap-2">
                            <img
                              src={
                                isActive
                                  ? assets.blue_tick_icon
                                  : assets.play_icon
                              }
                              className="w-4 h-4 mt-1"
                              alt=""
                            />
                            <p className="text-xs md:text-sm">
                              {lecture.lectureTitle}
                            </p>
                          </div>

                          <div className="flex gap-2 items-center">
                            {lecture.lectureUrl && (
                              <button
                                onClick={() =>
                                  setWatchCourse({
                                    ...lecture,
                                    chapter: index + 1,
                                    lecture: i + 1,
                                  })
                                }
                                className="text-purple-800 text-xs hover:underline"
                              >
                                Watch
                              </button>
                            )}

                            <span className="text-xs text-gray-500">
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:mt-10">
          {watchCourse && videoId ? (
            <div>
              <YouTube
                videoId={videoId}
                iframeClassName="w-full aspect-video rounded"
              />

              <div className="flex justify-between items-center mt-2">
                <p className="text-sm md:text-base font-medium">
                  {watchCourse.chapter}.{watchCourse.lecture}{" "}
                  {watchCourse.lectureTitle}
                </p>

                <button className="text-purple-900 text-sm">
                  Mark as Complete
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseDetails.courseThumbnail}
              className="rounded shadow"
              alt=""
            />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default WatchWindow;