

import type { IUser } from "../types/auth";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER: "user",
} as const;


export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};


export const getUser = (): IUser | null => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    if (!user) return null;

    return JSON.parse(user) as IUser;
  } catch {
    return null;
  }
};

export const setUser = (user: IUser): void => {
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user)
  );
};

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};


export const saveAuth = (
  accessToken: string,
  user: IUser
): void => {
  setAccessToken(accessToken);
  setUser(user);
};

export const clearAuth = (): void => {
  removeAccessToken();
  removeUser();
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};