import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

const SectionHeader = ({ icon: Icon, title, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <Icon size={20} className="text-purple-600" />
      </div>
      <div className="text-left">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">Manage your course details</p>
      </div>
    </div>
    {isOpen ? <HiChevronUp size={20} className="text-gray-400" /> : <HiChevronDown size={20} className="text-gray-400" />}
  </button>
);

export default SectionHeader;