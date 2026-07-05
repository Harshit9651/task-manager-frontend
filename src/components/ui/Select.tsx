import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className = '', id, children, ...props }, ref) => {
    return (
      <label className="block w-full" htmlFor={id}>
        {label && <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`w-full appearance-none rounded-xl border border-ink-200 bg-white py-2.5 pl-3.5 pr-9 text-sm text-ink-800 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100 ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        </div>
      </label>
    );
  }
);
Select.displayName = 'Select';

export default Select;
