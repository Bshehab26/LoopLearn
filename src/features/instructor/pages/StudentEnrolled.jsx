// src/features/instructor/pages/StudentEnrolled.jsx

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSearch,
  HiFilter,
  HiDownload,
  HiUserGroup,
  HiUserAdd,
  HiCalendar,
  HiClock,
  HiStar,
  HiChartBar,
  HiChevronLeft,
  HiChevronRight,
  HiBadgeCheck,
  HiAcademicCap
} from 'react-icons/hi';
import { HiTrophy } from 'react-icons/hi2';
import useInstructorStudents from '../hooks/useInstructorStudents';
import { getInstructorCourses } from '../api/instructor.api';

// ============================================================================
// Helper Functions
// ============================================================================

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// ============================================================================
// Helper Components
// ============================================================================

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {trend !== undefined && (
          <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400'}`}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const CourseFilter = ({ courses, selectedCourse, onSelect, loading }) => (
  <div className="flex flex-wrap gap-2">
    <button
      onClick={() => onSelect(null)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        !selectedCourse
          ? 'bg-purple-600 text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      All Courses
    </button>
    {loading ? (
      <div className="px-4 py-2 text-gray-400">Loading courses...</div>
    ) : (
      courses.map(course => (
        <button
          key={course.id}
          onClick={() => onSelect(course.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            selectedCourse === course.id
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {course.name}
        </button>
      ))
    )}
  </div>
);

const StatusBadge = ({ status, certificateIssued }) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    inactive: 'bg-gray-100 text-gray-700'
  };
  const labels = {
    active: 'Active',
    completed: 'Completed',
    inactive: 'Inactive'
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}>
        {labels[status] || 'Inactive'}
      </span>
      {certificateIssued && (
        <div className="flex items-center gap-1">
          <HiBadgeCheck className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 font-medium whitespace-nowrap">Certified</span>
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ progress }) => (
  <div className="w-full">
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>Progress</span>
      <span>{Math.round(progress)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.5 }}
        className="bg-purple-600 h-2 rounded-full"
      />
    </div>
  </div>
);

const StudentRow = ({ student, index }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-gray-100 hover:bg-gray-50 transition"
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3 min-w-[150px]">
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {getInitials(student.name)}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-gray-800 truncate">{student.name}</p>
            <p className="text-xs text-gray-500 truncate">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-gray-700 truncate block max-w-[120px]">{student.courseName || '—'}</span>
      </td>
      <td className="px-4 py-4 min-w-[120px]">
        <ProgressBar progress={student.progress} />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-gray-500 text-sm whitespace-nowrap">
          <HiCalendar className="w-4 h-4 flex-shrink-0" />
          <span>{formatDate(student.enrolledDate)}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-gray-500 text-sm whitespace-nowrap">
          <HiClock className="w-4 h-4 flex-shrink-0" />
          <span>{formatDate(student.lastActivity)}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={student.status} certificateIssued={student.certificateIssued} />
      </td>
    </motion.tr>
  );
};

const StudentCard = ({ student }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {getInitials(student.name)}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate">{student.name}</p>
            <p className="text-xs text-gray-500 truncate">{student.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
          <HiAcademicCap className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{student.courseName || 'No course'}</span>
        </p>

        <ProgressBar progress={student.progress} />

        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <HiCalendar className="w-3 h-3 flex-shrink-0" />
            <span>{formatDate(student.enrolledDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiClock className="w-3 h-3 flex-shrink-0" />
            <span>{formatDate(student.lastActivity)}</span>
          </div>
        </div>

        <div className="pt-2">
          <StatusBadge status={student.status} certificateIssued={student.certificateIssued} />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const StudentEnrolled = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  
  const itemsPerPage = 10;

  // Use the real hook for students
  const { 
    students: realStudents, 
    loading: studentsLoading, 
    error,
    pagination,
    filterByCourse,
    goToPage: goToApiPage,
    currentPage: apiPage,
    refetch,
    statistics
  } = useInstructorStudents();

  // Fetch courses for filter dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getInstructorCourses(1, 100);
        if (result.success) {
          const courseList = result.data.map(course => ({
            id: course.id,
            name: course.title,
            enrolledCount: course.enrollmentCount || 0,
            averageProgress: course.averageRating || 0
          }));
          setCourses(courseList);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Sync selected course with filter
  useEffect(() => {
    filterByCourse(selectedCourse);
  }, [selectedCourse, filterByCourse]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = [...realStudents];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.courseName?.toLowerCase().includes(term)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'name') {
        aVal = a.name?.toLowerCase() || '';
        bVal = b.name?.toLowerCase() || '';
      }
      if (sortBy === 'progress') {
        aVal = a.progress || 0;
        bVal = b.progress || 0;
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [realStudents, searchTerm, selectedStatus, sortBy, sortOrder]);

  // Paginate filtered results
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats from real data.
  const stats = useMemo(() => {
    const uniqueStudentIds = new Set(realStudents.map(s => s.studentId));
    const activeStudentIds = new Set(
      realStudents.filter(s => s.status === 'active').map(s => s.studentId)
    );
    const completedStudentIds = new Set(
      realStudents.filter(s => s.status === 'completed').map(s => s.studentId)
    );
    const averageProgress = realStudents.length > 0
      ? Math.round(realStudents.reduce((sum, s) => sum + (s.progress || 0), 0) / realStudents.length)
      : 0;
    return {
      totalStudents: uniqueStudentIds.size,
      activeStudents: activeStudentIds.size,
      completedStudents: completedStudentIds.size,
      averageProgress
    };
  }, [realStudents]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Course', 'Progress', 'Enrolled Date', 'Status', 'Certificate'];
    const csvData = filteredStudents.map(s => [
      s.name,
      s.email,
      s.courseName,
      `${Math.round(s.progress)}%`,
      formatDate(s.enrolledDate),
      s.status,
      s.certificateIssued ? 'Yes' : 'No'
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enrolled-students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setViewMode('grid');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (studentsLoading && realStudents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error && realStudents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600">Error loading students: {error}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Enrolled Students</h1>
          <p className="text-gray-500 mt-1">Manage and track your students' progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={HiUserGroup}
            color="bg-purple-600"
          />
          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon={HiUserAdd}
            color="bg-green-600"
          />
          <StatCard
            title="Completed"
            value={stats.completedStudents}
            icon={HiTrophy}
            color="bg-blue-600"
          />
          <StatCard
            title="Avg Progress"
            value={`${stats.averageProgress}%`}
            icon={HiChartBar}
            color="bg-orange-600"
          />
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {!isMobile && (
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    viewMode === 'table' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'
                  }`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'
                  }`}
                >
                  Grid View
                </button>
              </div>
            )}

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm"
            >
              <HiDownload className="w-4 h-4" />
              Export CSV
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <HiFilter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            <CourseFilter
              courses={courses}
              selectedCourse={selectedCourse}
              onSelect={(id) => {
                setSelectedCourse(id);
                setCurrentPage(1);
              }}
              loading={coursesLoading}
            />
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 pt-4 border-t border-gray-100 space-y-3"
              >
                <CourseFilter
                  courses={courses}
                  selectedCourse={selectedCourse}
                  onSelect={(id) => {
                    setSelectedCourse(id);
                    setCurrentPage(1);
                  }}
                  loading={coursesLoading}
                />
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="inactive">Inactive</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <p className="text-sm text-gray-500">
            Showing {paginatedStudents.length} of {filteredStudents.length} enrollments
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-2 py-1 border border-gray-200 rounded-lg text-sm"
            >
              <option value="name">Name</option>
              <option value="progress">Progress</option>
              <option value="enrolledDate">Enrolled Date</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && !isMobile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsLoading && realStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        Loading students...
                      </td>
                    </tr>
                  ) : paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student, index) => (
                      <StudentRow key={student.id} student={student} index={index} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grid View */}
        {(viewMode === 'grid' || isMobile) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studentsLoading && realStudents.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading students...
              </div>
            ) : paginatedStudents.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No students found
              </div>
            ) : (
              paginatedStudents.map(student => (
                <StudentCard key={student.id} student={student} />
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrolled;