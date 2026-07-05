import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow && (
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-brand-600">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink-500 max-w-xl">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </motion.div>
  );
}
