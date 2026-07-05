import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, label, hint, className = '', id, ...props }, ref) => {
    return (
      <label className="block w-full" htmlFor={id}>
        {label && <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={`w-full rounded-xl border border-ink-200 bg-white py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100 ${
              icon ? 'pl-10 pr-3.5' : 'px-3.5'
            } ${className}`}
            {...props}
          />
        </div>
        {hint && <span className="mt-1.5 block text-xs text-ink-400">{hint}</span>}
      </label>
    );
  }
);
Input.displayName = 'Input';

export default Input;
