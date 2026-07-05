function initialsFrom(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const palette = [
  'bg-brand-100 text-brand-700',
  'bg-accent-100 text-accent-600',
  'bg-success-50 text-success-600',
  'bg-warning-50 text-warning-600',
  'bg-danger-50 text-danger-600',
];

function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

export default function Avatar({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string;
  size?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-2 ring-white shadow-soft"
      />
    );
  }

  const colorClass = palette[hashSeed(name) % palette.length];

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`flex items-center justify-center rounded-full font-semibold ${colorClass}`}
    >
      {initialsFrom(name)}
    </div>
  );
}
