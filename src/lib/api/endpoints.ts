import { API_ENDPOINTS } from "../../constants/api";

export const AuthEndpoints = {
  login: () => API_ENDPOINTS.AUTH.GOOGLE_LOGIN,

  logout: () => API_ENDPOINTS.AUTH.LOGOUT,

  me: () => API_ENDPOINTS.AUTH.ME,

  refresh: () => API_ENDPOINTS.AUTH.REFRESH_TOKEN,
};

export const UserEndpoints = {
  profile: () => API_ENDPOINTS.USER.PROFILE,

  updateProfile: () => API_ENDPOINTS.USER.UPDATE_PROFILE,
  notificationPreferences: ()=> API_ENDPOINTS.USER.NOTIFICATION_PREFERENCES
};

export const DashboardEndpoints = {
  stats: () => API_ENDPOINTS.DASHBOARD.STATS,

  recentActivity: () => API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITY,
};
export const TaskEndpoints = {
  list: () => API_ENDPOINTS.TASKS.LIST,

  create: () => API_ENDPOINTS.TASKS.CREATE,

  history: () => API_ENDPOINTS.TASKS.HISTORY,

  stats: () => API_ENDPOINTS.TASKS.STATS,

  details: (taskId: string) =>
    API_ENDPOINTS.TASKS.DETAILS(taskId),

  update: (taskId: string) =>
    API_ENDPOINTS.TASKS.UPDATE(taskId),

  status: (taskId: string) =>
    API_ENDPOINTS.TASKS.STATUS(taskId),

  delete: (taskId: string) =>
    API_ENDPOINTS.TASKS.DELETE(taskId),

  restore: (taskId: string) =>
    API_ENDPOINTS.TASKS.RESTORE(taskId),
};

export const LeadEndpoints = {
  list: () => API_ENDPOINTS.LEADS.LIST,

  create: () => API_ENDPOINTS.LEADS.CREATE,

  details: (leadId: string) =>
    API_ENDPOINTS.LEADS.DETAILS(leadId),

  update: (leadId: string) =>
    API_ENDPOINTS.LEADS.UPDATE(leadId),

  delete: (leadId: string) =>
    API_ENDPOINTS.LEADS.DELETE(leadId),

  updateStatus: (leadId: string) =>
    API_ENDPOINTS.LEADS.UPDATE_STATUS(leadId),

 followUp: (leadId: string) =>
    API_ENDPOINTS.LEADS.FOLLOW_UP(leadId),
  
};

export const EmailEndpoints = {
  list: () => API_ENDPOINTS.EMAILS.LIST,

  send: () => API_ENDPOINTS.EMAILS.SEND,

  bulkSend: () => API_ENDPOINTS.EMAILS.BULK_SEND,

  history: () => API_ENDPOINTS.EMAILS.HISTORY,
};

export const CampaignEndpoints = {
  list: () => API_ENDPOINTS.CAMPAIGNS.LIST,

  create: () => API_ENDPOINTS.CAMPAIGNS.CREATE,

  details: (campaignId: string) =>
    API_ENDPOINTS.CAMPAIGNS.DETAILS(campaignId),

  update: (campaignId: string) =>
    API_ENDPOINTS.CAMPAIGNS.UPDATE(campaignId),

  delete: (campaignId: string) =>
    API_ENDPOINTS.CAMPAIGNS.DELETE(campaignId),
};

export const AIEndpoints = {
  chat: () => API_ENDPOINTS.AI.CHAT,

  automations: () => API_ENDPOINTS.AI.AUTOMATIONS,
};
export const BoardEndpoints = {
  list: () => API_ENDPOINTS.BOARDS.LIST,

  create: () => API_ENDPOINTS.BOARDS.CREATE,

  details: (boardId: string) =>
    API_ENDPOINTS.BOARDS.DETAILS(boardId),

  update: (boardId: string) =>
    API_ENDPOINTS.BOARDS.UPDATE(boardId),

  delete: (boardId: string) =>
    API_ENDPOINTS.BOARDS.DELETE(boardId),
};

export const Endpoints = {
  auth: AuthEndpoints,
  user: UserEndpoints,
  dashboard: DashboardEndpoints,
  tasks: TaskEndpoints,
  leads: LeadEndpoints,
  emails: EmailEndpoints,
  campaigns: CampaignEndpoints,
  ai: AIEndpoints,
  bords : BoardEndpoints
};

export default Endpoints;