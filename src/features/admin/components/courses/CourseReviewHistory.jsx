// src/features/admin/components/courses/CourseReviewHistory.jsx
//
// Renders the audit trail from GET /api/Admin/courses/{id}/review-history.
// Entries are { id, action, comment, performedBy, performedAt }.
// action is "Approved" | "Rejected".

import React from 'react';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi';

const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
      })
    : '—';

const ACTION_CONFIG = {
  Approved: { icon: HiOutlineCheckCircle, color: 'text-green-600', bg: 'bg-green-50', line: 'bg-green-200' },
  Rejected: { icon: HiOutlineXCircle,     color: 'text-red-600',   bg: 'bg-red-50',   line: 'bg-red-200'   },
};

const CourseReviewHistory = ({ history = [], loading, error }) => {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-xs text-red-500">{error}</p>;
  }

  if (!history.length) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
        <HiOutlineClock size={14} />
        No review actions yet
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-3.5 top-4 bottom-4 w-px bg-gray-200" aria-hidden />

      <div className="space-y-4">
        {history.map((entry) => {
          const cfg = ACTION_CONFIG[entry.action] || ACTION_CONFIG.Approved;
          const Icon = cfg.icon;
          return (
            <div key={entry.id} className="flex gap-3 relative">
              {/* Icon dot */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${cfg.bg}`}>
                <Icon size={15} className={cfg.color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
                  <span className={`text-xs font-semibold ${cfg.color}`}>{entry.action}</span>
                  <span className="text-xs text-gray-400">by {entry.performedBy}</span>
                  <span className="text-[11px] text-gray-400 ml-auto">{formatDateTime(entry.performedAt)}</span>
                </div>
                {entry.comment && (
                  <p className="mt-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 leading-relaxed">
                    "{entry.comment}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseReviewHistory;
