import { createContext } from 'react';
import type { AdminUser } from '../types';

export interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
