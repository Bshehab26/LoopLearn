import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiTruck } from 'react-icons/hi';
import SectionHeader from './SectionHeader';

const PromotionsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader icon={HiTruck} title="Promotions & Coupons" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100 p-6 text-gray-500">
            Coupon management coming soon.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromotionsSection;