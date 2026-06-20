// =============================================================================
// THE GOOD MENU — App Layout (Sidebar + Content Area)
// =============================================================================
// Main wrapper for all protected routes. Features:
//   • Fixed sidebar with Aboitiz branding and navigation
//   • Active link highlighting using React Router's NavLink
//   • Responsive: sidebar collapses on mobile with a hamburger toggle
//   • Logout button at the bottom of the sidebar
// =============================================================================

import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, CalendarDays, Utensils, Beef, ShieldAlert, LogOut, Leaf } from 'lucide-react';

// ─── Navigation Items ────────────────────────────────────────────────────────

const navItems = [
  { to: '/',            label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/planner',     label: 'Planner',    icon: CalendarDays },
  { to: '/meals',       label: 'Meals',      icon: Utensils },
  { to: '/products',    label: 'Ingredients',   icon: Beef },
  { to: '/audit-logs',  label: 'Audit Logs', icon: ShieldAlert },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-aboitiz-bgLight">
      {/* ─── Mobile Overlay ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          h-screen w-64
          bg-aboitiz-textDark text-white
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 tracking-tight">
            <Leaf className="w-5 h-5 text-aboitiz-secondary" />
            The Good Menu
          </h2>
          <p className="text-xs text-aboitiz-secondary mt-1 opacity-80">
            Aboitiz Foods Meal Planner
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-aboitiz-primary/30 text-aboitiz-secondary'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          {user && (
            <p className="text-xs text-white/50 mb-3 truncate px-1">
              {user.email}
            </p>
          )}
          <button
            id="logout-button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                       bg-aboitiz-danger/20 text-aboitiz-danger hover:bg-aboitiz-danger/30
                       transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-sm border-b border-aboitiz-primary/10 sticky top-0 z-20">
          <button
            id="mobile-menu-toggle"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-aboitiz-primary/10 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5 text-aboitiz-textDark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-aboitiz-textDark">The Good Menu</span>
          <div className="w-9" /> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
