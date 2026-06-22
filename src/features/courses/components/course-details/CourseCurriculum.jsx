// src/features/courses/components/course-details/CourseCurriculum.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineChevronRight,
  HiOutlinePlay,
  HiOutlineLockClosed,
  HiOutlineEye,
} from 'react-icons/hi';

const LessonItem = ({ lesson, isEnrolled, isLessonAccessible, onPlay }) => {
  const canAccess = isLessonAccessible(lesson);
  // A preview lesson is always clickable (inline preview), even without auth.
  const isPreview = lesson.isPreview && !isEnrolled;
  const clickable = canAccess || isPreview;

  return (
    <div
      className={`flex items-center gap-2.5 py-2 px-3 border-b border-gray-100 last:border-b-0 transition group
        ${clickable
          ? 'hover:bg-[#EEEDFE] cursor-pointer'
          : 'cursor-not-allowed opacity-60'}`}
      onClick={() => clickable && onPlay?.(lesson)}
      title={!clickable ? 'Enroll to unlock this lesson' : ''}
    >
      {clickable ? (
        <div className="w-5 h-5 rounded-full bg-[#EEEDFE] flex items-center justify-center group-hover:bg-[#534AB7] transition flex-shrink-0">
          <HiOutlinePlay size={10} className="text-[#534AB7] group-hover:text-white transition ml-0.5" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <HiOutlineLockClosed size={10} className="text-gray-400" />
        </div>
      )}

      <span className="flex-1 text-[12px] text-gray-700 leading-snug">{lesson.title}</span>

      {isPreview && (
        <span className="text-[10px] bg-[#EAF3DE] text-[#27500A] px-1.5 py-0.5 rounded font-medium">
          Preview
        </span>
      )}
      {!clickable && (
        <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
          Premium
        </span>
      )}
      {lesson.duration && (
        <span className="text-[11px] text-gray-400 flex-shrink-0">
          {typeof lesson.duration === 'number'
            ? `${lesson.duration} min`
            : lesson.duration}
        </span>
      )}
    </div>
  );
};

const SectionAccordion = ({ section, isEnrolled, isLessonAccessible, onPlayLesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const lessons = section.lessons || [];
  const previewCount = lessons.filter((l) => l.isPreview).length;
  const accessibleCount = isEnrolled ? lessons.length : previewCount;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2.5 py-2.5 px-3 bg-gray-50 hover:bg-gray-100 transition text-left"
      >
        <div
          className={`w-4 h-4 rounded-full bg-white border border-gray-300 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-90' : ''
          }`}
        >
          <HiOutlineChevronRight size={9} className="text-gray-500" />
        </div>
        <span className="text-[13px] font-medium text-gray-800 flex-1">{section.title}</span>
        <span className="text-[11px] text-gray-400 whitespace-nowrap">
          {lessons.length} lessons · {accessibleCount} accessible
        </span>
        {!isEnrolled && previewCount < lessons.length && (
          <span className="text-[11px] text-purple-500 whitespace-nowrap">
            ({previewCount} previews)
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-gray-100"
          >
            {lessons.map((lesson, idx) => (
              <LessonItem
                key={lesson.id ?? idx}
                lesson={lesson}
                isEnrolled={isEnrolled}
                isLessonAccessible={isLessonAccessible}
                onPlay={onPlayLesson}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseCurriculum = ({ course, isEnrolled, isLessonAccessible, onPlayLesson }) => {
  const sections = course.sections || [];
  const totalLessons = sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);
  const freePreviewCount = isEnrolled
    ? totalLessons
    : sections.reduce((sum, s) => sum + (s.lessons?.filter((l) => l.isPreview).length || 0), 0);

  if (sections.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-[13px] text-gray-400">No curriculum available yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[16px] font-semibold text-gray-800">Course curriculum</h2>
        <div className="flex items-center gap-1 text-[11px] text-purple-600">
          <HiOutlineEye size={11} /> {freePreviewCount} free previews
        </div>
      </div>

      {sections.map((section, idx) => (
        <SectionAccordion
          key={section.id ?? idx}
          section={section}
          isEnrolled={isEnrolled}
          isLessonAccessible={isLessonAccessible}
          onPlayLesson={onPlayLesson}
        />
      ))}
    </div>
  );
};

export default CourseCurriculum;