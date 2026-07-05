import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Rocket, Users, MailCheck, MessageSquareReply, TrendingUp, Play, Pause, MoreHorizontal, FileSpreadsheet } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import { campaigns as initialCampaigns } from '../data/dummyData';
import type { Campaign, CampaignStatus } from '../types';

const statusTone: Record<CampaignStatus, 'brand' | 'success' | 'warning' | 'neutral' | 'danger'> = {
  draft: 'neutral',
  scheduled: 'brand',
  active: 'success',
  completed: 'neutral',
  paused: 'warning',
};

export default function BulkEmail() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [createOpen, setCreateOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: '', subject: '', recipients: '' });

  const totals = campaigns.reduce(
    (acc, c) => ({
      recipients: acc.recipients + c.recipients,
      sent: acc.sent + c.sent,
      opened: acc.opened + c.opened,
      replied: acc.replied + c.replied,
    }),
    { recipients: 0, sent: 0, opened: 0, replied: 0 }
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.status === 'active') return { ...c, status: 'paused' };
        if (c.status === 'paused') return { ...c, status: 'active' };
        return c;
      })
    );
  };

  const createCampaign = () => {
    if (!form.name.trim()) return;
    const recipients = parseInt(form.recipients) || 0;
    const newCampaign: Campaign = {
      id: `c${Date.now()}`,
      name: form.name,
      status: 'draft',
      recipients,
      sent: 0,
      opened: 0,
      replied: 0,
      bounced: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    setForm({ name: '', subject: '', recipients: '' });
    setFileName(null);
    setCreateOpen(false);
  };

  const stats = [
    { label: 'Total Recipients', value: totals.recipients.toLocaleString(), icon: Users },
    { label: 'Emails Sent', value: totals.sent.toLocaleString(), icon: MailCheck },
    { label: 'Opened', value: totals.opened.toLocaleString(), icon: TrendingUp },
    { label: 'Replies', value: totals.replied.toLocaleString(), icon: MessageSquareReply },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Growth"
        title="Bulk Email"
        description="Launch and monitor outreach campaigns at scale."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
            Create Campaign
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.35 }}>
            <Card className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mb-3">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-semibold text-ink-900 font-display">{s.value}</p>
              <p className="text-sm text-ink-500 mt-0.5">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {campaigns.length === 0 ? (
        <EmptyState icon={Rocket} title="No campaigns yet" description="Create your first bulk email campaign to get started." />
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign, i) => {
            const openRate = campaign.sent ? Math.round((campaign.opened / campaign.sent) * 100) : 0;
            const replyRate = campaign.sent ? Math.round((campaign.replied / campaign.sent) * 100) : 0;
            const progress = campaign.recipients ? Math.round((campaign.sent / campaign.recipients) * 100) : 0;

            return (
              <motion.div key={campaign.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }}>
                <Card className="p-5 sm:p-6" hoverable>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-semibold text-ink-900">{campaign.name}</h3>
                        <Badge tone={statusTone[campaign.status]} dot className="capitalize">{campaign.status}</Badge>
                      </div>
                      <p className="text-xs text-ink-400 mt-1">Created {campaign.createdAt} · {campaign.recipients.toLocaleString()} recipients</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(campaign.status === 'active' || campaign.status === 'paused') && (
                        <Button size="sm" variant="outline" icon={campaign.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} onClick={() => toggleCampaignStatus(campaign.id)}>
                          {campaign.status === 'active' ? 'Pause' : 'Resume'}
                        </Button>
                      )}
                      <button className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
                      <span>Sent progress</span>
                      <span>{campaign.sent.toLocaleString()} / {campaign.recipients.toLocaleString()}</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>

                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-ink-100 pt-4">
                    <div>
                      <p className="text-lg font-semibold text-ink-900">{campaign.opened.toLocaleString()}</p>
                      <p className="text-xs text-ink-400">Opened ({openRate}%)</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-ink-900">{campaign.replied.toLocaleString()}</p>
                      <p className="text-xs text-ink-400">Replied ({replyRate}%)</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-ink-900">{campaign.bounced.toLocaleString()}</p>
                      <p className="text-xs text-ink-400">Bounced</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-ink-900">{campaign.recipients - campaign.sent}</p>
                      <p className="text-xs text-ink-400">Remaining</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Campaign"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button icon={<Rocket className="h-4 w-4" />} onClick={createCampaign}>Launch Campaign</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Campaign name"
            placeholder="e.g. Q4 Enterprise Outreach"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Email subject line"
            placeholder="e.g. Quick question about {{company}}"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          />
          <Input
            label="Number of recipients"
            type="number"
            placeholder="e.g. 500"
            value={form.recipients}
            onChange={(e) => setForm((f) => ({ ...f, recipients: e.target.value }))}
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink-700">Recipient list</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-ink-25 py-8 text-ink-500 hover:border-brand-300 hover:bg-brand-50/50 transition-colors"
            >
              {fileName ? (
                <>
                  <FileSpreadsheet className="h-6 w-6 text-brand-600" />
                  <span className="text-sm font-medium text-ink-700">{fileName}</span>
                  <span className="text-xs text-ink-400">Click to replace</span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">Upload CSV file</span>
                  <span className="text-xs text-ink-400">or drag and drop</span>
                </>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
