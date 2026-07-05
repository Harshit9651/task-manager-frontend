import type { Task, Lead, Email, Campaign, StatCard } from '../types';

export const currentUser = {
  name: 'Ariana Cole',
  email: 'ariana.cole@flowdesk.io',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
  role: 'Growth Lead',
};

export const dashboardStats: StatCard[] = [
  { id: 'tasks', label: "Today's Tasks", value: '8', change: '+2 from yesterday', trend: 'up', icon: 'ListChecks' },
  { id: 'leads', label: 'Total Leads', value: '1,248', change: '+64 this week', trend: 'up', icon: 'Users' },
  { id: 'emails', label: 'Emails Sent', value: '3,902', change: '+18.4%', trend: 'up', icon: 'Send' },
  { id: 'replies', label: 'Replies', value: '312', change: '-3.1%', trend: 'down', icon: 'MessageSquareText' },
];

export const tasks: Task[] = [
  { id: 't1', title: 'Follow up with Nimbus Retail', description: 'Send pricing deck and case study', dueTime: '09:30 AM', priority: 'high', status: 'pending', tag: 'Outreach' },
  { id: 't2', title: 'Review bulk campaign performance', description: 'Q3 cold outreach campaign report', dueTime: '11:00 AM', priority: 'medium', status: 'pending', tag: 'Analytics' },
  { id: 't3', title: 'Call with Marcus @ Verdant Labs', description: 'Discovery call, 30 min', dueTime: '01:00 PM', priority: 'high', status: 'completed', tag: 'Calls' },
  { id: 't4', title: 'Update CRM lead statuses', description: 'Mark closed-won deals from last week', dueTime: '02:30 PM', priority: 'low', status: 'pending', tag: 'CRM' },
  { id: 't5', title: 'Draft LinkedIn outreach sequence', description: 'New sequence for fintech segment', dueTime: '03:15 PM', priority: 'medium', status: 'completed', tag: 'LinkedIn' },
  { id: 't6', title: 'Sync with design on landing page', description: 'Review new pricing page mockups', dueTime: '04:00 PM', priority: 'low', status: 'pending', tag: 'Internal' },
  { id: 't7', title: 'Send proposal to Orbit Finance', description: 'Custom enterprise proposal', dueTime: '05:00 PM', priority: 'high', status: 'pending', tag: 'Sales' },
  { id: 't8', title: 'Weekly pipeline review', description: 'With sales team, review forecast', dueTime: '05:30 PM', priority: 'medium', status: 'completed', tag: 'Internal' },
];

export const leads: Lead[] = [
  { id: 'l1', company: 'Nimbus Retail', name: 'Sarah Chen', email: 'sarah.chen@nimbusretail.com', phone: '+1 (415) 555-0182', linkedin: 'linkedin.com/in/sarahchen', website: 'nimbusretail.com', notes: 'Interested in enterprise plan', status: 'qualified', createdAt: '2024-05-02', avatarSeed: 'Sarah Chen' },
  { id: 'l2', company: 'Verdant Labs', name: 'Marcus Ihe', email: 'marcus@verdantlabs.io', phone: '+1 (212) 555-0110', linkedin: 'linkedin.com/in/marcusihe', website: 'verdantlabs.io', notes: 'Discovery call scheduled', status: 'contacted', createdAt: '2024-05-04', avatarSeed: 'Marcus Ihe' },
  { id: 'l3', company: 'Orbit Finance', name: 'Priya Raman', email: 'priya.raman@orbitfinance.com', phone: '+1 (628) 555-0199', linkedin: 'linkedin.com/in/priyaraman', website: 'orbitfinance.com', notes: 'Sent enterprise proposal', status: 'qualified', createdAt: '2024-05-06', avatarSeed: 'Priya Raman' },
  { id: 'l4', company: 'Cobalt Systems', name: 'Diego Fernandez', email: 'diego@cobaltsystems.co', phone: '+1 (312) 555-0143', linkedin: 'linkedin.com/in/diegofernandez', website: 'cobaltsystems.co', notes: 'Not a fit currently', status: 'lost', createdAt: '2024-04-28', avatarSeed: 'Diego Fernandez' },
  { id: 'l5', company: 'Lumen Health', name: 'Kate Whitfield', email: 'kate.w@lumenhealth.com', phone: '+1 (646) 555-0176', linkedin: 'linkedin.com/in/katewhitfield', website: 'lumenhealth.com', notes: 'Closed - won annual plan', status: 'won', createdAt: '2024-04-20', avatarSeed: 'Kate Whitfield' },
  { id: 'l6', company: 'Anchor Freight', name: 'Tom Baptiste', email: 'tom@anchorfreight.com', phone: '+1 (713) 555-0121', linkedin: 'linkedin.com/in/tombaptiste', website: 'anchorfreight.com', notes: 'New inbound lead', status: 'new', createdAt: '2024-05-10', avatarSeed: 'Tom Baptiste' },
  { id: 'l7', company: 'Solstice Media', name: 'Elena Vasquez', email: 'elena@solsticemedia.tv', phone: '+1 (305) 555-0164', linkedin: 'linkedin.com/in/elenavasquez', website: 'solsticemedia.tv', notes: 'Requested demo next week', status: 'contacted', createdAt: '2024-05-08', avatarSeed: 'Elena Vasquez' },
  { id: 'l8', company: 'Northpoint Legal', name: 'James Okafor', email: 'james.okafor@northpointlegal.com', phone: '+1 (202) 555-0155', linkedin: 'linkedin.com/in/jamesokafor', website: 'northpointlegal.com', notes: 'New inbound lead', status: 'new', createdAt: '2024-05-11', avatarSeed: 'James Okafor' },
  { id: 'l9', company: 'Brightline Foods', name: 'Naomi Petrova', email: 'naomi@brightlinefoods.com', phone: '+1 (503) 555-0198', linkedin: 'linkedin.com/in/naomipetrova', website: 'brightlinefoods.com', notes: 'Evaluating vs competitor', status: 'qualified', createdAt: '2024-05-01', avatarSeed: 'Naomi Petrova' },
  { id: 'l10', company: 'Ridgeline Capital', name: 'Owen Baker', email: 'owen.baker@ridgelinecap.com', phone: '+1 (617) 555-0187', linkedin: 'linkedin.com/in/owenbaker', website: 'ridgelinecap.com', notes: 'Closed - won, upgraded plan', status: 'won', createdAt: '2024-04-15', avatarSeed: 'Owen Baker' },
  { id: 'l11', company: 'Fable & Co', name: 'Isla Thompson', email: 'isla@fableandco.com', phone: '+1 (773) 555-0132', linkedin: 'linkedin.com/in/islathompson', website: 'fableandco.com', notes: 'No response after 3 touches', status: 'lost', createdAt: '2024-04-22', avatarSeed: 'Isla Thompson' },
  { id: 'l12', company: 'Vantage Robotics', name: 'Aiden Cross', email: 'aiden@vantagerobotics.ai', phone: '+1 (669) 555-0141', linkedin: 'linkedin.com/in/aidencross', website: 'vantagerobotics.ai', notes: 'New inbound, high intent', status: 'new', createdAt: '2024-05-12', avatarSeed: 'Aiden Cross' },
];

export const emails: Email[] = [
  { id: 'e1', folder: 'inbox', from: 'Sarah Chen · Nimbus Retail', to: 'me@flowdesk.io', subject: 'Re: Enterprise pricing questions', preview: 'Thanks for the deck — a couple of questions on seat pricing before we...', body: "Hi Ariana,\n\nThanks for the deck — a couple of questions on seat pricing before we move forward. Could we get a call this week to walk through the enterprise tier?\n\nBest,\nSarah", date: '10:24 AM', read: false, starred: true },
  { id: 'e2', folder: 'inbox', from: 'Marcus Ihe · Verdant Labs', to: 'me@flowdesk.io', subject: 'Discovery call confirmed', preview: 'Confirming our call for Thursday at 1pm PT. Looking forward to it...', body: 'Confirming our call for Thursday at 1pm PT. Looking forward to it. I\'ll bring our head of ops too.', date: '09:02 AM', read: false, starred: false },
  { id: 'e3', folder: 'inbox', from: 'Priya Raman · Orbit Finance', to: 'me@flowdesk.io', subject: 'Proposal received, reviewing internally', preview: 'Got the proposal, sharing with finance team now. Will circle back by...', body: 'Got the proposal, sharing with finance team now. Will circle back by end of week with feedback.', date: 'Yesterday', read: true, starred: false },
  { id: 'e4', folder: 'inbox', from: 'Elena Vasquez · Solstice Media', to: 'me@flowdesk.io', subject: 'Demo request', preview: 'Would love to see a live demo of the bulk email module next week...', body: 'Would love to see a live demo of the bulk email module next week if possible.', date: 'Yesterday', read: true, starred: false },
  { id: 'e5', folder: 'sent', from: 'me@flowdesk.io', to: 'kate.w@lumenhealth.com', subject: 'Welcome aboard, Lumen Health!', preview: 'So excited to have you onboard. Here is your onboarding checklist...', body: 'So excited to have you onboard. Here is your onboarding checklist and dedicated success contact.', date: 'Mon', read: true, starred: false },
  { id: 'e6', folder: 'sent', from: 'me@flowdesk.io', to: 'diego@cobaltsystems.co', subject: 'Following up on our conversation', preview: 'Wanted to follow up in case timing changes on your end down the line...', body: 'Wanted to follow up in case timing changes on your end down the line. Happy to reconnect anytime.', date: 'Sun', read: true, starred: false },
  { id: 'e7', folder: 'drafts', from: 'me@flowdesk.io', to: 'james.okafor@northpointlegal.com', subject: 'Introduction + quick question', preview: 'Hi James, noticed Northpoint Legal recently expanded — congrats! Wanted...', body: 'Hi James, noticed Northpoint Legal recently expanded — congrats! Wanted to see if outreach automation is on your radar this quarter.', date: '2 days ago', read: true, starred: false },
  { id: 'e8', folder: 'drafts', from: 'me@flowdesk.io', to: 'naomi@brightlinefoods.com', subject: 'Re: Evaluating options', preview: 'Draft: comparison sheet attached, plus case studies from similar...', body: 'Draft: comparison sheet attached, plus case studies from similar food & bev brands.', date: '3 days ago', read: true, starred: false },
];

export const campaigns: Campaign[] = [
  { id: 'c1', name: 'Q3 Fintech Cold Outreach', status: 'active', recipients: 1200, sent: 1200, opened: 684, replied: 96, bounced: 24, createdAt: '2024-05-01' },
  { id: 'c2', name: 'Healthcare Decision Makers', status: 'active', recipients: 850, sent: 850, opened: 512, replied: 71, bounced: 12, createdAt: '2024-05-05' },
  { id: 'c3', name: 'Re-engagement — Lost Leads', status: 'scheduled', recipients: 430, sent: 0, opened: 0, replied: 0, bounced: 0, createdAt: '2024-05-14' },
  { id: 'c4', name: 'Product Launch Announcement', status: 'completed', recipients: 2100, sent: 2100, opened: 1340, replied: 205, bounced: 41, createdAt: '2024-04-10' },
  { id: 'c5', name: 'Enterprise Upsell Sequence', status: 'paused', recipients: 320, sent: 180, opened: 96, replied: 18, bounced: 5, createdAt: '2024-04-25' },
  { id: 'c6', name: 'Logistics Sector Intro', status: 'draft', recipients: 0, sent: 0, opened: 0, replied: 0, bounced: 0, createdAt: '2024-05-13' },
];

export const weeklyActivity = [
  { day: 'Mon', emails: 320, replies: 28 },
  { day: 'Tue', emails: 410, replies: 41 },
  { day: 'Wed', emails: 380, replies: 35 },
  { day: 'Thu', emails: 512, replies: 58 },
  { day: 'Fri', emails: 460, replies: 49 },
  { day: 'Sat', emails: 140, replies: 12 },
  { day: 'Sun', emails: 96, replies: 8 },
];
