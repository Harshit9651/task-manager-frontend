export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];


export const ROLE_PRIORITY: Record<UserRole, number> = {
  super_admin: 4,
  admin: 3,
  manager: 2,
  user: 1,
};


export const hasRole = (
  currentRole: UserRole,
  requiredRole: UserRole
): boolean => {
  return ROLE_PRIORITY[currentRole] >= ROLE_PRIORITY[requiredRole];
};


export const isSuperAdmin = (role?: UserRole): boolean =>
  role === ROLES.SUPER_ADMIN;


export const isAdmin = (role?: UserRole): boolean =>
  role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;


export const isManager = (role?: UserRole): boolean =>
  role === ROLES.MANAGER ||
  role === ROLES.ADMIN ||
  role === ROLES.SUPER_ADMIN;


export const isUser = (role?: UserRole): boolean =>
  role === ROLES.USER;