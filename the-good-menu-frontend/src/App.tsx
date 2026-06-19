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

// ─── Placeholder Pages (to be replaced with real feature components) ─────────
const DashboardPage = () => (
  <div className="p-6">
    <h1>Dashboard</h1>
    <p className="text-aboitiz-primary mt-2">Welcome to The Good Menu. Your weekly meal planner awaits.</p>
  </div>
);

const PlannerPage = () => (
  <div className="p-6">
    <h1>Meal Planner</h1>
    <p className="text-aboitiz-primary mt-2">Schedule your meals across the week.</p>
  </div>
);

const MealsPage = () => (
  <div className="p-6">
    <h1>Meals</h1>
    <p className="text-aboitiz-primary mt-2">Create and manage your meal recipes.</p>
  </div>
);

const ProductsPage = () => (
  <div className="p-6">
    <h1>Products</h1>
    <p className="text-aboitiz-primary mt-2">Browse the Aboitiz ingredient catalog.</p>
  </div>
);

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
