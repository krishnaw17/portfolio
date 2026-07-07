import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Wrench,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { to: '/admin/education', icon: GraduationCap, label: 'Education' },
  { to: '/admin/skills', icon: Wrench, label: 'Skills' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout() {
  const { isAuthenticated, checkAuth, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuth()) {
      navigate('/admin/login', { replace: true });
    }
  }, [checkAuth, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col md:flex-row">
      {/* Sidebar / Mobile Header */}
      <aside className="md:fixed md:inset-y-0 md:left-0 w-full md:w-56 border-b md:border-b-0 md:border-r border-neutral-800/50 bg-[#0a0a0f] flex flex-col z-40 shrink-0">
        <div className="flex items-center justify-between md:justify-start gap-2 px-4 h-14 border-b border-neutral-800/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-white text-black grid place-items-center text-[11px] font-bold">
              KW
            </div>
            <span className="text-sm font-medium text-neutral-300">Admin</span>
          </div>
          
          {/* Mobile logout button (hidden on desktop) */}
          <button
            onClick={() => {
              logout();
              navigate('/admin/login', { replace: true });
            }}
            className="md:hidden p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Navigation - horizontally scrollable on mobile */}
        <nav className="flex md:flex-col overflow-x-auto md:overflow-y-auto py-2 md:py-3 px-2 gap-1 md:gap-0 md:space-y-0.5 [&::-webkit-scrollbar]:hidden shrink-0">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-neutral-800/60 text-white'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/30'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Footer */}
        <div className="hidden md:block border-t border-neutral-800/50 p-3 mt-auto">
          <div className="text-xs text-neutral-600 truncate mb-2 px-1">{user?.email}</div>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login', { replace: true });
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-500 hover:text-red-400 hover:bg-neutral-800/30 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-56">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
