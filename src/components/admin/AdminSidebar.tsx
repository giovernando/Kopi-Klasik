import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Coffee, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  BarChart3,
  FolderOpen,
  CalendarDays
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: Coffee, label: 'Products', path: '/admin/products' },
  { icon: FolderOpen, label: 'Categories', path: '/admin/categories' },
  { icon: CalendarDays, label: 'Reservations', path: '/admin/reservations' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  { icon: FileText, label: 'Content', path: '/admin/content' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function AdminSidebar() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "bg-[#FAF7F2] border-r border-[#E5DDD3] min-h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-[#E5DDD3] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6F4E37] rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-[#2E2E2E]">Kopi Klasik</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#6F4E37] hover:bg-[#6F4E37]/10"
        >
          <ChevronLeft className={cn("w-5 h-5 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/admin' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive 
                  ? "bg-[#6F4E37] text-white" 
                  : "text-[#2E2E2E] hover:bg-[#6F4E37]/10"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#E5DDD3]">
        <Link
          to="/home"
          onClick={() => logout()}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#2E2E2E] hover:bg-red-50 hover:text-red-600 transition-all"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
