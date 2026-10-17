import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FirebaseConfigNotice } from './components/common/FirebaseConfigNotice';

// Pages
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { SearchPage } from './pages/SearchPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { WatchPage } from './pages/WatchPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUploadPage } from './pages/admin/AdminUploadPage';
import { AdminEditPage } from './pages/admin/AdminEditPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Standard App Layout with Navbar & Footer
const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FirebaseConfigNotice />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route
              path="/login"
              element={
                <>
                  <LoginPage />
                  <FirebaseConfigNotice />
                </>
              }
            />

            {/* Main Application Layout */}
            <Route element={<AppLayout />}>
              {/* Public Catalog Routes (No login required when web first opens) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />

              {/* Streaming Watch Page (Requires Google Authentication) */}
              <Route
                path="/watch/:id"
                element={
                  <ProtectedRoute>
                    <WatchPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes (Restricted strictly to cristiandwihariantoro@gmail.com) */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/upload"
                element={
                  <AdminRoute>
                    <AdminUploadPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/edit/:id"
                element={
                  <AdminRoute>
                    <AdminEditPage />
                  </AdminRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
