export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueTime: string;
  priority: TaskPriority;
  status: TaskStatus;
  tag: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export interface Lead {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  website?: string;
  notes?: string;
  status: LeadStatus;
  createdAt: string;
  avatarSeed: string;
}

export type EmailFolder = 'inbox' | 'sent' | 'drafts';

export interface Email {
  id: string;
  folder: EmailFolder;
  from: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  recipients: number;
  sent: number;
  opened: number;
  replied: number;
  bounced: number;
  createdAt: string;
}

export interface StatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}
