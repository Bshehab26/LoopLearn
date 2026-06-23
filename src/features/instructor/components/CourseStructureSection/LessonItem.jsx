// src/features/instructor/components/LessonItem.jsx

import { useState } from 'react';
import { 
  HiOutlineVideoCamera, HiOutlineClock, HiPencil, 
  HiOutlineArrowUp, HiOutlineArrowDown, HiTrash, 
  HiEye, HiCheckCircle, HiPlay, HiX
} from 'react-icons/hi';

const LessonItem = ({ lesson, onUpdate, onDelete, onMoveUp, onMoveDown, isEditable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(lesson);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    if (edited.title?.trim()) {
      onUpdate(edited);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEdited(lesson);
    setIsEditing(false);
  };

  const isVideoUrlValid = edited.videoUrl && (
    edited.videoUrl.includes('youtube.com') || 
    edited.videoUrl.includes('youtu.be') ||
    edited.videoUrl.includes('vimeo.com')
  );

  if (isEditing) {
    return (
      <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 shadow-sm">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Lesson Title</label>
            <input 
              type="text" 
              value={edited.title || ''} 
              onChange={(e) => setEdited({ ...edited, title: e.target.value })} 
              placeholder="Enter lesson title..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm font-medium"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Video URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={edited.videoUrl || ''} 
                onChange={(e) => setEdited({ ...edited, videoUrl: e.target.value })} 
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
              />
              {isVideoUrlValid && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-2 bg-purple-100 text-purple-600 rounded-lg text-sm hover:bg-purple-200 transition flex items-center gap-1"
                >
                  <HiPlay size={14} />
                  {showPreview ? 'Hide' : 'Preview'}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Supports YouTube and Vimeo links</p>
          </div>

          {/* Video Preview */}
          {showPreview && isVideoUrlValid && (
            <div className="rounded-lg overflow-hidden bg-black aspect-video">
              <iframe
                src={edited.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                className="w-full h-full"
                allowFullScreen
                title="Video preview"
              />
            </div>
          )}

          {/* Duration & Preview */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Duration (minutes)</label>
              <div className="relative">
                <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="number" 
                  value={edited.duration || 0} 
                  onChange={(e) => setEdited({ ...edited, duration: parseInt(e.target.value) || 0 })} 
                  placeholder="0"
                  min="0"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 transition">
                <input 
                  type="checkbox" 
                  checked={edited.isPreview || false} 
                  onChange={(e) => setEdited({ ...edited, isPreview: e.target.checked })} 
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <HiEye size={14} className="text-gray-400" />
                  Free Preview
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description (optional)</label>
            <textarea
              value={edited.description || ''}
              onChange={(e) => setEdited({ ...edited, description: e.target.value })}
              placeholder="Brief description of this lesson..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2 border-t border-purple-200">
            <button 
              onClick={handleCancel} 
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-1"
            >
              <HiX size={14} />
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1 font-medium"
            >
              <HiCheckCircle size={14} />
              Save Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition group shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
        <HiOutlineVideoCamera size={16} className="text-purple-500" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">{lesson.title || 'Untitled Lesson'}</div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
          {lesson.videoUrl && (
            <span className="truncate max-w-[200px] text-purple-400">{lesson.videoUrl}</span>
          )}
          <span className="flex items-center gap-1">
            <HiOutlineClock size={12} />
            {lesson.duration || 0} min
          </span>
          {lesson.isPreview && (
            <span className="flex items-center gap-1 text-green-500 bg-green-50 px-1.5 py-0.5 rounded">
              <HiEye size={10} />
              Preview
            </span>
          )}
        </div>
      </div>

      {isEditable && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button 
            onClick={() => setIsEditing(true)} 
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
            title="Edit lesson"
          >
            <HiPencil size={14} />
          </button>
          <button 
            onClick={onMoveUp} 
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
            title="Move up"
          >
            <HiOutlineArrowUp size={14} />
          </button>
          <button 
            onClick={onMoveDown} 
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
            title="Move down"
          >
            <HiOutlineArrowDown size={14} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete lesson"
          >
            <HiTrash size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonItem;