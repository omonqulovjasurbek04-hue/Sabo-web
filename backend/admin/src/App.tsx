import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { ProductsList } from './pages/Products/ProductsList';
import { CategoriesPage } from './pages/Products/CategoriesPage';
import { OrdersPage } from './pages/Orders/OrdersPage';
import { CustomersPage } from './pages/Customers/CustomersPage';
import { ProductionPage } from './pages/Production/ProductionPage';
import { AboutAdminPage } from './pages/About/AboutAdminPage';
import { CertificatesAdminPage } from './pages/Certificates/CertificatesAdminPage';
import { BlogAdminPage } from './pages/Blog/BlogAdminPage';
import { MessagesAdminPage } from './pages/Messages/MessagesAdminPage';
import { MediaAdminPage } from './pages/Media/MediaAdminPage';
import { TranslationsAdminPage } from './pages/Translations/TranslationsAdminPage';
import { SeoAdminPage } from './pages/SEO/SeoAdminPage';
import { PaymentsAdminPage } from './pages/Payments/PaymentsAdminPage';
import { NotificationsAdminPage } from './pages/Notifications/NotificationsAdminPage';
import { UsersRolesPage } from './pages/Users/UsersRolesPage';
import { AuditLogsPage } from './pages/AuditLogs/AuditLogsPage';
import { SettingsAdminPage } from './pages/Settings/SettingsAdminPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/categories" element={<CategoriesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="production" element={<ProductionPage />} />
            <Route path="about" element={<AboutAdminPage />} />
            <Route path="certificates" element={<CertificatesAdminPage />} />
            <Route path="blog" element={<BlogAdminPage />} />
            <Route path="messages" element={<MessagesAdminPage />} />
            <Route path="media" element={<MediaAdminPage />} />
            <Route path="translations" element={<TranslationsAdminPage />} />
            <Route path="seo" element={<SeoAdminPage />} />
            <Route path="payments" element={<PaymentsAdminPage />} />
            <Route path="notifications" element={<NotificationsAdminPage />} />
            <Route path="users" element={<UsersRolesPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="settings" element={<SettingsAdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

