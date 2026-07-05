import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Linkedin, Building2, ShieldCheck, Bell, Palette, Lock } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const integrations = [
  { name: 'AI Automation', desc: 'Auto-draft replies and score leads with AI', icon: Sparkles },
  { name: 'WhatsApp', desc: 'Reach leads directly over WhatsApp', icon: MessageCircle },
  { name: 'LinkedIn Automation', desc: 'Automate connection requests & InMail', icon: Linkedin },
  { name: 'Full CRM', desc: 'Deep pipeline management & forecasting', icon: Building2 },
];

const tabs = ['Profile', 'Notifications', 'Appearance', 'Security', 'Integrations'] as const;

export default function Settings() {
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]>('Profile');
  const [notifs, setNotifs] = useState({ email: true, push: true, weekly: false });

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
              <h3 className="text-base font-semibold text-ink-900 mb-5 flex items-center gap-2"><Bell className="h-4 w-4 text-ink-400" /> Notification preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'email' as const, label: 'Email notifications', desc: 'Get notified about replies and task reminders' },
                  { key: 'push' as const, label: 'Push notifications', desc: 'Real-time alerts in your browser' },
                  { key: 'weekly' as const, label: 'Weekly summary', desc: 'A digest of pipeline performance every Monday' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-ink-800">{n.label}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs((s) => ({ ...s, [n.key]: !s[n.key] }))}
                      className={`relative h-6 w-11 rounded-full transition-colors ${notifs[n.key] ? 'bg-ink-900' : 'bg-ink-200'}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform ${notifs[n.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'Appearance' && (
            <Card className="p-6 sm:p-8">
              <h3 className="text-base font-semibold text-ink-900 mb-5 flex items-center gap-2"><Palette className="h-4 w-4 text-ink-400" /> Appearance</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['Light', 'Dark', 'System'].map((mode, i) => (
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
              <div className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-ink-800">Two-factor authentication</p>
                  <p className="text-xs text-ink-500 mt-0.5">Add an extra layer of security to your account</p>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
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
