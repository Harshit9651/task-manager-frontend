import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, MessageCircle, Linkedin, Building2, ShieldCheck, Bell, Palette, Lock,
  CalendarClock, BarChart3, Globe, Loader2,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { useNotificationPreferences } from '../lib/hooks/useNotificationPreferences';

const integrations = [
  { name: 'AI Automation', desc: 'Auto-draft replies and score leads with AI', icon: Sparkles },
  { name: 'WhatsApp', desc: 'Reach leads directly over WhatsApp', icon: MessageCircle },
  { name: 'LinkedIn Automation', desc: 'Automate connection requests & InMail', icon: Linkedin },
  { name: 'Full CRM', desc: 'Deep pipeline management & forecasting', icon: Building2 },
];

const tabs = ['Profile', 'Notifications', 'Appearance', 'Security', 'Integrations'] as const;

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'America/New_York', label: 'New York (ET)' },
  { value: 'America/Chicago', label: 'Chicago (CT)' },
  { value: 'America/Denver', label: 'Denver (MT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AET)' },
];

// Reusable toggle switch.
function Toggle({
  checked,
  onChange,
  disabled,
  busy,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${
        checked ? 'bg-ink-900' : 'bg-ink-300'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      >
        {busy && <Loader2 className="h-3 w-3 animate-spin text-ink-400" />}
      </span>
    </button>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]>('Profile');

  const { prefs, savingField, setDailyReminder, setWeeklyReport, setTimezone } =
    useNotificationPreferences();

  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Settings" description="Manage your profile, preferences and connected tools." />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <Card className="p-2.5 h-fit lg:sticky lg:top-20">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  tab === t ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {tab === 'Profile' && (
            <Card className="p-6 sm:p-8">
              <h3 className="text-base font-semibold text-ink-900 mb-5">Google Profile</h3>
              <div className="flex items-center gap-4">
                <Avatar name={user?.name || 'User'} src={user?.avatar} size={64} />
                <div>
                  <p className="font-semibold text-ink-900">{user?.name}</p>
                  <p className="text-sm text-ink-500">{user?.email}</p>
                  <Badge tone="success" dot className="mt-2">Connected via Google</Badge>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Full name</label>
                  <input defaultValue={user?.name} className="w-full rounded-xl border border-ink-200 bg-ink-25 px-3.5 py-2.5 text-sm text-ink-600" disabled />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
                  <input defaultValue={user?.email} className="w-full rounded-xl border border-ink-200 bg-ink-25 px-3.5 py-2.5 text-sm text-ink-600" disabled />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Role</label>
                  <input defaultValue={user?.role} className="w-full rounded-xl border border-ink-200 bg-ink-25 px-3.5 py-2.5 text-sm text-ink-600" disabled />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Workspace</label>
                  <input defaultValue="Flowdesk — Growth Team" className="w-full rounded-xl border border-ink-200 bg-ink-25 px-3.5 py-2.5 text-sm text-ink-600" disabled />
                </div>
              </div>
              <p className="mt-4 text-xs text-ink-400">Profile fields are managed by your Google account and sync automatically.</p>
            </Card>
          )}

          {tab === 'Notifications' && (
            <Card className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100">
                  <Bell className="h-5 w-5 text-ink-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink-900">Email Notifications</h3>
                  <p className="text-sm text-ink-500 mt-1">
                    Manage how Flowdesk sends reminders and weekly reports.
                  </p>
                </div>
              </div>

              {/* Independent toggles */}
              <div className="rounded-2xl border border-ink-100 overflow-hidden bg-white">
                {/* Daily follow-up reminder */}
                <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
                  <div className="flex items-start gap-3 pr-6">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <CalendarClock className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-ink-900">Daily Follow-up Reminder</h4>
                      <p className="mt-1 text-sm text-ink-500 leading-6">
                        A morning email listing the leads you need to follow up with today, plus overdue ones and today's tasks.
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={prefs.dailyFollowUpReminder}
                    onChange={setDailyReminder}
                    disabled={savingField === 'dailyFollowUpReminder'}
                    busy={savingField === 'dailyFollowUpReminder'}
                  />
                </div>

                {/* Weekly report */}
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-start gap-3 pr-6">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-ink-900">Weekly Summary</h4>
                      <p className="mt-1 text-sm text-ink-500 leading-6">
                        A Monday report of your pipeline and tasks — new leads, wins, completions, and upcoming follow-ups.
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={prefs.weeklyReport}
                    onChange={setWeeklyReport}
                    disabled={savingField === 'weeklyReport'}
                    busy={savingField === 'weeklyReport'}
                  />
                </div>
              </div>

              {/* Timezone */}
              <div className="mt-6 rounded-2xl border border-ink-100 bg-white px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 pr-6">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-ink-900">Timezone</h4>
                      <p className="mt-1 text-sm text-ink-500 leading-6">
                        Reminders use this to decide which follow-ups count as “today” and when to send.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {savingField === 'timezone' && <Loader2 className="h-4 w-4 animate-spin text-ink-400" />}
                    <Select
                      value={prefs.timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      disabled={savingField === 'timezone'}
                      className="min-w-[190px]"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-brand-50 border border-brand-100 px-4 py-3">
                <p className="text-sm text-brand-800">
                  <span className="font-semibold">Note:</span> Each notification is controlled independently —
                  turn the daily reminder and weekly summary on or off separately.
                </p>
              </div>
            </Card>
          )}

          {tab === 'Appearance' && (
            <Card className="p-6 sm:p-8">
              <h3 className="text-base font-semibold text-ink-900 mb-5 flex items-center gap-2"><Palette className="h-4 w-4 text-ink-400" /> Appearance</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['Light'].map((mode, i) => (
                  <button
                    key={mode}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${
                      i === 0 ? 'border-brand-500 bg-brand-50' : 'border-ink-100 hover:border-ink-200'
                    }`}
                  >
                    <div className={`h-16 w-full rounded-lg mb-3 ${i === 1 ? 'bg-ink-900' : 'bg-white border border-ink-100'}`} />
                    <p className="text-sm font-medium text-ink-800">{mode}</p>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-400">Dark mode is coming soon — Flowdesk currently ships with the light theme.</p>
            </Card>
          )}

          {tab === 'Security' && (
            <Card className="p-6 sm:p-8">
              <h3 className="text-base font-semibold text-ink-900 mb-5 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-ink-400" /> Security</h3>
              <div className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3.5 mb-4">
                <div>
                  <p className="text-sm font-medium text-ink-800">Sign-in method</p>
                  <p className="text-xs text-ink-500 mt-0.5">Google OAuth — managed by Google</p>
                </div>
                <Badge tone="success" dot>Active</Badge>
              </div>
            </Card>
          )}

          {tab === 'Integrations' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {integrations.map((item) => (
                <Card key={item.name} className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-100 text-ink-500">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <Badge tone="neutral" className="flex items-center gap-1"><Lock className="h-3 w-3" /> Coming soon</Badge>
                  </div>
                  <h4 className="mt-4 font-semibold text-ink-900">{item.name}</h4>
                  <p className="text-sm text-ink-500 mt-1">{item.desc}</p>
                  <Button size="sm" variant="outline" className="mt-4" disabled>Connect</Button>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}