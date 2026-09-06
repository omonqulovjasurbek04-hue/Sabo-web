import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isCheckingSession } = useAuth();
  const location = useLocation();

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center">
        <Loader2 className="size-8 text-[#2D6A4F] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
