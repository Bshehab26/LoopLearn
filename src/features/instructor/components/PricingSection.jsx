// src/features/instructor/components/PricingSection.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCurrencyDollar } from 'react-icons/hi';
import SectionHeader from './SectionHeader';

// Get currency from env
const CURRENCY = import.meta.env.VITE_CURRENCY || 'USD';
const CURRENCY_SYMBOL = CURRENCY === 'EGP' ? 'EGP' : '$';

const PricingSection = ({ data, onUpdate, isEditable, isExpanded, onToggle }) => {
  const isOpen = isExpanded;
  
  // Price options based on currency
  const getPriceOptions = () => {
    if (CURRENCY === 'EGP') {
      return [199, 299, 499, 699, 999, 1499, 1999, 2999];
    }
    return [19.99, 29.99, 49.99, 69.99, 99.99, 199.99];
  };
  
  const priceOptions = getPriceOptions();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <SectionHeader 
        icon={HiCurrencyDollar} 
        title="Pricing" 
        subtitle={`Set the right price for your course (${CURRENCY})`}
        isOpen={isOpen} 
        onToggle={onToggle}
        badge="Required"
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6">
              <label className="flex items-center gap-3 mb-6 p-4 bg-purple-50 rounded-xl cursor-pointer hover:bg-purple-100 transition">
                <input 
                  type="checkbox" 
                  checked={data.isFree === true} 
                  onChange={(e) => onUpdate({ isFree: e.target.checked, price: e.target.checked ? 0 : data.price })} 
                  disabled={!isEditable} 
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" 
                />
                <div>
                  <span className="text-gray-700 font-medium">Make this course free</span>
                  <p className="text-xs text-gray-500 mt-0.5">Free courses cannot generate revenue</p>
                </div>
              </label>
              
              {!data.isFree && (
                <>
                  <label className="block font-semibold text-gray-800 mb-3">
                    Course Price ({CURRENCY})
                  </label>
                  <div className="flex flex-wrap gap-3 mb-5">
                    {priceOptions.map((price) => (
                      <button
                        key={price}
                        onClick={() => onUpdate({ price, isFree: false })}
                        disabled={!isEditable}
                        className={`px-5 py-2.5 rounded-xl border-2 transition-all ${
                          data.price === price 
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                            : 'border-gray-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        {CURRENCY_SYMBOL}{price}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-2">Custom price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        {CURRENCY_SYMBOL}
                      </span>
                      <input 
                        type="number" 
                        value={data.price || ''} 
                        onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0, isFree: false })} 
                        placeholder="0.00" 
                        disabled={!isEditable} 
                        className="w-48 pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none disabled:bg-gray-100"
                        step={CURRENCY === 'EGP' ? "1" : "0.01"}
                        min="0"
                      />
                    </div>
                  </div>
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