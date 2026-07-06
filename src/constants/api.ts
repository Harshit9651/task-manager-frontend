
export const API_PREFIX = "/api";

export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_LOGIN: "/auth/google",
    REFRESH_TOKEN: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  USER: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
  },

  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_ACTIVITY: "/dashboard/recent-activity",
  },

TASKS: {
  LIST: "/tasks",
  CREATE: "/tasks",
  HISTORY: "/tasks/history",
  STATS: "/tasks/stats",
  DETAILS: (id: string) => `/tasks/${id}`,
  UPDATE: (id: string) => `/tasks/${id}`,
  STATUS: (id: string) => `/tasks/${id}/status`,
  DELETE: (id: string) => `/tasks/${id}`,
  RESTORE: (id: string) => `/tasks/${id}/restore`,
},

 LEADS: {
  LIST: "/leads",
  CREATE: "/leads",
  STATS: "/leads/stats",
  DETAILS: (id: string) => `/leads/${id}`,
  UPDATE: (id: string) => `/leads/${id}`,
  DELETE: (id: string) => `/leads/${id}`,
  ARCHIVE: (id: string) => `/leads/${id}/archive`,
  UNARCHIVE: (id: string) => `/leads/${id}/unarchive`,
   UPDATE_STATUS: (id: string) => `/leads/${id}/status`,
  FOLLOW_UP: (id: string) => `/leads/${id}/follow-up`,
  RESTORE: (id: string) => `/leads/${id}/restore`,
},

  EMAILS: {
    LIST: "/emails",
    SEND: "/emails/send",
    BULK_SEND: "/emails/bulk",
    HISTORY: "/emails/history",
  },

  CAMPAIGNS: {
    LIST: "/campaigns",
    CREATE: "/campaigns",
    DETAILS: (id: string) => `/campaigns/${id}`,
    UPDATE: (id: string) => `/campaigns/${id}`,
    DELETE: (id: string) => `/campaigns/${id}`,
  },

  AI: {
    CHAT: "/ai/chat",
    AUTOMATIONS: "/ai/automations",
  },
} as const;

export default API_ENDPOINTS;