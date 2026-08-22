import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sabo_admin_auth') === 'true';
  });

  useEffect(() => {
    if (isAuthenticated) {
      setUser({
        id: 'usr_admin_01',
        username: 'Bekzodbek',
        name: 'Bekzodbek',
        role: 'SUPER_ADMIN',
      });
    }
  }, [isAuthenticated]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Validating Bekzodbek / Admin0525
    if (username === 'Bekzodbek' && password === 'Admin0525') {
      localStorage.setItem('sabo_admin_auth', 'true');
      localStorage.setItem('sabo_admin_user', 'Bekzodbek');
      setIsAuthenticated(true);
      setUser({
        id: 'usr_admin_01',
        username: 'Bekzodbek',
        name: 'Bekzodbek',
        role: 'SUPER_ADMIN',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('sabo_admin_auth');
    localStorage.removeItem('sabo_admin_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
