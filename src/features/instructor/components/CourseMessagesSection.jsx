import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import SectionHeader from './SectionHeader';

const CourseMessagesSection = ({ data, onUpdate, isEditable }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader icon={HiMail} title="Course Messages" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100 p-6 space-y-4">
            <div>
              <label className="block font-semibold text-gray-800 mb-2">Welcome Message</label>
              <textarea value={data.welcomeMessage || ''} onChange={(e) => onUpdate({ welcomeMessage: e.target.value })} rows={3} disabled={!isEditable} className="w-full px-4 py-3 rounded-xl border border-gray-200 disabled:bg-gray-100" />
            </div>
            <div>
              <label className="block font-semibold text-gray-800 mb-2">Completion Message</label>
              <textarea value={data.completionMessage || ''} onChange={(e) => onUpdate({ completionMessage: e.target.value })} rows={3} disabled={!isEditable} className="w-full px-4 py-3 rounded-xl border border-gray-200 disabled:bg-gray-100" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseMessagesSection;