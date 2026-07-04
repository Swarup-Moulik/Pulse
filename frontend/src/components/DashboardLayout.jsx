import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  User,
  ClipboardList,
  LogOut,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const DashboardLayout = ({ user, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems =
    user.role === "admin"
      ? [
          { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
          { name: "Employees", icon: User, path: "/admin/employees" },
          {
            name: "Attendance",
            icon: ClipboardList,
            path: "/admin/attendance",
          },
          { name: "Payroll", icon: Briefcase, path: "/admin/payroll" },
        ]
      : [
          { name: "Dashboard", icon: LayoutDashboard, path: "/employee" },
          { name: "My Profile", icon: User, path: "/employee/profile" },
          {
            name: "Attendance",
            icon: ClipboardList,
            path: "/employee/attendance",
          },
          { name: "Leave Request", icon: Calendar, path: "/employee/leave" },
        ];

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-secondary/30">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border/50 flex flex-col shadow-xl transition-transform duration-300 md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-8 flex justify-between items-center">
          <h1 className="text-2xl font-black text-primary tracking-tight">
            Pulse
          </h1>
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="font-semibold text-foreground capitalize hidden md:block">
              {user.role} Portal
            </h2>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
