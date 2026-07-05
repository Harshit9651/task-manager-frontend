import { motion } from 'framer-motion';
import { weeklyActivity } from '../../data/dummyData';

export default function ActivityChart() {
  const max = Math.max(...weeklyActivity.map((d) => d.emails));

  return (
    <div className="flex h-56 items-end gap-3 sm:gap-5 px-1">
      {weeklyActivity.map((d, i) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-44 w-full items-end justify-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.emails / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
              className="w-full max-w-[18px] rounded-t-md bg-brand-200"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.replies / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.06 + 0.1, ease: 'easeOut' }}
              className="w-full max-w-[18px] rounded-t-md bg-brand-600"
            />
          </div>
          <span className="text-xs font-medium text-ink-400">{d.day}</span>
        </div>
      ))}
    </div>
  );
}
