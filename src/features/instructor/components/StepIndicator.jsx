/**
 * StepIndicator.jsx
 * Visual indicator for multi-step wizard progress
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';

const StepIndicator = ({ currentStep, steps, stepNames }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted || isActive ? '#534AB7' : '#E5E7EB',
                    borderColor: isCompleted || isActive ? '#534AB7' : '#D1D5DB',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    ${isCompleted || isActive ? 'text-white' : 'text-gray-500'}
                  `}
                  style={{
                    backgroundColor: isCompleted || isActive ? '#534AB7' : '#F3F4F6',
                    border: `2px solid ${isCompleted || isActive ? '#534AB7' : '#E5E7EB'}`,
                  }}
                >
                  {isCompleted ? <HiCheck size={18} /> : stepNumber}
                </motion.div>
                
                {/* Step Label */}
                <p className={`text-xs mt-2 font-medium ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                  {stepNames[stepNumber]}
                </p>
              </div>
              
              {/* Connector Line (except for last step) */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 relative">
                  <div className="absolute inset-0 bg-gray-200 rounded-full" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: stepNumber < currentStep ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-purple-600 rounded-full"
                    style={{ width: stepNumber < currentStep ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;