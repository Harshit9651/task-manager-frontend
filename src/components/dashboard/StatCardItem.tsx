import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, ListChecks, Users, Send, MessageSquareText, type LucideIcon } from 'lucide-react';
import type { StatCard } from '../../types';
import Card from '../ui/Card';

const iconMap: Record<string, LucideIcon> = { ListChecks, Users, Send, MessageSquareText };

export default function StatCardItem({ stat, index }: { stat: StatCard; index: number }) {
  const Icon = iconMap[stat.icon] ?? ListChecks;
  const positive = stat.trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Card hoverable className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="h-5 w-5" />
          </div>
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              positive ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'
            }`}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {stat.change}
          </span>
        </div>
        <p className="mt-4 text-3xl font-semibold text-ink-900 font-display">{stat.value}</p>
        <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
      </Card>
    </motion.div>
  );
}
