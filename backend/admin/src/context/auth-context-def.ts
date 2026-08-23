import { createContext } from 'react';
import type { AdminUser } from '../types';

export interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const defaultAdminUser: AdminUser = {
  id: 'admin-1',
  username: 'admin',
  name: 'Administrator',
  role: 'SUPER_ADMIN',
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
