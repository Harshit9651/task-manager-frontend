import type { HTMLAttributes, ReactNode } from 'react';

export default function Card({
  children,
  className = '',
  hoverable = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; hoverable?: boolean }) {
  return (
    <div
      className={`bg-white border border-ink-100 rounded-2xl shadow-card ${
        hoverable ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
