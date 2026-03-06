import React from 'react';
import { cn } from './Button';

export const Badge = ({ children, variant = 'gray', className, ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none",
        {
          'bg-gray-100 text-gray-800': variant === 'gray',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-red-100 text-red-800': variant === 'danger',
          'bg-primary-100 text-primary-800': variant === 'primary',
          'bg-blue-100 text-blue-800': variant === 'info',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
