import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronUp, HiChevronDown, HiTrash, HiPlus } from 'react-icons/hi';
import OptionEditor from './OptionEditor';

const QuestionEditor = ({ question, onUpdate, onDelete, isEditable }) => {
  const [isOpen, setIsOpen] = useState(true);
  const addOption = () => {
    const newOption = { id: Date.now(), body: '', isCorrect: false };
    onUpdate({ ...question, options: [...(question.options || []), newOption] });
  };
  const updateOption = (idx, updated) => {
    const newOptions = [...(question.options || [])];
    newOptions[idx] = updated;
    onUpdate({ ...question, options: newOptions });
  };
  const deleteOption = (idx) => {
    const newOptions = (question.options || []).filter((_, i) => i !== idx);
    onUpdate({ ...question, options: newOptions });
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-3">
      <div className="flex items-center justify-between p-3 bg-gray-50">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500">{isOpen ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}</button>
        <input type="text" value={question.body || ''} onChange={(e) => onUpdate({ ...question, body: e.target.value })} placeholder="Question text" disabled={!isEditable} className="flex-1 mx-2 px-2 py-1 border rounded text-sm" />
        <div className="flex gap-1">
          <input type="number" value={question.points || 0} onChange={(e) => onUpdate({ ...question, points: parseInt(e.target.value) || 0 })} disabled={!isEditable} className="w-16 px-1 py-1 border rounded text-sm text-center" />
          {isEditable && <button onClick={onDelete} className="text-red-500"><HiTrash size={16} /></button>}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="p-3 space-y-2">
            {(question.options || []).map((opt, idx) => (
              <OptionEditor key={opt.id || idx} option={opt} index={idx} onUpdate={(updated) => updateOption(idx, updated)} onDelete={() => deleteOption(idx)} isEditable={isEditable} />
            ))}
            {isEditable && <button onClick={addOption} className="text-sm text-purple-600 hover:bg-purple-50 px-2 py-1 rounded">+ Add Option</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionEditor;