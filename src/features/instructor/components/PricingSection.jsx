// src/features/instructor/components/PricingSection.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCurrencyDollar, HiCheck, HiX, HiSparkles } from 'react-icons/hi';
import SectionHeader from './SectionHeader';

const CURRENCY = import.meta.env.VITE_CURRENCY || 'USD';
const CURRENCY_SYMBOL = CURRENCY === 'EGP' ? 'EGP' : '$';

const PricingSection = ({ data, onUpdate, isEditable, isExpanded, onToggle }) => {
  const [customPrice, setCustomPrice] = useState(data.price || '');

  const priceOptions = CURRENCY === 'EGP' 
    ? [199, 299, 499, 699, 999, 1499, 1999]
    : [19.99, 29.99, 49.99, 69.99, 99.99, 149.99, 199.99];

  const handlePriceSelect = (price) => {
    onUpdate({ price, isFree: false });
    setCustomPrice(price);
  };

  const handleCustomPrice = (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      onUpdate({ price: num, isFree: false });
      setCustomPrice(num);
    } else {
      setCustomPrice(value);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <SectionHeader
        icon={HiCurrencyDollar}
        title="Pricing"
        subtitle={`Set the right price for your course (${CURRENCY})`}
        isOpen={isExpanded}
        onToggle={onToggle}
        badge="Required"
      />
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-6">
              {/* Free Course Option */}
              <div className={`rounded-xl p-5 transition-all ${data.isFree ? 'bg-purple-50 border-2 border-purple-300' : 'bg-gray-50 border border-gray-200'}`}>
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.isFree === true}
                    onChange={(e) => onUpdate({ isFree: e.target.checked, price: e.target.checked ? 0 : data.price })}
                    disabled={!isEditable}
                    className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">Free Course</span>
                      {data.isFree && <HiCheck className="text-green-600" size={18} />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Students can enroll for free. Free courses cannot generate revenue.
                    </p>
                  </div>
                </label>
              </div>

              {/* Paid Course Options */}
              {!data.isFree && (
                <div className="space-y-5">
                  <div>
                    <label className="block font-medium text-gray-800 mb-3">Suggested Prices</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {priceOptions.map((price) => (
                        <button
                          key={price}
                          onClick={() => handlePriceSelect(price)}
                          disabled={!isEditable}
                          className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                            data.price === price
                              ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                              : 'border-gray-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                          }`}
                        >
                          {CURRENCY_SYMBOL}{price}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-800 mb-2">Custom Price</label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        {CURRENCY_SYMBOL}
                      </span>
                      <input
                        type="number"
                        value={customPrice}
                        onChange={(e) => handleCustomPrice(e.target.value)}
                        placeholder="0.00"
                        disabled={!isEditable}
                        step={CURRENCY === 'EGP' ? "1" : "0.01"}
                        min="0"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none disabled:bg-gray-100"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Enter any price you think is fair for your course
                    </p>
                  </div>

                  {/* Revenue Share Info */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <HiSparkles className="text-purple-600" size={18} />
                      <span className="text-sm font-medium text-purple-800">Revenue Share</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      You earn 70% of each sale after platform fees. At ${data.price || 0}, you earn approximately ${((data.price || 0) * 0.7).toFixed(2)} per sale.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingSection;