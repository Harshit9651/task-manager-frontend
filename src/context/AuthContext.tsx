import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {authService} from "../lib/services/auth.service";

import type {
  AuthContextType,
  IUser,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<IUser | null>(null);

  const [isAuthenticating, setIsAuthenticating] =
    useState(true);

  /* -------------------------------------------------------------------------- */
  /*                           RESTORE LOGIN                                    */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      setIsAuthenticating(true);

      const currentUser =
        await authService.restoreSession();

      setUser(currentUser);
    } catch (error) {
      console.error(error);

      setUser(null);
    } finally {
      setIsAuthenticating(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                              GOOGLE LOGIN                                  */
  /* -------------------------------------------------------------------------- */

  const loginWithGoogle = async () => {
    try {
      setIsAuthenticating(true);

      const loggedInUser =
        await authService.loginWithGoogle();

      setUser(loggedInUser);
    } finally {
      setIsAuthenticating(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                 LOGOUT                                     */
  /* -------------------------------------------------------------------------- */

  const logout = async () => {
    try {
      setIsAuthenticating(true);

      await authService.logout();

      setUser(null);
    } finally {
      setIsAuthenticating(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             REFRESH USER                                   */
  /* -------------------------------------------------------------------------- */

  const refreshUser = async () => {
    const latestUser =
      await authService.refreshUser();

    setUser(latestUser);
  };

  /* -------------------------------------------------------------------------- */

  const value = useMemo<AuthContextType>(
    () => ({
      user,

      isAuthenticated: !!user,

      isAuthenticating,

      loginWithGoogle,

      logout,

      refreshUser,
    }),
    [user, isAuthenticating]
  );
  console.log({
   user,
   isAuthenticated: !!user,
   isAuthenticating
});

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  HOOK                                      */
/* -------------------------------------------------------------------------- */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}