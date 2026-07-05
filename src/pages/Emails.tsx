import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Inbox, Send, FileEdit, Star, PenSquare, Search, Paperclip, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { emails as initialEmails } from '../data/dummyData';
import type { Email, EmailFolder } from '../types';

const folders: { key: EmailFolder; label: string; icon: typeof Inbox }[] = [
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'drafts', label: 'Drafts', icon: FileEdit },
];

export default function Emails() {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [folder, setFolder] = useState<EmailFolder>('inbox');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [compose, setCompose] = useState({ to: '', subject: '', body: '' });

  const filtered = useMemo(() => {
    return emails.filter(
      (e) => e.folder === folder && (e.subject.toLowerCase().includes(search.toLowerCase()) || e.from.toLowerCase().includes(search.toLowerCase()))
    );
  }, [emails, folder, search]);

  const selected = emails.find((e) => e.id === selectedId) ?? filtered[0] ?? null;

  const toggleStar = (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)));
  };

  const sendEmail = () => {
    if (!compose.to.trim() || !compose.subject.trim()) return;
    const newEmail: Email = {
      id: `e${Date.now()}`,
      folder: 'sent',
      from: 'me@flowdesk.io',
      to: compose.to,
      subject: compose.subject,
      preview: compose.body.slice(0, 60),
      body: compose.body,
      date: 'Just now',
      read: true,
      starred: false,
    };
    setEmails((prev) => [newEmail, ...prev]);
    setCompose({ to: '', subject: '', body: '' });
    setComposeOpen(false);
    setFolder('sent');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Communication"
        title="Emails"
        description="Manage conversations across inbox, sent and drafts."
        actions={
          <Button icon={<PenSquare className="h-4 w-4" />} onClick={() => setComposeOpen(true)}>
            Compose
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Folder nav */}
        <Card className="p-3 h-fit lg:sticky lg:top-20">
          <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
            {folders.map((f) => {
              const count = emails.filter((e) => e.folder === f.key && (f.key !== 'inbox' || !e.read)).length;
              const isActive = folder === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => { setFolder(f.key); setSelectedId(null); }}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'
                  }`}
                >
                  <f.icon className="h-4 w-4" />
                  {f.label}
                  {f.key === 'inbox' && count > 0 && (
                    <span className={`ml-auto text-xs rounded-full px-1.5 ${isActive ? 'bg-white/20' : 'bg-brand-100 text-brand-700'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* List + reading pane */}
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-5">
          <Card className="overflow-hidden flex flex-col">
            <div className="p-3 border-b border-ink-100">
              <Input
                icon={<Search className="h-4 w-4" />}
                placeholder="Search mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto scrollbar-thin max-h-[560px]">
              {filtered.length === 0 ? (
                <div className="p-6">
                  <EmptyState icon={Inbox} title="No emails" description="This folder is empty." />
                </div>
              ) : (
                filtered.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => setSelectedId(email.id)}
                    className={`w-full text-left px-4 py-3.5 border-b border-ink-50 last:border-0 transition-colors ${
                      selected?.id === email.id ? 'bg-brand-50' : 'hover:bg-ink-25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${!email.read && folder === 'inbox' ? 'font-bold text-ink-900' : 'font-medium text-ink-700'}`}>
                        {folder === 'sent' ? email.to : email.from}
                      </p>
                      <span className="text-xs text-ink-400 shrink-0">{email.date}</span>
                    </div>
                    <p className="text-sm text-ink-700 truncate mt-0.5">{email.subject}</p>
                    <p className="text-xs text-ink-400 truncate mt-0.5">{email.preview}</p>
                  </button>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6 min-h-[400px]">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink-900">{selected.subject}</h3>
                    <p className="text-sm text-ink-500 mt-1">
                      {folder === 'sent' ? `To: ${selected.to}` : `From: ${selected.from}`} · {selected.date}
                    </p>
                  </div>
                  <button onClick={() => toggleStar(selected.id)}>
                    <Star className={`h-5 w-5 ${selected.starred ? 'fill-warning-500 text-warning-500' : 'text-ink-300'}`} />
                  </button>
                </div>
                <div className="border-t border-ink-100 pt-4 text-sm text-ink-700 leading-relaxed whitespace-pre-line">
                  {selected.body}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button size="sm" variant="outline">Reply</Button>
                  <Button size="sm" variant="ghost">Forward</Button>
                </div>
              </motion.div>
            ) : (
              <EmptyState icon={Inbox} title="Select an email" description="Choose a conversation from the list to read it here." />
            )}
          </Card>
        </div>
      </div>

      <Modal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        title="Compose Email"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>Discard</Button>
            <Button icon={<Send className="h-4 w-4" />} onClick={sendEmail}>Send</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="To"
            placeholder="recipient@company.com"
            value={compose.to}
            onChange={(e) => setCompose((c) => ({ ...c, to: e.target.value }))}
          />
          <Input
            label="Subject"
            placeholder="Write a subject..."
            value={compose.subject}
            onChange={(e) => setCompose((c) => ({ ...c, subject: e.target.value }))}
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-700">Message</span>
            <textarea
              rows={8}
              placeholder="Write your message..."
              value={compose.body}
              onChange={(e) => setCompose((c) => ({ ...c, body: e.target.value }))}
              className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100 resize-none"
            />
          </label>
          <button className="flex items-center gap-2 text-sm text-ink-500 hover:text-brand-600">
            <Paperclip className="h-4 w-4" /> Attach file
          </button>
        </div>
      </Modal>
    </div>
  );
}
