import type {
  ILead,
  LeadStatus,
  LeadTemperature,
  LeadSource,
  CompanySize,
} from '../types/lead';

export type Tone = 'brand' | 'success' | 'warning' | 'neutral' | 'danger';
export type FollowUpUrgency = 'none' | 'overdue' | 'today' | 'tomorrow' | 'upcoming';
interface Props {
  lead: ILead;
  onClose: () => void;
  onEdit?: (id: string) => void;                                  // NEW
  onSaveFollowUp: (nextFollowUp: string | null) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}


const STATUS_TONE: Record<LeadStatus, Tone> = {
  new: 'brand',
  contacted: 'warning',
  follow_up: 'warning',
  meeting_scheduled: 'brand',
  proposal_sent: 'brand',
  negotiation: 'warning',
  won: 'success',
  lost: 'danger',
};

const TEMPERATURE_TONE: Record<LeadTemperature, Tone> = {
  hot: 'danger',
  warm: 'warning',
  cold: 'brand',
  unknown: 'neutral',
};

const TEMPERATURE_DOT: Record<LeadTemperature, string> = {
  hot: 'bg-danger-500',
  warm: 'bg-amber-500',
  cold: 'bg-brand-500',
  unknown: 'bg-ink-300',
};

const FOLLOW_UP_BADGE: Record<Exclude<FollowUpUrgency, 'none'>, string> = {
  overdue: 'text-danger-600 bg-danger-50',
  today: 'text-amber-700 bg-amber-50',
  tomorrow: 'text-ink-700 bg-ink-100',
  upcoming: 'text-ink-600 bg-ink-100',
};

const MS_PER_DAY = 86_400_000;


const titleize = (value: string): string =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const parseDate = (iso?: string | null): Date | null => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());


export class LeadModel {
  readonly raw: ILead;

  constructor(lead: ILead) {
    this.raw = lead;
  }

  static from(lead: ILead): LeadModel {
    return new LeadModel(lead);
  }

  static fromList(leads: ILead[]): LeadModel[] {
    return leads.map((lead) => new LeadModel(lead));
  }


  get id(): string {
    return this.raw._id;
  }

  get initials(): string {
    const parts = this.raw.contactName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  get name(): string {
    return this.raw.contactName;
  }

  get company(): string {
    return this.raw.company;
  }

  get email(): string {
    return this.raw.email;
  }

  get phone(): string | undefined {
    return this.raw.phone;
  }


  get subtitle(): string {
    return this.raw.designation ? `${this.raw.designation} · ${this.raw.company}` : this.raw.company;
  }


  get location(): string {
    return [this.raw.city, this.raw.country].filter(Boolean).join(', ');
  }

  get tags(): string[] {
    return this.raw.tags ?? [];
  }

  get notes(): string | undefined {
    return this.raw.notes;
  }

  get isArchived(): boolean {
    return this.raw.isArchived;
  }

  get status(): LeadStatus {
    return this.raw.status;
  }

  get statusLabel(): string {
    return titleize(this.raw.status);
  }

  get statusTone(): Tone {
    return STATUS_TONE[this.raw.status];
  }

  get temperature(): LeadTemperature {
    return this.raw.temperature;
  }

  get temperatureLabel(): string {
    return titleize(this.raw.temperature);
  }

  get temperatureTone(): Tone {
    return TEMPERATURE_TONE[this.raw.temperature];
  }

  get temperatureDotClass(): string {
    return TEMPERATURE_DOT[this.raw.temperature];
  }

  get source(): LeadSource {
    return this.raw.source;
  }

  get sourceLabel(): string {
    return titleize(this.raw.source);
  }

  get companySize(): CompanySize | undefined {
    return this.raw.companySize;
  }

  // ── Timestamps ──────────────────────────────────────────────────────────────
  get createdAtLabel(): string {
    return LeadModel.formatDate(this.raw.createdAt);
  }

  get lastContactedLabel(): string {
    return LeadModel.formatDateTime(this.raw.lastContactedAt);
  }

  // ── Follow-up logic (drives the schedule column + reminders feature) ────────
  get followUpDate(): Date | null {
    return parseDate(this.raw.nextFollowUp);
  }

  get hasFollowUp(): boolean {
    return this.followUpDate !== null;
  }

  /** Whole-day difference between the follow-up date and today (null if unset). */
  private get daysUntilFollowUp(): number | null {
    const d = this.followUpDate;
    if (!d) return null;
    return Math.round((startOfDay(d).getTime() - startOfDay(new Date()).getTime()) / MS_PER_DAY);
  }

  get followUpUrgency(): FollowUpUrgency {
    const diff = this.daysUntilFollowUp;
    if (diff === null) return 'none';
    if (diff < 0) return 'overdue';
    if (diff === 0) return 'today';
    if (diff === 1) return 'tomorrow';
    return 'upcoming';
  }

  get isOverdue(): boolean {
    return this.followUpUrgency === 'overdue';
  }

  get isDueToday(): boolean {
    return this.followUpUrgency === 'today';
  }

  /** e.g. "Overdue · Jul 2, 2026", "Today", "In 4 days · Jul 8, 2026" — "" when unset. */
  get followUpLabel(): string {
    const d = this.followUpDate;
    if (!d) return '';
    const dateStr = LeadModel.formatDate(this.raw.nextFollowUp);
    switch (this.followUpUrgency) {
      case 'overdue':
        return `Overdue · ${dateStr}`;
      case 'today':
        return 'Today';
      case 'tomorrow':
        return 'Tomorrow';
      default:
        return `In ${this.daysUntilFollowUp} days · ${dateStr}`;
    }
  }

  /** Tailwind classes for the follow-up badge — "" when there's no follow-up. */
  get followUpBadgeClass(): string {
    const urgency = this.followUpUrgency;
    return urgency === 'none' ? '' : FOLLOW_UP_BADGE[urgency];
  }

  /** Value for an <input type="datetime-local"> (empty string when unset). */
  get followUpInputValue(): string {
    return LeadModel.toInputValue(this.raw.nextFollowUp);
  }

  /** The untouched raw lead — use for editing forms and service calls. */
  toJSON(): ILead {
    return this.raw;
  }

  // ── Static formatting utilities (usable without an instance) ────────────────
  static formatDate(iso?: string | null): string {
    const d = parseDate(iso);
    return d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  }

  static formatDateTime(iso?: string | null): string {
    const d = parseDate(iso);
    return d ? d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  }

  /** ISO string → "YYYY-MM-DDTHH:mm" for datetime-local inputs. */
  static toInputValue(iso?: string | null): string {
    const d = parseDate(iso);
    if (!d) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /** datetime-local value → ISO string (empty input → null). */
  static toISO(inputValue: string): string | null {
    if (!inputValue) return null;
    const d = new Date(inputValue);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
}