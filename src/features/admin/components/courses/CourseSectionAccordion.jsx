// src/features/admin/components/courses/CourseSectionAccordion.jsx
//
// Shows all sections with their lessons and quizzes so the admin can
// review the full course content before approving or rejecting.
// Data comes from GET /api/Admin/courses/{id} via CourseDetailDTO.

import React, { useState } from 'react';
import {
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlinePlay,
  HiOutlineClipboardList,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
} from 'react-icons/hi';

const LessonRow = ({ lesson }) => (
  <div className="flex items-center gap-2.5 py-2 pl-3 pr-2 rounded-lg hover:bg-gray-50">
    <HiOutlinePlay size={12} className="text-[#534AB7] flex-shrink-0" />
    <span className="text-xs text-gray-700 flex-1 min-w-0 truncate">{lesson.title}</span>
    <div className="flex items-center gap-2 flex-shrink-0">
      {lesson.duration && (
        <span className="text-[11px] text-gray-400">{lesson.duration}</span>
      )}
      {lesson.isPreview ? (
        <span className="flex items-center gap-0.5 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
          <HiOutlineLockOpen size={9} /> Free
        </span>
      ) : (
        <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
          <HiOutlineLockClosed size={9} />
        </span>
      )}
    </div>
  </div>
);

const QuizRow = ({ quiz }) => (
  <div className="flex items-center gap-2.5 py-2 pl-3 pr-2 rounded-lg hover:bg-gray-50">
    <HiOutlineClipboardList size={12} className="text-amber-500 flex-shrink-0" />
    <span className="text-xs text-gray-700 flex-1 min-w-0 truncate">{quiz.title}</span>
    {quiz.questions?.length > 0 && (
      <span className="text-[11px] text-gray-400 flex-shrink-0">{quiz.questions.length} q</span>
    )}
  </div>
);

const SectionRow = ({ section, index }) => {
  const [open, setOpen] = useState(index === 0); // first section open by default
  const lessonCount = section.lessons?.length ?? 0;
  const quizCount = section.quizzes?.length ?? 0;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100
          text-left transition"
      >
        {open
          ? <HiOutlineChevronDown size={15} className="text-gray-400 flex-shrink-0" />
          : <HiOutlineChevronRight size={15} className="text-gray-400 flex-shrink-0" />}
        <span className="text-xs font-semibold text-gray-700 flex-1 min-w-0 truncate">
          {section.title}
        </span>
        <span className="text-[11px] text-gray-400 flex-shrink-0 ml-auto">
          {lessonCount > 0 && `${lessonCount} lesson${lessonCount !== 1 ? 's' : ''}`}
          {lessonCount > 0 && quizCount > 0 && ' · '}
          {quizCount > 0 && `${quizCount} quiz${quizCount !== 1 ? 'zes' : ''}`}
        </span>
      </button>

      {open && (
        <div className="px-3 py-2 bg-white space-y-0.5">
          {section.lessons?.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
          {section.quizzes?.map((quiz) => (
            <QuizRow key={quiz.id} quiz={quiz} />
          ))}
          {lessonCount === 0 && quizCount === 0 && (
            <p className="text-xs text-gray-400 px-3 py-2">No content added yet</p>
          )}
        </div>
      )}
    </div>
  );
};

const CourseSectionAccordion = ({ sections = [] }) => {
  if (!sections.length) {
    return <p className="text-xs text-gray-400">No sections added yet.</p>;
  }

  return (
    <div className="space-y-2">
      {sections.map((section, idx) => (
        <SectionRow key={section.id} section={section} index={idx} />
      ))}
    </div>
  );
};

export default CourseSectionAccordion;
