// src/features/instructor/components/PromotionsSection.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiTruck, HiClock } from 'react-icons/hi';
import SectionHeader from './SectionHeader';

const PromotionsSection = ({ isExpanded, onToggle }) => {
  const isOpen = isExpanded;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <SectionHeader 
        icon={HiTruck} 
        title="Promotions & Coupons" 
        subtitle="Create discounts and promotional offers"
        isOpen={isOpen} 
        onToggle={onToggle}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 text-center">
              <div className="p-8 bg-gray-50 rounded-xl">
                <HiClock size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Coupon management coming soon!</p>
                <p className="text-sm text-gray-400 mt-2">You'll be able to create discount codes and run promotions</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromotionsSection;