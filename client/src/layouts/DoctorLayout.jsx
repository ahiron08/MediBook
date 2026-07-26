import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Clock,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/doctor/calendar', label: 'Calendar', icon: CalendarDays },
    { path: '/doctor/appointments', label: 'Appointments', icon: CalendarCheck },
    { path: '/doctor/availability', label: 'Availability', icon: Clock },
    { path: '/doctor/profile', label: 'My Profile', icon: UserCircle },
    { path: '/doctor/profile-manage', label: 'Manage Profile', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 glass px-4 flex items-center justify-between" style={{ height: 'var(--header-height)' }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-bg-alt)] transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-primary)] flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm">MediBook</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-30 h-screen
          bg-white border-r border-[var(--color-border)]
          flex flex-col shrink-0
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
        `}
      >
        {/* Logo */}
        <div className={`
          flex items-center border-b border-[var(--color-border-light)] shrink-0
          ${collapsed ? 'justify-center px-0' : 'px-6 gap-3'}
        `}
          style={{ height: 'var(--header-height)' }}
        >
          <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary)] flex items-center justify-center shrink-0">
            <Stethoscope size={20} className="text-white" />
          </div>
          {!collapsed && (
            <>
              <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">MediBook</span>
              <span className="ml-auto px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)] bg-[var(--color-primary-50)] rounded-full">Doctor</span>
            </>
          )}
        </div>

        {/* Welcome Card */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-3">
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-[var(--radius-lg)] p-4">
              <p className="text-[11px] text-white/70 mb-0.5">Welcome back,</p>
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Doctor'}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 rounded-[var(--radius-md)] transition-all duration-200
                  ${collapsed ? 'justify-center h-12 w-12 mx-auto' : 'px-4 py-2.5'}
                  ${active
                    ? 'bg-[var(--color-primary-50)] text-[var(--color-primary)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)]'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className={active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-10 mx-3 mb-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Logout */}
        <div className={`
          border-t border-[var(--color-border-light)] py-3
          ${collapsed ? 'px-0 flex justify-center' : 'px-3'}
        `}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 rounded-[var(--radius-md)] transition-all duration-200
              ${collapsed ? 'justify-center h-12 w-12 mx-auto' : 'w-full px-4 py-2.5'}
              text-[var(--color-text-muted)] hover:bg-[var(--color-danger-50)] hover:text-[var(--color-danger)]
            `}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className={`
          animate-fade-in
          ${collapsed ? 'lg:pl-0' : ''}
        `}>
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-[calc(var(--header-height)+16px)] lg:pt-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorLayout;
