'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-bakery-gold text-white hover:bg-bakery-gold/90 shadow-lg shadow-bakery-gold/20',
      secondary: 'bg-bakery-brown text-white hover:bg-bakery-brown/90 shadow-lg shadow-bakery-brown/20',
      outline: 'border-2 border-bakery-gold text-bakery-gold hover:bg-bakery-gold/5',
      ghost: 'text-bakery-brown hover:bg-bakery-brown/5'
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-8 py-4 text-sm font-bold',
      lg: 'px-10 py-5 text-base font-bold'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
