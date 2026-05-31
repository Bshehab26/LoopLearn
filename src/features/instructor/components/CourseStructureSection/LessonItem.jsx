import { useState } from 'react';
import { HiOutlineVideoCamera, HiOutlineClock, HiPencil, HiOutlineArrowUp, HiOutlineArrowDown, HiTrash } from 'react-icons/hi';

const LessonItem = ({ lesson, onUpdate, onDelete, onMoveUp, onMoveDown, isEditable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(lesson);

  const handleSave = () => {
    if (edited.title?.trim()) onUpdate(edited);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="space-y-3">
          <input type="text" value={edited.title || ''} onChange={(e) => setEdited({ ...edited, title: e.target.value })} placeholder="Lesson title" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 outline-none" />
          <input type="text" value={edited.videoUrl || ''} onChange={(e) => setEdited({ ...edited, videoUrl: e.target.value })} placeholder="Video URL" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 outline-none" />
          <div className="flex gap-2">
            <input type="number" value={edited.duration || 0} onChange={(e) => setEdited({ ...edited, duration: parseInt(e.target.value) || 0 })} placeholder="Duration (minutes)" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 outline-none" />
            <button className="text-xs text-gray-500">Fetch</button>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={edited.isPreview || false} onChange={(e) => setEdited({ ...edited, isPreview: e.target.checked })} />
            <span className="text-sm">Preview lesson</span>
          </label>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
      <HiOutlineVideoCamera size={16} className="text-gray-400" />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800">{lesson.title || 'Untitled'}</div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {lesson.videoUrl && <span className="truncate max-w-xs">{lesson.videoUrl}</span>}
          <span className="flex items-center gap-1"><HiOutlineClock size={12} />{lesson.duration || 0} min</span>
        </div>
      </div>
      {isEditable && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => setIsEditing(true)} className="p-1 text-gray-500 hover:text-purple-600"><HiPencil size={14} /></button>
          <button onClick={onMoveUp} className="p-1 text-gray-500 hover:text-purple-600"><HiOutlineArrowUp size={14} /></button>
          <button onClick={onMoveDown} className="p-1 text-gray-500 hover:text-purple-600"><HiOutlineArrowDown size={14} /></button>
          <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-600"><HiTrash size={14} /></button>
        </div>
      )}
    </div>
  );
};

export default LessonItem;