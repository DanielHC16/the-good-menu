// =============================================================================
// THE GOOD MENU — Root Application Component
// =============================================================================
// Defines the routing structure:
//   • Public routes: /login, /register
//   • Protected routes (wrapped in ProtectedRoute + AppLayout):
//     /, /meals, /planner, /products, /audit-logs
// =============================================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import AuditLogsPage from './features/audit-logs/AuditLogsPage';
import ProductsPage from './features/products/ProductsPage';
import MealsPage from './features/meals/MealsPage';
import PlannerPage from './features/planner/PlannerPage';
import DashboardPage from './features/dashboard/DashboardPage';



function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ─── Public Routes ──────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ─── Protected Routes (require authentication) ──────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
          </Route>
        </Route>

        {/* ─── Catch-all redirect ─────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
