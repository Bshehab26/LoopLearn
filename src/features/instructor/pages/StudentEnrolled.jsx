/**
 * StudentEnrolled.jsx
 * Instructor page for viewing enrolled students across courses.
 * Features course filtering, student search, progress tracking, and export functionality.
 * 
 * @module features/instructor/pages/StudentEnrolled
 */

import React, { useContext, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineSearch, HiOutlineUserGroup, HiOutlineMail, 
  HiOutlineChartBar, HiOutlineDownload, HiOutlineFilter,
  HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineAcademicCap,
  HiOutlineTrophy, HiOutlineCalendar
} from 'react-icons/hi';
import { AppContext } from '../../../store/AppContext';

// ============================================================================
// Constants
// ============================================================================

/** Animation variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats date to readable string
 */
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Gets progress color based on percentage
 */
const getProgressColor = (progress) => {
  if (progress >= 75) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-yellow-500';
  return 'bg-red-500';
};

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Course selector component
 */
const CourseSelector = ({ courses, selectedCourseId, onSelectCourse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCourse = courses.find(c => (c.id || c._id) === selectedCourseId);

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-between w-full sm:w-64 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
      >
        <span className='truncate'>
          {selectedCourse ? (selectedCourse.title || selectedCourse.courseTitle) : 'All Courses'}
        </span>
        <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='absolute top-full left-0 mt-2 w-full sm:w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-10 max-h-60 overflow-y-auto'
          >
            <button
              onClick={() => {
                onSelectCourse(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition ${
                !selectedCourseId ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700'
              }`}
            >
              All Courses
            </button>
            {courses.map((course) => {
              const courseId = course.id || course._id;
              const courseTitle = course.title || course.courseTitle;
              return (
                <button
                  key={courseId}
                  onClick={() => {
                    onSelectCourse(courseId);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition ${
                    selectedCourseId === courseId ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {courseTitle}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Search bar component
 */
const SearchBar = ({ searchTerm, onSearchChange }) => (
  <div className='relative flex-1'>
    <HiOutlineSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
    <input
      type='text'
      placeholder='Search students by name or email...'
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all'
    />
  </div>
);

/**
 * Stats summary component
 */
const StatsSummary = ({ totalStudents, averageProgress, completedCourses }) => (
  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
          <HiOutlineUserGroup className='w-5 h-5 text-purple-600' />
        </div>
        <div>
          <p className='text-2xl font-bold text-gray-800'>{totalStudents}</p>
          <p className='text-xs text-gray-500'>Total Students</p>
        </div>
      </div>
    </div>
    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
          <HiOutlineChartBar className='w-5 h-5 text-green-600' />
        </div>
        <div>
          <p className='text-2xl font-bold text-gray-800'>{averageProgress}%</p>
          <p className='text-xs text-gray-500'>Avg. Progress</p>
        </div>
      </div>
    </div>
    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center'>
          <HiOutlineTrophy className='w-5 h-5 text-amber-600' />
        </div>
        <div>
          <p className='text-2xl font-bold text-gray-800'>{completedCourses}</p>
          <p className='text-xs text-gray-500'>Completed Courses</p>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Student table row component
 */
const StudentRow = ({ student, index }) => {
  const [expanded, setExpanded] = useState(false);
  const progress = student.progress || 0;
  const progressColor = getProgressColor(progress);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className='border-b border-gray-100 hover:bg-gray-50 transition'
    >
      <td className='py-3 px-4'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-medium'>
            {student.name?.charAt(0) || 'S'}
          </div>
          <div>
            <p className='font-medium text-gray-800'>{student.name}</p>
            <p className='text-xs text-gray-400'>ID: {student.id || 'N/A'}</p>
          </div>
        </div>
      </td>
      <td className='py-3 px-4 text-gray-600'>
        <div className='flex items-center gap-2'>
          <HiOutlineMail className='w-4 h-4 text-gray-400' />
          <span className='text-sm'>{student.email}</span>
        </div>
      </td>
      <td className='py-3 px-4'>
        <div className='flex items-center gap-3'>
          <div className='flex-1'>
            <div className='flex justify-between text-xs mb-1'>
              <span className='text-gray-500'>Progress</span>
              <span className={`font-medium ${progressColor.replace('bg-', 'text-')}`}>{progress}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div 
                className={`${progressColor} h-2 rounded-full transition-all duration-500`} 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className='p-1 hover:bg-gray-100 rounded-lg transition'
          >
            {expanded ? <HiOutlineChevronUp className='w-4 h-4' /> : <HiOutlineChevronDown className='w-4 h-4' />}
          </button>
        </div>
      </td>
      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <td colSpan={3} className='py-4 px-4 bg-gray-50'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Enrolled Date</p>
                  <p className='text-sm text-gray-700'>{formatDate(student.enrolledAt)}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Last Active</p>
                  <p className='text-sm text-gray-700'>{formatDate(student.lastActive)}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 mb-1'>Completed Lessons</p>
                  <p className='text-sm text-gray-700'>{student.completedLessons || 0} / {student.totalLessons || 0}</p>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </motion.tr>
  );
};

/**
 * Empty state component
 */
const EmptyState = ({ hasCourses, onClearFilters }) => (
  <div className='text-center py-12 bg-white rounded-xl'>
    <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center'>
      <HiOutlineUserGroup className='w-10 h-10 text-gray-400' />
    </div>
    {hasCourses ? (
      <>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>No Students Found</h3>
        <p className='text-gray-500 mb-4'>No students match your search criteria.</p>
        <button
          onClick={onClearFilters}
          className='px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition'
        >
          Clear Filters
        </button>
      </>
    ) : (
      <>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>No Courses Yet</h3>
        <p className='text-gray-500'>Create your first course to start enrolling students.</p>
      </>
    )}
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * StudentEnrolled - Instructor's enrolled students page
 * @returns {React.ReactElement} Student enrolled page
 */
const StudentEnrolled = () => {
  const { allCourses } = useContext(AppContext);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock enrolled students data (replace with real API data)
  const coursesWithStudents = useMemo(() => {
    return allCourses.map(course => ({
      ...course,
      id: course.id || course._id,
      title: course.title || course.courseTitle,
      enrolledStudents: course.enrolledStudents || [
        { id: 1, name: 'Ahmed Hassan', email: 'ahmed@example.com', progress: 75, enrolledAt: '2024-01-15', lastActive: '2024-03-20', completedLessons: 15, totalLessons: 20 },
        { id: 2, name: 'Sara Mohamed', email: 'sara@example.com', progress: 45, enrolledAt: '2024-02-01', lastActive: '2024-03-18', completedLessons: 9, totalLessons: 20 },
        { id: 3, name: 'Omar Ali', email: 'omar@example.com', progress: 90, enrolledAt: '2024-01-10', lastActive: '2024-03-21', completedLessons: 18, totalLessons: 20 },
      ]
    }));
  }, [allCourses]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    if (!selectedCourseId) return coursesWithStudents;
    return coursesWithStudents.filter(c => c.id === selectedCourseId);
  }, [coursesWithStudents, selectedCourseId]);

  // Get all students from filtered courses
  const allStudents = useMemo(() => {
    const students = [];
    filteredCourses.forEach(course => {
      if (course.enrolledStudents) {
        course.enrolledStudents.forEach(student => {
          students.push({
            ...student,
            courseTitle: course.title,
            courseId: course.id,
          });
        });
      }
    });
    return students;
  }, [filteredCourses]);

  // Filter students by search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return allStudents;
    const term = searchTerm.toLowerCase();
    return allStudents.filter(student => 
      student.name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term)
    );
  }, [allStudents, searchTerm]);

  // Calculate statistics
  const totalStudents = filteredStudents.length;
  const averageProgress = filteredStudents.length > 0
    ? Math.round(filteredStudents.reduce((sum, s) => sum + (s.progress || 0), 0) / filteredStudents.length)
    : 0;
  const completedCourses = filteredStudents.filter(s => (s.progress || 0) >= 100).length;

  const handleClearFilters = () => {
    setSelectedCourseId(null);
    setSearchTerm('');
  };

  const hasCourses = coursesWithStudents.length > 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className='space-y-6'
    >
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>Enrolled Students</h1>
          <p className='text-sm text-gray-500 mt-1'>Track and manage your students' progress</p>
        </div>
        <button className='inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition'>
          <HiOutlineDownload className='w-4 h-4' />
          Export Report
        </button>
      </div>

      {/* Stats Summary */}
      {totalStudents > 0 && (
        <motion.div variants={itemVariants}>
          <StatsSummary 
            totalStudents={totalStudents}
            averageProgress={averageProgress}
            completedCourses={completedCourses}
          />
        </motion.div>
      )}

      {/* Filters Bar */}
      <motion.div variants={itemVariants} className='flex flex-col sm:flex-row gap-4'>
        <CourseSelector
          courses={coursesWithStudents}
          selectedCourseId={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
        />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </motion.div>

      {/* Students Table */}
      {filteredStudents.length > 0 ? (
        <motion.div variants={itemVariants} className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-100'>
                <tr>
                  <th className='py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Student</th>
                  <th className='py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Email</th>
                  <th className='py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Progress</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {filteredStudents.map((student, index) => (
                  <StudentRow key={student.id || index} student={student} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <EmptyState 
          hasCourses={hasCourses} 
          onClearFilters={handleClearFilters} 
        />
      )}

      {/* Results count */}
      {filteredStudents.length > 0 && (
        <div className='text-center text-sm text-gray-500'>
          Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
          {selectedCourseId && ' in selected course'}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
    </motion.div>
  );
};

export default StudentEnrolled;