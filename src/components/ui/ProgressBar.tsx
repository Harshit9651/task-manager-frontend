export default function ProgressBar({
  value,
  className = '',
  tone = 'brand',
}: {
  value: number;
  className?: string;
  tone?: 'brand' | 'success' | 'warning';
}) {
  const toneStyles = {
    brand: 'bg-brand-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
  }[tone];

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-ink-100 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${toneStyles}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
