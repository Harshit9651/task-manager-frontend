import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800 shadow-soft',
  secondary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-soft',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-100',
  outline: 'bg-white text-ink-700 border border-ink-200 hover:border-ink-300 hover:bg-ink-50',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
};

const sizeStyles: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-base px-5 py-3 gap-2.5 rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
