import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Sparkles, UserPlus, Send, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import StatCardItem from '../components/dashboard/StatCardItem';
import ActivityChart from '../components/dashboard/ActivityChart';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { dashboardStats, tasks, leads } from '../data/dummyData';
import { useAuth } from '../context/AuthContext';

const statusTone: Record<string, 'brand' | 'success' | 'warning' | 'neutral' | 'danger'> = {
  new: 'brand',
  contacted: 'warning',
  qualified: 'success',
  won: 'success',
  lost: 'danger',
};

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? 'there';
  const todaysTasks = tasks.slice(0, 5);
  const recentLeads = leads.slice(0, 5);

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title={`Good to see you, ${firstName}`}
        description="Here's what's happening across your pipeline today."
        actions={
          <>
            <Link to="/app/leads/add">
              <Button variant="outline" size="md" icon={<UserPlus className="h-4 w-4" />}>Add Lead</Button>
            </Link>
            <Link to="/app/bulk-email">
              <Button variant="primary" size="md" icon={<Send className="h-4 w-4" />}>New Campaign</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, i) => (
          <StatCardItem key={stat.id} stat={stat} index={i} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="xl:col-span-2"
        >
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-base font-semibold text-ink-900">Weekly outreach activity</h3>
                <p className="text-sm text-ink-500 mt-0.5">Emails sent vs. replies received</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-ink-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand-200" /> Sent</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand-600" /> Replies</span>
              </div>
            </div>
            <div className="mt-4">
              <ActivityChart />
            </div>
          </Card>
        </motion.div>

        {/* Today's tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
        >
          <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-ink-900">Today's tasks</h3>
              <Link to="/app/tasks" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-1 flex-1">
              {todaysTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-ink-25 transition-colors">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="h-[18px] w-[18px] mt-0.5 shrink-0 text-success-500" />
                  ) : (
                    <Circle className="h-[18px] w-[18px] mt-0.5 shrink-0 text-ink-300" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'text-ink-400 line-through' : 'text-ink-800'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">{task.dueTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent leads table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="xl:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-ink-900">Recent leads</h3>
              <Link to="/app/leads" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto scrollbar-thin -mx-1">
              <table className="w-full min-w-[480px] text-sm">
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-25 transition-colors">
                      <td className="py-3 px-1">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.name} size={32} />
                          <div className="min-w-0">
                            <p className="font-medium text-ink-800 truncate">{lead.name}</p>
                            <p className="text-xs text-ink-400 truncate">{lead.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-1 text-ink-500 hidden sm:table-cell">{lead.email}</td>
                      <td className="py-3 px-1 text-right">
                        <Badge tone={statusTone[lead.status]} className="capitalize">{lead.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Coming soon teaser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.34 }}
        >
          <Card className="p-6 h-full bg-ink-950 text-white border-0 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 0%, rgba(74,85,184,0.6), transparent 55%)' }}
            />
            <div className="relative z-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 mb-4">
                <Sparkles className="h-5 w-5 text-accent-300" />
              </span>
              <h3 className="text-base font-semibold">Expand your workspace</h3>
              <p className="text-sm text-ink-300 mt-2 leading-relaxed">
                AI Automation, WhatsApp & LinkedIn outreach, and a full CRM are on the way — built
                right into Flowdesk.
              </p>
              <div className="mt-5 space-y-2">
                {['AI Automation', 'WhatsApp Outreach', 'Full CRM'].map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-ink-200">
                    <Building2 className="h-3.5 w-3.5 text-ink-400" />
                    {f}
                    <Badge tone="neutral" className="ml-auto bg-white/10 text-white">Soon</Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
