import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCurrencyDollar } from 'react-icons/hi';
import SectionHeader from './SectionHeader';

const PricingSection = ({ data, onUpdate, isEditable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const priceOptions = [19.99, 29.99, 49.99, 69.99, 99.99, 199.99];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader icon={HiCurrencyDollar} title="Pricing" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100">
            <div className="p-6">
              <label className="flex items-center gap-3 mb-4">
                <input type="checkbox" checked={data.isFree === true} onChange={(e) => onUpdate({ isFree: e.target.checked, price: e.target.checked ? 0 : data.price })} disabled={!isEditable} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                <span className="text-gray-700">Make this course free</span>
              </label>
              {!data.isFree && (
                <>
                  <label className="block font-semibold text-gray-800 mb-2">Course Price (USD)</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {priceOptions.map((price) => (
                      <button key={price} onClick={() => onUpdate({ price, isFree: false })} disabled={!isEditable} className={`px-5 py-2 rounded-full border transition ${data.price === price ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 text-gray-700 hover:border-purple-400'}`}>${price}</button>
                    ))}
                  </div>
                  <input type="number" value={data.price || ''} onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0, isFree: false })} placeholder="Custom price" disabled={!isEditable} className="w-48 px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-400 outline-none disabled:bg-gray-100" />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingSection;