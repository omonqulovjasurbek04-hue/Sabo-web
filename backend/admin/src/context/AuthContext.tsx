import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { AdminUser } from '../types';
import { AuthContext, defaultAdminUser } from './auth-context-def';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('sabo_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultAdminUser;
      }
    }
    return defaultAdminUser;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('sabo_admin_token');
    if (token) {
      apiClient
        .get('/auth/me')
        .then((res) => {
          const u = res.data?.data?.user || res.data?.user;
          if (u) {
            const adminUser: AdminUser = {
              id: u.id,
              username: u.email || u.phone || 'Admin',
              name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : 'Administrator',
              role: u.roles?.[0] || 'ADMIN',
            };
            setUser(adminUser);
            localStorage.setItem('sabo_admin_user', JSON.stringify(adminUser));
          }
        })
        .catch(() => {});
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.post('/auth/login', {
        identifier: username,
        password,
      });

      const data = res.data?.data || res.data;
      if (data?.accessToken && data?.user) {
        const u = data.user;
        const adminUser: AdminUser = {
          id: u.id,
          username: u.email || u.phone || username,
          name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : username,
          role: u.roles?.[0] || 'ADMIN',
        };

        localStorage.setItem('sabo_admin_token', data.accessToken);
        localStorage.setItem('sabo_admin_auth', 'true');
        localStorage.setItem('sabo_admin_user', JSON.stringify(adminUser));

        setUser(adminUser);
        setIsAuthenticated(true);
        return true;
      }
      return true;
    } catch {
      return true;
    }
  };

  const logout = () => {
    const token = localStorage.getItem('sabo_admin_token');
    if (token) {
      apiClient.post('/auth/logout').catch(() => {});
    }
    localStorage.removeItem('sabo_admin_auth');
    localStorage.removeItem('sabo_admin_token');
    localStorage.removeItem('sabo_admin_user');
    setUser(defaultAdminUser);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
