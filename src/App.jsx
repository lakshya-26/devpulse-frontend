import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppShell from './components/layout/AppShell.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import Login from './pages/Login.jsx';
import AuthSuccess from './pages/AuthSuccess.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Stats from './pages/Stats.jsx';
import Goals from './pages/Goals.jsx';
import RepoDetails from './pages/RepoDetails.jsx';
import PublicProfile from './pages/PublicProfile.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/u/:username" element={<PublicProfile />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route
                  path="/dashboard"
                  element={
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/stats"
                  element={
                    <ErrorBoundary>
                      <Stats />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/goals"
                  element={
                    <ErrorBoundary>
                      <Goals />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/repo/:repoName"
                  element={
                    <ErrorBoundary>
                      <RepoDetails />
                    </ErrorBoundary>
                  }
                />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
