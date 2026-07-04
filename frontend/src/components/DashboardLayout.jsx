import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, ClipboardList, LogOut, Briefcase } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const DashboardLayout = ({ user, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = user.role === 'admin'
    ? [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { name: 'Employees', icon: User, path: '/admin/employees' },
      { name: 'Attendance', icon: ClipboardList, path: '/admin/attendance' },
      { name: 'Payroll', icon: Briefcase, path: '/admin/payroll' },
    ]
    : [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/employee' },
      { name: 'My Profile', icon: User, path: '/employee/profile' },
      { name: 'Attendance', icon: ClipboardList, path: '/employee/attendance' },
      { name: 'Leave Request', icon: Calendar, path: '/employee/leave' },
    ];

  const handleLogout = () => {
    // 1. Remove the user from session storage
    sessionStorage.removeItem('user');

    // 2. Navigate to login
    navigate('/', { replace: true });

    // 3. Force a reload to clear the React state and redirect properly
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-secondary/50">
      <aside className="w-64 bg-background border-r border-border/50 flex flex-col shadow-sm">
        <div className="p-8">
          <h1 className="text-2xl font-black text-primary tracking-tight">Pulse</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer'
                  }`}
              >
                <item.icon size={18} />
                {item.name}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-semibold text-foreground capitalize">{user.role} Portal</h2>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;