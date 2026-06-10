// src/features/admin/components/StatsCard.jsx

import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color, trend, trendValue, delay = 0 }) => {
  const getColorStyles = () => {
    const colors = {
      purple: { bg: '#EEEDFE', icon: '#534AB7', text: '#534AB7' },
      green: { bg: '#EAF3DE', icon: '#1D9E75', text: '#3B6D11' },
      blue: { bg: '#E8F0FE', icon: '#1877F2', text: '#1A56DB' },
      orange: { bg: '#FEF3E8', icon: '#B45309', text: '#B45309' },
    };
    return colors[color] || colors.purple;
  };

  const styles = getColorStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value?.toLocaleString()}</p>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: styles.bg }}
        >
          <Icon size={20} style={{ color: styles.icon }} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;