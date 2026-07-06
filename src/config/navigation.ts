import type { NavItem } from '../types';

export const primaryNav: NavItem[] = [
  { label: 'Dashboard', path: '/app', icon: 'LayoutDashboard' },
  { label: 'Daily Tasks', path: '/app/tasks', icon: 'ListChecks' },
  { label: 'Add Leads', path: '/app/leads/add', icon: 'UserPlus' },
  { label: 'Total Leads', path: '/app/leads', icon: 'Users' },
  { label: 'Emails', path: '/app/emails', icon: 'Mail' },
  { label: 'Bulk Email', path: '/app/bulk-email', icon: 'Rocket' },
  { label: 'Settings', path: '/app/settings', icon: 'Settings' },
  {label: 'White Board', path:'/app/whiteboards',icon:'LayoutDashboard'}
];

export const comingSoonNav: NavItem[] = [
  { label: 'AI Automation', path: '#', icon: 'Sparkles' },
  { label: 'WhatsApp', path: '#', icon: 'MessageCircle' },
  { label: 'LinkedIn Automation', path: '#', icon: 'Linkedin' },
  { label: 'CRM', path: '#', icon: 'Building2' },
];
