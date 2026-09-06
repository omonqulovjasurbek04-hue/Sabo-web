import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { AdminUser } from '../types';
import { AuthContext } from './auth-context-def';

function readStoredUser(): AdminUser | null {
  const saved = localStorage.getItem('sabo_admin_user');
  if (!saved) return null;
  try {
    return JSON.parse(saved) as AdminUser;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(readStoredUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    Boolean(localStorage.getItem('sabo_admin_token')),
  );
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(
    () => Boolean(localStorage.getItem('sabo_admin_token')),
  );

  const clearSession = () => {
    localStorage.removeItem('sabo_admin_token');
    localStorage.removeItem('sabo_admin_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('sabo_admin_token');
    if (!token) {
      setIsCheckingSession(false);
      return;
    }
    apiClient
      .get('/auth/me')
      .then((res) => {
        const u = res.data?.data?.user || res.data?.user;
        if (!u) {
          clearSession();
          return;
        }
        const adminUser: AdminUser = {
          id: u.id,
          username: u.email || u.phone || 'Admin',
          name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : 'Administrator',
          role: u.roles?.[0] || 'ADMIN',
        };
        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem('sabo_admin_user', JSON.stringify(adminUser));
      })
      .catch(() => clearSession())
      .finally(() => setIsCheckingSession(false));
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.post('/auth/login', {
        identifier: username,
        password,
      });

      const data = res.data?.data || res.data;
      if (!data?.accessToken || !data?.user) {
        return false;
      }

      const u = data.user;
      const adminUser: AdminUser = {
        id: u.id,
        username: u.email || u.phone || username,
        name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : username,
        role: u.roles?.[0] || 'ADMIN',
      };

      localStorage.setItem('sabo_admin_token', data.accessToken);
      localStorage.setItem('sabo_admin_user', JSON.stringify(adminUser));

      setUser(adminUser);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    const token = localStorage.getItem('sabo_admin_token');
    if (token) {
      apiClient.post('/auth/logout').catch(() => {});
    }
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isCheckingSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
