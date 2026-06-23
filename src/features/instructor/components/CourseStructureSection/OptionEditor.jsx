// src/features/instructor/components/OptionEditor.jsx

import { HiTrash, HiCheckCircle } from 'react-icons/hi';

const OptionEditor = ({ option, index, onUpdate, onDelete, isEditable, isCorrect, onSelectCorrect }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all group ${
    isCorrect 
      ? 'bg-green-50 border-green-300 shadow-sm' 
      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
  }`}>
    {/* Radio button for correct answer selection */}
    <label className="flex-shrink-0 cursor-pointer relative">
      <input
        type="radio"
        name="correct-option"
        checked={isCorrect}
        onChange={() => onSelectCorrect(option.id)}
        disabled={!isEditable}
        className="sr-only"
      />
      <div className={`
        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
        ${isCorrect 
          ? 'border-green-500 bg-green-500' 
          : 'border-gray-300 bg-white hover:border-green-400'
        }
      `}>
        {isCorrect && <HiCheckCircle size={14} className="text-white" />}
      </div>
      <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap ${
        isCorrect ? 'text-green-600' : 'text-gray-400'
      }`}>
        {isCorrect ? 'Correct' : 'Select'}
      </span>
    </label>

    {/* Option text input */}
    <div className="flex-1 min-w-0 ml-1">
      <label className="block text-xs text-gray-500 mb-1">
        Option {index + 1}
      </label>
      <input
        type="text"
        value={option.body || ''}
        onChange={(e) => onUpdate({ ...option, body: e.target.value })}
        placeholder={`Enter option ${index + 1} text...`}
        disabled={!isEditable}
        className={`
          w-full px-3 py-2 border rounded-lg text-sm transition-all
          ${isCorrect 
            ? 'border-green-300 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100' 
            : 'border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100'
          }
          disabled:bg-gray-100 disabled:text-gray-500
        `}
      />
    </div>

    {/* Delete button */}
    {isEditable && (
      <button 
        onClick={onDelete} 
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
        title="Remove option"
      >
        <HiTrash size={16} />
      </button>
    )}
  </div>
);

export default OptionEditor;