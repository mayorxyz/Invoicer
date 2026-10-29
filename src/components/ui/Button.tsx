import React from 'react';
import { Icon } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  loading?: boolean;
  icon?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  style,
  onClick,
  onTouchEnd,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer touch-manipulation select-none';
  
  const variantClasses = {
    primary: 'bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]',
    secondary: 'bg-surface text-foreground border border-border hover:bg-background-subtle active:scale-[0.98]',
    ghost: 'text-foreground hover:bg-background-subtle active:scale-[0.98]',
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm rounded-sm',
    md: 'h-10 md:h-11 px-3.5 md:px-4 text-sm md:text-base rounded-[10px]',
    lg: 'h-12 px-5 text-base rounded-[10px]',
  };
  
  const arrowTileClasses = {
    primary: 'w-7 h-7 rounded-lg bg-accent flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
    secondary: 'w-7 h-7 rounded-lg bg-foreground flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
    ghost: '',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      style={style}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      {...props}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <span>{children}</span>
      )}
      {arrow && !loading && variant !== 'ghost' && (
        <div className={arrowTileClasses[variant]}>
          <Icon name="arrow-up-right" size={16} weight="bold" color={variant === 'primary' ? 'var(--accent-contrast)' : 'var(--background)'} />
        </div>
      )}
      {arrow && !loading && variant === 'ghost' && (
        <Icon name="arrow-up-right" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </button>
  );
}

// Icon-only button
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function IconButton({ icon, size = 'md', variant = 'ghost', className = '', style, onClick, onTouchEnd, ...props }: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const variantClasses = {
    primary: 'bg-foreground text-background hover:bg-foreground/90 active:scale-[0.95]',
    secondary: 'bg-surface text-foreground border border-border hover:bg-background-subtle active:scale-[0.95]',
    ghost: 'text-foreground hover:bg-background-subtle active:scale-[0.95]',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-sm transition-all duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame cursor-pointer touch-manipulation select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={style}
      onClick={onClick}
      onTouchEnd={onTouchEnd}
      {...props}
    >
      <Icon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
    </button>
  );
}