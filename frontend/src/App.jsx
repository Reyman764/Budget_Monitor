import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Chart-heavy pages are code-split so an unauthenticated visitor on
// Login/Signup never downloads recharts/react-to-print up front.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const HouseholdSetup = lazy(() => import('./pages/HouseholdSetup'));
const MonthlyReview = lazy(() => import('./pages/MonthlyReview'));
const SharedReport = lazy(() => import('./pages/SharedReport'));
const Bills = lazy(() => import('./pages/Bills'));
const Settings = lazy(() => import('./pages/Settings'));
const Goals = lazy(() => import('./pages/Goals'));
const Analytics = lazy(() => import('./pages/Analytics'));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen text-gray-600 dark:bg-slate-900 dark:text-slate-300">
    Loading...
  </div>
);

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageFallback />;
  }

  return (
    <Router>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public: reachable without an account, so it must sit outside the auth gate */}
          <Route path="/shared/:token" element={<SharedReport />} />

          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route
            path="/household-setup"
            element={user ? <HouseholdSetup /> : <Navigate to="/login" />}
          />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/bills" element={user ? <Bills /> : <Navigate to="/login" />} />
          <Route
            path="/monthly-review"
            element={user ? <MonthlyReview /> : <Navigate to="/login" />}
          />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/goals" element={user ? <Goals /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
