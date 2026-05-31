import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBookOpen, HiUpload, HiTrash } from 'react-icons/hi';
import {uploadCourseThumbnail} from '../../../shared/api/upload.api'
import SectionHeader from './SectionHeader';

const CourseLandingPageSection = ({ data, onUpdate, isEditable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

   const handleUpload = async (file) => {
    try {
      const thumbnailUrl = await uploadCourseThumbnail(file);
      onUpdate({ thumbnailUrl: thumbnailUrl });
    } catch (err) {
      console.error("Upload Failed" + err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader icon={HiBookOpen} title="Course Landing Page" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100">
            <div className="p-6 space-y-6">
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Course Subtitle</label>
                <input type="text" value={data.subtitle || ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} placeholder="A short, catchy subtitle" disabled={!isEditable} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 outline-none disabled:bg-gray-100" />
              </div>
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Language</label>
                <select value={data.language || 'en'} onChange={(e) => onUpdate({ language: e.target.value })} disabled={!isEditable} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 outline-none disabled:bg-gray-100">
                  <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="ar">Arabic</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Course Description</label>
                <textarea value={data.description || ''} onChange={(e) => onUpdate({ description: e.target.value })} rows={6} placeholder="Write a compelling course description..." disabled={!isEditable} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 outline-none resize-none disabled:bg-gray-100" />
              </div>
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Course Thumbnail</label>
                <div className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition ${isEditable ? 'hover:border-purple-400 cursor-pointer' : 'cursor-default'}`} onClick={() => isEditable && fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])} className="hidden" />
                  {data.thumbnailUrl ? (
                    <div className="relative inline-block">
                      <img src={data.thumbnailUrl} alt="Thumbnail" className="w-48 h-32 object-cover rounded-lg" />
                      {isEditable && (
                        <button onClick={(e) => { e.stopPropagation(); onUpdate({ thumbnailUrl: null }); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <HiTrash size={14} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <><HiUpload size={40} className="mx-auto text-gray-300 mb-2" /><p className="text-sm text-gray-500">Click to upload a course thumbnail</p><p className="text-xs text-gray-400 mt-1">Recommended: 1280x720px, JPG or PNG</p></>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseLandingPageSection;