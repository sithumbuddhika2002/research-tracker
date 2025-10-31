import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, hasRole } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Projects', href: '/projects', roles: [UserRole.ADMIN, UserRole.PI, UserRole.MEMBER, UserRole.VIEWER] },
    { label: 'Milestones', href: '/milestones', roles: [UserRole.ADMIN, UserRole.PI, UserRole.MEMBER] },
    { label: 'Documents', href: '/documents', roles: [UserRole.ADMIN, UserRole.PI, UserRole.MEMBER, UserRole.VIEWER] },
    { label: 'Admin', href: '/admin', roles: [UserRole.ADMIN] },
  ];

  const visibleMenuItems = menuItems.filter((item) => hasRole(item.roles));

  const isActive = (href: string) => location === href;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="w-64 bg-card border-r border-border shadow-lg flex flex-col"
          >
            <div className="p-6 border-b border-border">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ResearchTracker
              </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {visibleMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-border space-y-3">
              <div className="px-4 py-2 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="font-semibold text-foreground truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          <div className="flex items-center gap-4">
            <User size={20} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{user?.username}</span>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
