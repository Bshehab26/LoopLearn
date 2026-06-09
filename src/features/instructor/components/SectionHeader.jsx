// src/features/instructor/components/SectionHeader.jsx

import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

const SectionHeader = ({ icon: Icon, title, subtitle, isOpen, onToggle, badge }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-all"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <Icon size={20} className="text-purple-600" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          {badge && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {isOpen ? <HiChevronUp size={20} className="text-gray-400" /> : <HiChevronDown size={20} className="text-gray-400" />}
  </button>
);

export default SectionHeader;