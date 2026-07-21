import React from 'react';
import { motion } from 'framer-motion';

export default function MiniGrievanceGraph() {
  const data = [
    { label: 'Academic', pct: 40, color: 'bg-primary dark:bg-primary-dark' },
    { label: 'Hostel', pct: 30, color: 'bg-secondary dark:bg-secondary-dark' },
    { label: 'Admin', pct: 20, color: 'bg-accent dark:bg-accent-dark' },
    { label: 'Other', pct: 10, color: 'bg-danger dark:bg-danger-dark' },
  ];

  // Assuming 40 is the max value in your dataset to calculate percentage heights
  const maxVal = 40; 

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark w-full max-w-sm mx-auto shadow-sm"
    >
      <div className="flex items-end justify-between gap-1 sm:gap-2 h-32 w-full">
        {data.map((cat, idx) => (
          <div key={cat.label} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            
            {/* Bar Container with Gray Background Track */}
            <div className="w-full h-24 flex items-end justify-center px-0.5 sm:px-2">
              <div className="w-full max-w-[32px] h-full bg-border dark:bg-border-dark rounded-t-sm flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(cat.pct / maxVal) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1, ease: 'easeOut' }}
                  className={`w-full rounded-t-sm ${cat.color}`}
                />
              </div>
            </div>
            
            {/* Category Label */}
            <span className="text-[9px] sm:text-[10px] font-semibold text-text-secondary dark:text-text-secondary-dark truncate w-full text-center">
              {cat.label}
            </span>
            
            {/* Percentage */}
            <span className="text-[10px] sm:text-xs font-bold text-text-primary dark:text-text-primary-dark leading-none">
              {cat.pct}%
            </span>
            
          </div>
        ))}
      </div>
    </motion.div>
  );
}