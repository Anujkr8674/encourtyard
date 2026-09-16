import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-[#263626] text-white hover:bg-[#3A4D3A] focus:ring-[#263626] shadow-sm hover:shadow-warm active:translate-y-[1px]',
    secondary: 'bg-[#F7F5F0] text-[#263626] border border-[#E5E1D8] hover:bg-[#EAE5DB] hover:border-[#DCD7CA] focus:ring-[#263626]',
    outline: 'bg-transparent text-[#263626] border border-[#263626] hover:bg-[#263626] hover:text-white focus:ring-[#263626]',
    white: 'bg-white text-[#263626] border border-transparent hover:bg-[#FAF9F5] shadow-sm hover:shadow-warm focus:ring-white',
    ghost: 'bg-transparent text-[#263626] hover:text-[#3A4D3A] hover:bg-[#263626]/5 p-0 focus:ring-transparent'
  };

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`group ${combinedStyles}`}>
        {content}
      </Link>
    );
  }

  return (
    <button className={`group ${combinedStyles}`} {...props}>
      {content}
    </button>
  );
};
