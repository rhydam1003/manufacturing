import React from 'react';
import { Loader2, Factory } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ 
  size = 'default', 
  className, 
  showIcon = false,
  text = 'Loading...',
  variant = 'default' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const variantClasses = {
    default: 'text-primary',
    muted: 'text-muted-foreground',
    white: 'text-white',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      {showIcon && (
        <div className="relative">
          <Factory className={cn(sizeClasses[size], variantClasses[variant])} />
          <Loader2 
            className={cn(
              'absolute -top-1 -right-1 animate-spin',
              size === 'sm' ? 'h-3 w-3' : 
              size === 'default' ? 'h-4 w-4' :
              size === 'lg' ? 'h-5 w-5' : 'h-6 w-6',
              variantClasses[variant]
            )} 
          />
        </div>
      )}
      {!showIcon && (
        <Loader2 
          className={cn(
            'animate-spin',
            sizeClasses[size],
            variantClasses[variant]
          )} 
        />
      )}
      {text && (
        <p className={cn(
          'font-medium smooth-transition',
          textSizeClasses[size],
          variantClasses[variant]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;