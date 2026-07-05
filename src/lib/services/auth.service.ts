import { signInWithPopup, signOut } from "firebase/auth";

import { auth, googleProvider } from "../firebase/firebase";
import { authApi } from "../api/auth.api";

import {
  clearAuth,
  getAccessToken,
  getUser,
  saveAuth,
  setUser,
} from "../../utils/storage";

import type { IUser } from "../../types/auth";

class AuthService {

  async loginWithGoogle(): Promise<IUser> {
 
    const result = await signInWithPopup(auth, googleProvider);


    const idToken = await result.user.getIdToken();


    const response = await authApi.googleLogin({
      idToken,
    });

 
    saveAuth(
      response.data.accessToken,
      response.data.user
    );

    return response.data.user;
  }


  async restoreSession(): Promise<IUser | null> {
    try {
      const token = getAccessToken();

      if (!token) {
        return null;
      }


      const cachedUser = getUser();

      if (cachedUser) {
        return cachedUser;
      }

      const response = await authApi.me();

      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      clearAuth();

      return null;
    }
  }

  
  async currentUser(): Promise<IUser | null> {
    try {
      const response = await authApi.me();

      setUser(response.data.user);

      return response.data.user;
    } catch {
      return null;
    }
  }



  isAuthenticated(): boolean {
    return !!getAccessToken();
  }
  

  async refreshUser(): Promise<IUser | null> {
    try {
      const response = await authApi.me();

      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      clearAuth();

      return null;
    }
  }


  async refreshSession(): Promise<IUser | null> {
    try {
    
      const response = await authApi.me();

      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      clearAuth();

      return null;
    }
  }


  async logout(): Promise<void> {
    try {
   
      await authApi.logout();
    } catch (error) {
      console.warn("Backend logout failed", error);
    }

    try {
   
      await signOut(auth);
    } catch (error) {
      console.warn("Firebase logout failed", error);
    }

 
    clearAuth();
  }

 
  getCurrentUser(): IUser | null {
    return getUser();
  }


  getAccessToken(): string | null {
    return getAccessToken();
  }


  clearSession(): void {
    clearAuth();
  }
}



export const authService = new AuthService();