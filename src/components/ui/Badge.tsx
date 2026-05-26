import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'gray';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export default function Badge({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const variantClasses = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-200',
    secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
    accent: 'bg-accent-50 text-accent-700 border border-accent-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs font-medium rounded',
    md: 'px-3 py-1.5 text-sm font-medium rounded-lg',
  };

  return (
    <div
      className={`${variantClasses[variant]} ${sizeClasses[size]} inline-block ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
