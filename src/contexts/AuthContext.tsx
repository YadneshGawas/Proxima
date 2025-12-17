import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User, AuthState } from '@/types';
import {User} from '@/types';
// import { authService } from '@/services/api';
import { authService } from "@/services/auth/auth.service";


// interface AuthContextType extends AuthState {
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   loginWithFacebook: () => Promise<void>;
//   logout: () => Promise<void>;
//   becomeOrganizer: () => Promise<void>;
//   setUser: (user: User | null) => void;
// }

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // const [state, setState] = useState<AuthState>({
  //   user: null,
  //   isAuthenticated: false,
  //   isLoading: true,
  // });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

   // ------------------
  // Bootstrap session
  // ------------------
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    authService
      .getCurrentUser()
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);


  // useEffect(() => {
  //   // Check for existing session
  //   const token = localStorage.getItem('auth_token');
  //   const savedUser = localStorage.getItem('user');
    
  //   if (token && savedUser) {
  //     setState({
  //       user: JSON.parse(savedUser),
  //       isAuthenticated: true,
  //       isLoading: false,
  //     });
  //   } else {
  //     setState(prev => ({ ...prev, isLoading: false }));
  //   }
  // }, []);

  // const login = async (email: string, password: string) => {
  //   setState(prev => ({ ...prev, isLoading: true }));
  //   try {
  //     const { user, token } = await authService.login(email, password);
  //     localStorage.setItem('auth_token', token);
  //     localStorage.setItem('user', JSON.stringify(user));
  //     setState({ user, isAuthenticated: true, isLoading: false });
  //   } catch (error) {
  //     setState(prev => ({ ...prev, isLoading: false }));
  //     throw error;
  //   }
  // };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await authService.login(email, password);

    localStorage.setItem("auth_token", res.access_token);
    setUser(res.user);
    setIsLoading(false);
  };

  // const register = async (name: string, email: string, password: string) => {
  //   setState(prev => ({ ...prev, isLoading: true }));
  //   try {
  //     const { user, token } = await authService.register(name, email, password);
  //     localStorage.setItem('auth_token', token);
  //     localStorage.setItem('user', JSON.stringify(user));
  //     setState({ user, isAuthenticated: true, isLoading: false });
  //   } catch (error) {
  //     setState(prev => ({ ...prev, isLoading: false }));
  //     throw error;
  //   }
  // };
   // ------------------
  // Register → Login
  // ------------------
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    await authService.register(name, email, password);

    const res = await authService.login(email, password);
    localStorage.setItem("auth_token", res.access_token);
    setUser(res.user);

    setIsLoading(false);
  };

  // const loginWithGoogle = async () => {
  //   setState(prev => ({ ...prev, isLoading: true }));
  //   try {
  //     // TODO: Implement actual Google OAuth flow
  //     const { user, token } = await authService.loginWithGoogle('mock-google-token');
  //     localStorage.setItem('auth_token', token);
  //     localStorage.setItem('user', JSON.stringify(user));
  //     setState({ user, isAuthenticated: true, isLoading: false });
  //   } catch (error) {
  //     setState(prev => ({ ...prev, isLoading: false }));
  //     throw error;
  //   }
  // };

  // const loginWithFacebook = async () => {
  //   setState(prev => ({ ...prev, isLoading: true }));
  //   try {
  //     // TODO: Implement actual Facebook OAuth flow
  //     const { user, token } = await authService.loginWithFacebook('mock-facebook-token');
  //     localStorage.setItem('auth_token', token);
  //     localStorage.setItem('user', JSON.stringify(user));
  //     setState({ user, isAuthenticated: true, isLoading: false });
  //   } catch (error) {
  //     setState(prev => ({ ...prev, isLoading: false }));
  //     throw error;
  //   }
  // };

 // ------------------
  // Logout
  // ------------------
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  // const becomeOrganizer = async () => {
  //   if (!state.user) return;
    
  //   setState(prev => ({ ...prev, isLoading: true }));
  //   try {
  //     const updatedUser = await authService.becomeOrganizer(state.user.id);
  //     localStorage.setItem('user', JSON.stringify(updatedUser));
  //     setState({ user: updatedUser, isAuthenticated: true, isLoading: false });
  //   } catch (error) {
  //     setState(prev => ({ ...prev, isLoading: false }));
  //     throw error;
  //   }
  // };

  // const setUser = (user: User | null) => {
  //   if (user) {
  //     localStorage.setItem('user', JSON.stringify(user));
  //     setState({ user, isAuthenticated: true, isLoading: false });
  //   } else {
  //     localStorage.removeItem('user');
  //     localStorage.removeItem('auth_token');
  //     setState({ user: null, isAuthenticated: false, isLoading: false });
  //   }
  // };

  // return (
  //   <AuthContext.Provider value={{ ...state, login, register, loginWithGoogle, loginWithFacebook, logout, becomeOrganizer, setUser }}>
  //     {children}
  //   </AuthContext.Provider>
  // );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}