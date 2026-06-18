// src/features/courses/pages/WatchWindow.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWatchContent, updateLessonProgress } from "../api/course.api";
import Comments from "../components/Comments";
import QuizView from "../components/QuizView";
import VideoPlayer from "../components/VideoPlayer";
import CourseContentSidebar from "../components/CourseContentSidebar";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import FeedbackSection from "../components/FeedbackSection";
import WatchWindowSkeleton from "../components/WatchWindowSkeleton";
import {
  getYouTubeId,
  formatDuration,
  parseDurationToSeconds,
} from "../../../shared/utils/helpers";
import { motion } from "framer-motion";

const WatchWindow = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [currentItem, setCurrentItem] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [serverProgress, setServerProgress] = useState(0);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [viewMode, setViewMode] = useState('content');

  // Compute total items
  const totalItems = useMemo(() => {
    if (!course?.sections) return 0;
    return course.sections.reduce(
      (acc, s) => acc + s.lessons.length + s.quizzes.length,
      0
    );
  }, [course]);

  // Compute local progress percentage from completedItems
  const localProgress = useMemo(() => {
    if (totalItems === 0) return 0;
    return Math.round((completedItems.size / totalItems) * 100);
  }, [completedItems, totalItems]);

  // Use server progress if available, else local
  const displayProgress = serverProgress > 0 ? serverProgress : localProgress;

  // ── Helper: update lesson progress locally in course state ──────────────
  const updateLessonProgressLocally = useCallback((lessonId, lastSecond, totalSeconds) => {
    setCourse(prevCourse => {
      if (!prevCourse) return prevCourse;
      const newCourse = { ...prevCourse };
      // Find the lesson and update its progress
      for (const section of newCourse.sections) {
        for (const lesson of section.lessons) {
          if (lesson.id === lessonId) {
            const watchedPercent = totalSeconds > 0 ? (lastSecond / totalSeconds) * 100 : 0;
            const isCompleted = watchedPercent >= 90; // 90% threshold
            lesson.progress = {
              ...lesson.progress,
              lastSecondWatched: lastSecond,
              watchedPercentage: Math.min(watchedPercent, 100),
              isCompleted: isCompleted || lesson.progress?.isCompleted || false,
            };
            // If completed, add to completedItems
            if (isCompleted) {
              setCompletedItems(prev => new Set(prev).add(lessonId));
            }
            break;
          }
        }
      }
      return newCourse;
    });
  }, []);

  // ── Fetch course data ────────────────────────────────────────────────────
  const fetchCourse = useCallback(async () => {
    if (!courseId) {
      setError("Invalid course ID");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await getWatchContent(courseId);
      if (response.success) {
        const data = response.data;
        setCourse(data);
        setServerProgress(data.progressPercentage);
        setIsCourseCompleted(data.isCompleted);

        const completed = new Set();
        data.sections.forEach((section) => {
          section.lessons.forEach((lesson) => {
            if (lesson.progress?.isCompleted) completed.add(lesson.id);
          });
          section.quizzes.forEach((quiz) => {
            if (quiz.previousAttempt?.isPassed) completed.add(quiz.id);
          });
        });
        setCompletedItems(completed);

        // Resume point
        let resumeItem = null;
        if (data.resumePoint) {
          const { itemType, itemId, lastSecondWatched } = data.resumePoint;
          for (const section of data.sections) {
            let found = null;
            if (itemType === "Lesson") {
              found = section.lessons.find((l) => l.id === itemId);
            } else if (itemType === "Quiz") {
              found = section.quizzes.find((q) => q.id === itemId);
            }
            if (found) {
              resumeItem = {
                type: itemType.toLowerCase(),
                data: found,
                sectionId: section.id,
                lastSecondWatched,
              };
              break;
            }
          }
        }

        if (resumeItem) {
          setCurrentItem(resumeItem);
          const sectionIndex = data.sections.findIndex(
            (s) => s.id === resumeItem.sectionId
          );
          if (sectionIndex !== -1) {
            setOpenSections({ [sectionIndex]: true });
          }
        } else {
          const firstSection = data.sections[0];
          if (firstSection) {
            const firstLesson = firstSection.lessons?.[0];
            const firstQuiz = firstSection.quizzes?.[0];
            if (firstLesson) {
              setCurrentItem({
                type: "lesson",
                data: firstLesson,
                sectionId: firstSection.id,
              });
            } else if (firstQuiz) {
              setCurrentItem({
                type: "quiz",
                data: firstQuiz,
                sectionId: firstSection.id,
              });
            }
          }
        }

        setIsVisible(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // ── Update current item's data after refresh ────────────────────────────
  const updateCurrentItemFromCourse = useCallback(() => {
    if (!currentItem || !course) return;
    const section = course.sections.find(s => s.id === currentItem.sectionId);
    if (!section) return;
    const item = currentItem.type === 'lesson'
      ? section.lessons.find(l => l.id === currentItem.data.id)
      : section.quizzes.find(q => q.id === currentItem.data.id);
    if (item) {
      setCurrentItem(prev => ({ ...prev, data: item }));
    }
  }, [course, currentItem]);

  const refreshProgress = useCallback(async () => {
    try {
      const response = await getWatchContent(courseId);
      if (response.success) {
        const data = response.data;
        setCourse(data);
        setServerProgress(data.progressPercentage);
        setIsCourseCompleted(data.isCompleted);
        const completed = new Set();
        data.sections.forEach((section) => {
          section.lessons.forEach((lesson) => {
            if (lesson.progress?.isCompleted) completed.add(lesson.id);
          });
          section.quizzes.forEach((quiz) => {
            if (quiz.previousAttempt?.isPassed) completed.add(quiz.id);
          });
        });
        setCompletedItems(completed);
        updateCurrentItemFromCourse();
      }
    } catch (err) {
      console.error("Failed to refresh progress", err);
    }
  }, [courseId, updateCurrentItemFromCourse]);

  // ── Select item ─────────────────────────────────────────────────────────
  const selectItem = useCallback(
    (item) => {
      const section = course?.sections.find(
        (s) =>
          s.lessons.some((l) => l.id === item.id) ||
          s.quizzes.some((q) => q.id === item.id)
      );
      if (section) {
        const type = section.lessons.some((l) => l.id === item.id)
          ? "lesson"
          : "quiz";
        const data =
          type === "lesson"
            ? section.lessons.find((l) => l.id === item.id)
            : section.quizzes.find((q) => q.id === item.id);
        setCurrentItem({ type, data, sectionId: section.id });
        const sectionIndex = course.sections.indexOf(section);
        if (sectionIndex !== -1) {
          setOpenSections((prev) => ({ ...prev, [sectionIndex]: true }));
        }
      }
    },
    [course]
  );

  // ── Toggle section ──────────────────────────────────────────────────────
  const toggleSection = useCallback((index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  // ── Go to next item ─────────────────────────────────────────────────────
  const goToNextItem = useCallback(() => {
    if (!course || !currentItem) return;
    const sections = course.sections;
    const currentSection = sections.find((s) => s.id === currentItem.sectionId);
    if (!currentSection) return;

    const combined = [
      ...currentSection.lessons.map((l) => ({ ...l, type: "lesson" })),
      ...currentSection.quizzes.map((q) => ({ ...q, type: "quiz" })),
    ].sort((a, b) => a.order - b.order);

    const currentIndex = combined.findIndex(
      (item) =>
        item.id === currentItem.data.id && item.type === currentItem.type
    );
    if (currentIndex === -1) return;

    const next = combined[currentIndex + 1];
    if (next) {
      const itemData =
        next.type === "lesson"
          ? currentSection.lessons.find((l) => l.id === next.id)
          : currentSection.quizzes.find((q) => q.id === next.id);
      if (itemData) {
        setCurrentItem({
          type: next.type,
          data: itemData,
          sectionId: currentSection.id,
        });
        setViewMode("content");
      }
    } else {
      // Next section
      const currentSectionIndex = sections.indexOf(currentSection);
      if (currentSectionIndex < sections.length - 1) {
        const nextSection = sections[currentSectionIndex + 1];
        const firstItem = nextSection.lessons?.[0] || nextSection.quizzes?.[0];
        if (firstItem) {
          const type = nextSection.lessons.some((l) => l.id === firstItem.id)
            ? "lesson"
            : "quiz";
          const data =
            type === "lesson"
              ? nextSection.lessons.find((l) => l.id === firstItem.id)
              : nextSection.quizzes.find((q) => q.id === firstItem.id);
          setCurrentItem({ type, data, sectionId: nextSection.id });
          setOpenSections((prev) => ({
            ...prev,
            [currentSectionIndex + 1]: true,
          }));
          setViewMode("content");
        }
      }
    }
  }, [course, currentItem]);

  // ── Mark lesson complete ──────────────────────────────────────────────────
  const markLessonComplete = useCallback(async () => {
    if (!currentItem || currentItem.type !== "lesson") return;
    const lesson = currentItem.data;
    const totalSeconds = parseDurationToSeconds(lesson.duration) || 60;

    // Optimistic: mark as completed locally
    setCompletedItems((prev) => new Set(prev).add(lesson.id));
    // Also update local lesson progress to 100%
    updateLessonProgressLocally(lesson.id, totalSeconds, totalSeconds);

    try {
      await updateLessonProgress(lesson.id, totalSeconds, totalSeconds);
      await refreshProgress();
      setTimeout(() => {
        goToNextItem();
      }, 500);
    } catch (err) {
      console.error("Failed to mark lesson complete", err);
      // Revert optimistic
      setCompletedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lesson.id);
        return newSet;
      });
    }
  }, [currentItem, refreshProgress, goToNextItem, updateLessonProgressLocally]);

  // ── Quiz complete handler ──────────────────────────────────────────────
  const handleQuizComplete = useCallback(async () => {
    await refreshProgress();
  }, [refreshProgress]);

  // ── Show feedback ──────────────────────────────────────────────────────
  const showFeedback = useCallback(() => {
    setViewMode("feedback");
  }, []);

  // ── Handle item selection from sidebar ────────────────────────────────
  const handleItemSelect = useCallback(
    (item) => {
      setViewMode("content");
      selectItem(item);
    },
    [selectItem]
  );

  // ── Render main content ──────────────────────────────────────────────────
  const renderContent = useCallback(() => {
    if (viewMode === "feedback") {
      return (
        <div className="p-6 md:p-10">
          <FeedbackSection courseId={course?.courseId} />
        </div>
      );
    }

    if (!currentItem) {
      return (
        <div className="text-center py-12 text-gray-500">
          No content available
        </div>
      );
    }
    if (currentItem.type === "lesson") {
      const lesson = currentItem.data;
      const isCompleted = completedItems.has(lesson.id);
      return (
        <div className="p-6 md:p-10">
          <VideoPlayer
            lecture={lesson}
            onComplete={markLessonComplete}
            isCompleted={isCompleted}
            onNext={goToNextItem}
            onProgress={updateLessonProgressLocally}  // ← pass local updater
          />
          <div className="mt-10 pt-6 border-t border-gray-200">
            <Comments lessonId={lesson.id} />
          </div>
        </div>
      );
    } else if (currentItem.type === "quiz") {
      const quiz = currentItem.data;
      return (
        <div className="p-6 md:p-10">
          <QuizView quizId={quiz.id} onComplete={handleQuizComplete} />
        </div>
      );
    }
    return null;
  }, [
    viewMode,
    currentItem,
    completedItems,
    course,
    markLessonComplete,
    handleQuizComplete,
    goToNextItem,
    updateLessonProgressLocally,
  ]);

  // ── Loading / Error states ──────────────────────────────────────────────
  if (loading) return <WatchWindowSkeleton />;
  if (error || !course)
    return <EmptyState onBrowseCourses={() => navigate("/courses")} />;

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        .watch-container { opacity: 0; transition: opacity 400ms ease; }
        .watch-container.visible { opacity: 1; }
      `}</style>

      <div
        className={`watch-container ${
          isVisible ? "visible" : ""
        } min-h-screen bg-gray-50`}
      >
        <ProgressBar
          courseTitle={course.title}
          progress={displayProgress}
          completedCount={completedItems.size}
          totalCount={totalItems}
        />

        <div className="grid lg:grid-cols-[1fr_420px]">
          <div>{renderContent()}</div>
          <CourseContentSidebar
            sections={course.sections}
            openSections={openSections}
            onToggleSection={toggleSection}
            onItemSelect={handleItemSelect}
            currentItemId={currentItem?.data?.id}
            completedItems={completedItems}
            onShowFeedback={showFeedback}
            isFeedbackActive={viewMode === "feedback"}
          />
        </div>
      </div>
    </>
  );
};

export default WatchWindow;