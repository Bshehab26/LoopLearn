// src/features/admin/components/courses/CourseActionsMenu.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
} from 'react-icons/hi';

const CourseActionsMenu = ({
  course,
  onViewDetails,
  onApprove,
  onReject,
  onDelete,
  disableApprove,
  disableReject,
  disableDelete,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const close = () => setOpen(false);

  const isPending = course.status === 'PendingReview';
  const isPublished = course.status === 'Published';

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        aria-label="Course actions"
      >
        <HiOutlineDotsVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
          <button
            onClick={() => { onViewDetails(course); close(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
          >
            <HiOutlineEye size={14} /> View details
          </button>

          {isPending && !disableApprove && (
            <button
              onClick={() => { onApprove(course); close(); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-600 hover:bg-green-50"
            >
              <HiOutlineCheckCircle size={14} /> Approve
            </button>
          )}

          {isPending && !disableReject && (
            <button
              onClick={() => { onReject(course); close(); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
            >
              <HiOutlineXCircle size={14} /> Reject
            </button>
          )}

          {!disableDelete && (
            <button
              onClick={() => { onDelete(course); close(); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-red-50 ${
                isPublished ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <HiOutlineTrash size={14} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseActionsMenu;