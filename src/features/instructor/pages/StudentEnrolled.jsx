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
  HiDotsVertical,
  HiEye,
  HiChat,
  HiUserRemove,
  HiBadgeCheck,
  HiAcademicCap
} from 'react-icons/hi';
import { HiTrophy } from 'react-icons/hi2'; // ✅ Use hi2 for Trophy

// ============================================================================
// Helper function to format dates without date-fns
// ============================================================================

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_STUDENTS = [
  {
    id: 1,
    name: 'Ahmed Mansour',
    email: 'ahmed.mansour@example.com',
    phone: '+20 123 456 7890',
    avatar: null,
    enrolledDate: '2026-01-15T10:30:00Z',
    lastActivity: '2026-05-30T14:20:00Z',
    progress: 85,
    completedLessons: 42,
    totalLessons: 50,
    certificateIssued: true,
    grade: 'A',
    courseId: 1,
    courseName: 'Advanced React Development',
    status: 'active'
  },
  {
    id: 2,
    name: 'Sara Ibrahim',
    email: 'sara.ibrahim@example.com',
    phone: '+20 123 456 7891',
    avatar: null,
    enrolledDate: '2026-02-20T09:15:00Z',
    lastActivity: '2026-05-29T16:45:00Z',
    progress: 62,
    completedLessons: 31,
    totalLessons: 50,
    certificateIssued: false,
    grade: 'B+',
    courseId: 1,
    courseName: 'Advanced React Development',
    status: 'active'
  },
  {
    id: 3,
    name: 'Omar Hassan',
    email: 'omar.hassan@example.com',
    phone: '+20 123 456 7892',
    avatar: null,
    enrolledDate: '2026-01-10T11:00:00Z',
    lastActivity: '2026-05-28T10:30:00Z',
    progress: 94,
    completedLessons: 47,
    totalLessons: 50,
    certificateIssued: true,
    grade: 'A+',
    courseId: 1,
    courseName: 'Advanced React Development',
    status: 'completed'
  },
  {
    id: 4,
    name: 'Laila Mostafa',
    email: 'laila.mostafa@example.com',
    phone: '+20 123 456 7893',
    avatar: null,
    enrolledDate: '2026-03-05T14:45:00Z',
    lastActivity: '2026-05-30T09:15:00Z',
    progress: 28,
    completedLessons: 14,
    totalLessons: 50,
    certificateIssued: false,
    grade: 'C',
    courseId: 1,
    courseName: 'Advanced React Development',
    status: 'active'
  },
  {
    id: 5,
    name: 'Youssef Ali',
    email: 'youssef.ali@example.com',
    phone: '+20 123 456 7894',
    avatar: null,
    enrolledDate: '2026-04-12T08:20:00Z',
    lastActivity: '2026-05-27T13:00:00Z',
    progress: 16,
    completedLessons: 8,
    totalLessons: 50,
    certificateIssued: false,
    grade: 'D',
    courseId: 1,
    courseName: 'Advanced React Development',
    status: 'inactive'
  },
  {
    id: 6,
    name: 'Nadia Kamal',
    email: 'nadia.kamal@example.com',
    phone: '+20 123 456 7895',
    avatar: null,
    enrolledDate: '2026-01-25T13:10:00Z',
    lastActivity: '2026-05-29T11:30:00Z',
    progress: 76,
    completedLessons: 38,
    totalLessons: 50,
    certificateIssued: false,
    grade: 'B',
    courseId: 2,
    courseName: 'UI/UX Design Masterclass',
    status: 'active'
  },
  {
    id: 7,
    name: 'Khaled Abdelrahman',
    email: 'khaled.a@example.com',
    phone: '+20 123 456 7896',
    avatar: null,
    enrolledDate: '2026-02-01T09:00:00Z',
    lastActivity: '2026-05-28T15:45:00Z',
    progress: 88,
    completedLessons: 44,
    totalLessons: 50,
    certificateIssued: true,
    grade: 'A-',
    courseId: 2,
    courseName: 'UI/UX Design Masterclass',
    status: 'active'
  },
  {
    id: 8,
    name: 'Mona El-Sayed',
    email: 'mona.elsayed@example.com',
    phone: '+20 123 456 7897',
    avatar: null,
    enrolledDate: '2026-03-18T11:30:00Z',
    lastActivity: '2026-05-30T12:00:00Z',
    progress: 52,
    completedLessons: 26,
    totalLessons: 50,
    certificateIssued: false,
    grade: 'B-',
    courseId: 2,
    courseName: 'UI/UX Design Masterclass',
    status: 'active'
  }
];

const MOCK_COURSES = [
  { id: 1, name: 'Advanced React Development', enrolledCount: 5, averageProgress: 64 },
  { id: 2, name: 'UI/UX Design Masterclass', enrolledCount: 3, averageProgress: 72 },
];

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
        {trend && (
          <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const CourseFilter = ({ courses, selectedCourse, onSelect }) => (
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
    {courses.map(course => (
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
    ))}
  </div>
);

const StatusBadge = ({ status }) => {
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
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const ProgressBar = ({ progress }) => (
  <div className="w-full">
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>Progress</span>
      <span>{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
        className="bg-purple-600 h-2 rounded-full"
      />
    </div>
  </div>
);

const StudentActions = ({ student, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    { icon: HiEye, label: 'View Profile', color: 'text-blue-600' },
    { icon: HiChat, label: 'Send Message', color: 'text-purple-600' },
    { icon: HiChartBar, label: 'View Progress', color: 'text-green-600' },
    { icon: HiUserRemove, label: 'Remove Student', color: 'text-red-600', danger: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <HiDotsVertical className="w-5 h-5 text-gray-400" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10"
          >
            {actions.map(action => (
              <button
                key={action.label}
                onClick={() => {
                  onAction(action.label, student);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition ${
                  action.danger ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StudentRow = ({ student, index, onAction }) => {
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
        <div className="flex items-center gap-3">
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getInitials(student.name)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800">{student.name}</p>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="space-y-1">
          <ProgressBar progress={student.progress} />
          <p className="text-xs text-gray-500">
            {student.completedLessons}/{student.totalLessons} lessons
          </p>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <HiStar className="w-4 h-4 text-yellow-400" />
          <span className="font-medium text-gray-800">{student.grade}</span>
        </div>
        {student.certificateIssued && (
          <div className="flex items-center gap-1 mt-1">
            <HiBadgeCheck className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">Certificate</span>
          </div>
        )}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <HiCalendar className="w-4 h-4" />
          <span>{formatDate(student.enrolledDate)}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <HiClock className="w-4 h-4" />
          <span>{formatDate(student.lastActivity)}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={student.status} />
      </td>
      <td className="px-4 py-4">
        <StudentActions student={student} onAction={onAction} />
      </td>
    </motion.tr>
  );
};

const StudentCard = ({ student, onAction }) => {
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
        <div className="flex items-center gap-3">
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getInitials(student.name)}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{student.name}</p>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>
        </div>
        <StudentActions student={student} onAction={onAction} />
      </div>

      <div className="space-y-3">
        <ProgressBar progress={student.progress} />
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <HiAcademicCap className="w-4 h-4" />
            <span>{student.completedLessons}/{student.totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <HiStar className="w-4 h-4 text-yellow-400" />
            <span className="font-medium">{student.grade}</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <HiCalendar className="w-3 h-3" />
            <span>{formatDate(student.enrolledDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiClock className="w-3 h-3" />
            <span>{formatDate(student.lastActivity)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <StatusBadge status={student.status} />
          {student.certificateIssued && (
            <div className="flex items-center gap-1">
              <HiBadgeCheck className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600">Certified</span>
            </div>
          )}
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
  const itemsPerPage = 10;

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

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = [...MOCK_STUDENTS];

    if (selectedCourse) {
      filtered = filtered.filter(s => s.courseId === selectedCourse);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      }
      if (sortBy === 'progress') {
        aVal = a.progress;
        bVal = b.progress;
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedCourse, selectedStatus, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => {
    const totalStudents = MOCK_STUDENTS.length;
    const activeStudents = MOCK_STUDENTS.filter(s => s.status === 'active').length;
    const completedStudents = MOCK_STUDENTS.filter(s => s.status === 'completed').length;
    const averageProgress = Math.round(
      MOCK_STUDENTS.reduce((sum, s) => sum + s.progress, 0) / totalStudents
    );
    return { totalStudents, activeStudents, completedStudents, averageProgress };
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleAction = (action, student) => {
    console.log(`Action: ${action} on student:`, student);
    alert(`${action} action triggered for ${student.name}`);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Progress', 'Grade', 'Enrolled Date', 'Status'];
    const csvData = filteredStudents.map(s => [
      s.name,
      s.email,
      `${s.progress}%`,
      s.grade,
      formatDate(s.enrolledDate),
      s.status
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
            trend={12}
          />
          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon={HiUserAdd}
            color="bg-green-600"
            trend={8}
          />
          <StatCard
            title="Completed"
            value={stats.completedStudents}
            icon={HiTrophy}
            color="bg-blue-600"
            trend={5}
          />
          <StatCard
            title="Avg Progress"
            value={`${stats.averageProgress}%`}
            icon={HiChartBar}
            color="bg-orange-600"
            trend={3}
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
              courses={MOCK_COURSES}
              selectedCourse={selectedCourse}
              onSelect={(id) => {
                setSelectedCourse(id);
                setCurrentPage(1);
              }}
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
                  courses={MOCK_COURSES}
                  selectedCourse={selectedCourse}
                  onSelect={(id) => {
                    setSelectedCourse(id);
                    setCurrentPage(1);
                  }}
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
            Showing {paginatedStudents.length} of {filteredStudents.length} students
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
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student, index) => (
                    <StudentRow key={student.id} student={student} index={index} onAction={handleAction} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grid View */}
        {(viewMode === 'grid' || isMobile) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedStudents.map(student => (
              <StudentCard key={student.id} student={student} onAction={handleAction} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {paginatedStudents.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <HiUserGroup className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
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