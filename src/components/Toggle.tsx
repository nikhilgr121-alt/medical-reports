import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, className }) => {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          checked ? 'bg-blue-600' : 'bg-slate-200'
        )}
      >
        <motion.span
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0"
        />
      </button>
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
    </div>
  );
};
