// src/features/admin/components/courses/CourseDetailDrawer.jsx

import React from 'react';
import { motion } from 'framer-motion';
import Drawer from '../common/Drawer';
import CourseStatusBadge from './CourseStatusBadge';
import useAdminCourseDetail from '../../hooks/useAdminCourseDetail';
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineEye,
  HiOutlineStar,
} from 'react-icons/hi';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '—';
  return `$${Number(amount).toFixed(2)}`;
};

const DetailItem = ({ icon: Icon, label, value, children }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-[#EEEDFE] flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={14} className="text-[#534AB7]" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-medium text-gray-800 mt-0.5">{value || children || '—'}</p>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color = '#534AB7' }) => (
  <div className="bg-gray-50 rounded-xl p-4 text-center">
    <div className="flex items-center justify-center mb-1.5">
      <Icon size={18} style={{ color }} />
    </div>
    <p className="text-xl font-bold text-gray-900">{value ?? 0}</p>
    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
  </div>
);

const CourseDetailDrawer = ({ courseId, open, onClose }) => {
  const { course, loading, error } = useAdminCourseDetail(open ? courseId : null);

  return (
    <Drawer open={open} onClose={onClose} title="Course Details" widthClass="w-full sm:w-[480px] md:w-[540px]">
      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-100 rounded-xl" />
          <div className="h-6 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-gray-100 rounded" />
            <div className="h-16 bg-gray-100 rounded" />
          </div>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 text-center py-6"
        >
          {error}
        </motion.div>
      )}

      {course && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {/* Thumbnail with gradient overlay */}
          <div className="relative aspect-video bg-gradient-to-br from-[#EEEDFE] to-purple-100 rounded-xl overflow-hidden">
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <HiOutlineBookOpen size={48} className="text-purple-300" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2">
                <CourseStatusBadge status={course.status} />
                {course.isFree && (
                  <span className="px-2 py-0.5 bg-green-500/90 text-white text-[10px] font-semibold rounded-full">
                    FREE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{course.title}</h3>
            {course.subtitle && (
              <p className="text-sm text-gray-500 mt-1">{course.subtitle}</p>
            )}
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-3">
            <DetailItem icon={HiOutlineUser} label="Instructor" value={course.instructorName || 'Unknown'} />
            <DetailItem icon={HiOutlineTag} label="Category" value={course.category || 'Uncategorized'} />
            <DetailItem icon={HiOutlineAcademicCap} label="Level" value={course.levelName || course.level || '—'} />
            <DetailItem icon={HiOutlineCurrencyDollar} label="Price" value={course.isFree ? 'Free' : formatCurrency(course.price)} />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <StatCard icon={HiOutlineUsers} label="Students" value={course.enrollmentCount} color="#534AB7" />
            <StatCard icon={HiOutlineBookOpen} label="Sections" value={course.sectionCount} color="#0EA5E9" />
            <StatCard icon={HiOutlineEye} label="Views" value={course.viewCount || 0} color="#D97706" />
          </div>

          {/* Description */}
          {course.description && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
            </div>
          )}

          {/* Tags */}
          {course.tags?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {course.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#EEEDFE] text-[#534AB7] rounded-full text-[10px] font-medium"
                  >
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Created</p>
              <p className="text-sm text-gray-700">{formatDate(course.createdAt)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Last Updated</p>
              <p className="text-sm text-gray-700">{formatDate(course.updatedAt)}</p>
            </div>
          </div>
        </motion.div>
      )}
    </Drawer>
  );
};

export default CourseDetailDrawer;