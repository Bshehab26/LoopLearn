// src/features/admin/components/ReportCard.jsx

import { motion } from 'framer-motion';

const ReportCard = ({ title, value, icon: Icon, color, change, changeType, delay = 0 }) => {
  const getColorStyles = () => {
    const colors = {
      purple: { bg: '#EEEDFE', icon: '#534AB7' },
      green: { bg: '#EAF3DE', icon: '#1D9E75' },
      blue: { bg: '#E8F0FE', icon: '#1877F2' },
      orange: { bg: '#FEF3E8', icon: '#B45309' },
    };
    return colors[color] || colors.purple;
  };

  const styles = getColorStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: styles.bg }}
          >
            <Icon size={16} style={{ color: styles.icon }} />
          </div>
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        {change && (
          <span className={`text-xs font-medium ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'up' ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </motion.div>
  );
};

export default ReportCard;