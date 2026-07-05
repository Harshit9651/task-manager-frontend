// components/leads/LeadDetailModal.tsx
import { useState } from 'react';
import { X, Calendar, Trash2, Mail, Phone, Linkedin, Globe, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { LeadModel } from '../../models/lead.model';
import type { ILead } from '../../types/lead';

const PRESETS = [
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'Next week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
];

interface Props {
  lead: ILead;
  onClose: () => void;
  onSaveFollowUp: (nextFollowUp: string | null) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value || value === '—') return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-0.5 text-sm text-ink-800 break-words">{value}</p>
    </div>
  );
}

export default function LeadDetailModal({ lead, onClose, onSaveFollowUp, onDelete }: Props) {
  const model = LeadModel.from(lead);
  const [value, setValue] = useState(model.followUpInputValue);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const setPreset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(10, 0, 0, 0);
    setValue(LeadModel.toInputValue(d.toISOString()));
  };

  const saveFollowUp = async (clear = false) => {
    setSaving(true);
    try {
      await onSaveFollowUp(clear ? null : LeadModel.toISO(value));
      if (clear) setValue('');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(model.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-pop scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <Avatar name={model.name} size={44} />
            <div>
              <h3 className="font-semibold text-ink-900">{model.name}</h3>
              <p className="text-sm text-ink-400">{model.subtitle}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Badge tone={model.statusTone} className="capitalize">{model.statusLabel}</Badge>
                <Badge tone={model.temperatureTone} className="capitalize">{model.temperatureLabel}</Badge>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Follow-up scheduler */}
        <div className="border-b border-ink-100 px-5 py-4">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-600" />
            <span className="text-sm font-semibold text-ink-800">Next follow-up</span>
            {model.hasFollowUp && (
              <span className="text-xs text-ink-400">· currently {LeadModel.formatDateTime(lead.nextFollowUp)}</span>
            )}
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.days}
                onClick={() => setPreset(p.days)}
                className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="datetime-local"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm text-ink-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <Button onClick={() => saveFollowUp(false)} disabled={saving || !value}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            {model.hasFollowUp && (
              <Button variant="outline" onClick={() => saveFollowUp(true)} disabled={saving}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* All details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-5 py-5">
          <Field label="Email" value={model.email} />
          <Field label="Phone" value={model.phone} />
          <Field label="Source" value={model.sourceLabel} />
          <Field label="Company size" value={model.companySize} />
          <Field label="Location" value={model.location} />
          <Field label="Website" value={lead.website} />
          <Field label="LinkedIn" value={lead.linkedin} />
          <Field label="Last contacted" value={model.lastContactedLabel} />
          <Field label="Created" value={model.createdAtLabel} />
          {model.tags.length > 0 && (
            <div className="col-span-2">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-400">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {model.tags.map((t) => (
                  <span key={t} className="rounded-md bg-ink-100 px-2 py-0.5 text-xs text-ink-600">{t}</span>
                ))}
              </div>
            </div>
          )}
          {model.notes && (
            <div className="col-span-2">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-400">Notes</p>
              <p className="whitespace-pre-wrap text-sm text-ink-700">{model.notes}</p>
            </div>
          )}
        </div>

        {/* Quick links + delete */}
        <div className="flex items-center justify-between border-t border-ink-100 px-5 py-4">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 text-sm font-medium text-danger-500 hover:text-danger-600 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" /> {deleting ? 'Deleting…' : 'Delete lead'}
          </button>
          <div className="flex items-center gap-2 text-ink-400">
            <a href={`mailto:${model.email}`} className="rounded-lg p-2 hover:bg-ink-100 hover:text-brand-600"><Mail className="h-4 w-4" /></a>
            {model.phone && <a href={`tel:${model.phone}`} className="rounded-lg p-2 hover:bg-ink-100 hover:text-brand-600"><Phone className="h-4 w-4" /></a>}
            {lead.linkedin && <a href={lead.linkedin} target="_blank" rel="noreferrer" className="rounded-lg p-2 hover:bg-ink-100 hover:text-brand-600"><Linkedin className="h-4 w-4" /></a>}
            {lead.website && <a href={lead.website} target="_blank" rel="noreferrer" className="rounded-lg p-2 hover:bg-ink-100 hover:text-brand-600"><Globe className="h-4 w-4" /></a>}
            {model.location && <span className="rounded-lg p-2"><MapPin className="h-4 w-4" /></span>}
          </div>
        </div>
      </div>
    </div>
  );
}