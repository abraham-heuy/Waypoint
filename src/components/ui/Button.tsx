import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-dispatch-accent text-[#1a1200] hover:brightness-110',
  secondary: 'bg-dispatch-panel2 text-dispatch-text border border-dispatch-line hover:border-dispatch-dim',
  ghost: 'bg-transparent text-dispatch-dim hover:text-dispatch-text',
  danger: 'bg-dispatch-danger/90 text-white hover:brightness-110',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-3 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
