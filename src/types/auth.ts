import type { UserRole } from "../constants/roles";


export interface IUser {
  _id: string;
  firebaseUid: string;

  name: string;
  email: string;
  photoURL?: string;

  role: UserRole;

  provider: "google";

  emailVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}


export interface GoogleLoginRequest {
  idToken: string;
}


export interface AuthTokens {
  accessToken: string;
}


export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    accessToken: string;
  };
}


export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    accessToken: string;
  };
}


export interface AuthContextType {
  user: IUser | null;

  isAuthenticated: boolean;

  isAuthenticating: boolean;

  loginWithGoogle: () => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}


export interface ApiError {
  success: false;

  message: string;

  errors?: unknown;

  statusCode?: number;
}