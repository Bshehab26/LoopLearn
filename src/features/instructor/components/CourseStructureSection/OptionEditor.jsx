import { HiTrash } from 'react-icons/hi';

const OptionEditor = ({ option, index, onUpdate, onDelete, isEditable }) => (
  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group">
    <input type="checkbox" checked={option.isCorrect || false} onChange={(e) => onUpdate({ ...option, isCorrect: e.target.checked })} disabled={!isEditable} className="w-4 h-4" />
    <input type="text" value={option.body || ''} onChange={(e) => onUpdate({ ...option, body: e.target.value })} placeholder={`Option ${index + 1}`} disabled={!isEditable} className="flex-1 px-2 py-1 border rounded text-sm" />
    {isEditable && <button onClick={onDelete} className="text-red-500"><HiTrash size={14} /></button>}
  </div>
);

export default OptionEditor;