import React from 'react';

export interface BadgeProps {
  variant?: 'available' | 'limited' | 'popular' | 'neutral' | 'olive';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
  dot = false
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide';
  
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5'
  };

  const variantStyles = {
    available: 'bg-[#EAF5EA] text-[#2E7D32] border border-[#C8E6C9]',
    limited: 'bg-[#FEF3EB] text-[#C05621] border border-[#FCD9BD]',
    popular: 'bg-[#263626] text-white',
    olive: 'bg-[#E3EBE3] text-[#263626] border border-[#CFDCCF]',
    neutral: 'bg-[#F2EEE7] text-[#5C665C] border border-[#E5E1D8]'
  };

  const dotColors = {
    available: 'bg-[#2E7D32]',
    limited: 'bg-[#C05621]',
    popular: 'bg-[#C29B38]',
    olive: 'bg-[#263626]',
    neutral: 'bg-[#5C665C]'
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};
