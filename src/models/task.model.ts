import type { ITask, TaskPriority, TaskStatus } from '../types/task';

export type Tone = 'brand' | 'success' | 'warning' | 'neutral' | 'danger';

const PRIORITY_TONE: Record<TaskPriority, Tone> = {
  low: 'brand',
  medium: 'warning',
  high: 'danger',
};

const parseISODate = (iso: string): Date | null => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

export class TaskModel {
  readonly raw: ITask;

  constructor(task: ITask) {
    this.raw = task;
  }

  static from(task: ITask): TaskModel {
    return new TaskModel(task);
  }

  get id(): string {
    return this.raw._id;
  }

  get title(): string {
    return this.raw.title;
  }

  get description(): string | undefined {
    return this.raw.description;
  }

  get dueTime(): string {
    return this.raw.dueTime || '';
  }

  get tag(): string {
    return this.raw.tag;
  }

  get date(): string {
    return this.raw.date;
  }

  get priority(): TaskPriority {
    return this.raw.priority;
  }

  get priorityTone(): Tone {
    return PRIORITY_TONE[this.raw.priority];
  }

  get isHighPriority(): boolean {
    return this.raw.priority === 'high';
  }

  get status(): TaskStatus {
    return this.raw.status;
  }

  get isCompleted(): boolean {
    return this.raw.status === 'completed';
  }


  get dateLabel(): string {
    const d = parseISODate(this.raw.date);
    return d
      ? d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      : this.raw.date;
  }

  toJSON(): ITask {
    return this.raw;
  }

  static todayISO(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  static formatDateLabel(iso: string): string {
    const d = parseISODate(iso);
    return d
      ? d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      : iso;
  }

  static groupByDate(tasks: ITask[]): [string, ITask[]][] {
    const map = new Map<string, ITask[]>();
    for (const t of tasks) {
      const arr = map.get(t.date);
      if (arr) arr.push(t);
      else map.set(t.date, [t]);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }
}