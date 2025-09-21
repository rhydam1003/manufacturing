import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ClipboardList,
  Cog,
  Package,
  Warehouse,
  FileText,
  BarChart3,
  Settings,
  Wrench,
  TestTube,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    current: false,
  },
  {
    name: 'Manufacturing Orders',
    href: '/manufacturing-orders',
    icon: ClipboardList,
    current: false,
    badge: '12',
  },
  {
    name: 'Work Orders',
    href: '/work-orders',
    icon: Wrench,
    current: false,
    badge: '8',
  },
  {
    name: 'Bill of Materials',
    href: '/bom',
    icon: FileText,
    current: false,
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Warehouse,
    current: false,
    badge: '3',
    badgeVariant: 'destructive',
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    current: false,
  },
  {
    name: 'Work Centers',
    href: '/work-centers',
    icon: Cog,
    current: false,
  },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-card border-r border-border h-full">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Manufacturing
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg smooth-transition',
                        'hover:bg-secondary/80 hover:text-secondary-foreground',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground'
                      )
                    }
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badgeVariant || 'secondary'} 
                        className="ml-2 text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Reports & Settings
            </h2>
            <div className="space-y-1">
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg smooth-transition',
                    'hover:bg-secondary/80 hover:text-secondary-foreground',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground'
                  )
                }
              >
                <BarChart3 className="mr-3 h-5 w-5 flex-shrink-0" />
                Reports
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg smooth-transition',
                    'hover:bg-secondary/80 hover:text-secondary-foreground',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground'
                  )
                }
              >
                <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                Settings
              </NavLink>
              <NavLink
                to="/api-test"
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg smooth-transition',
                    'hover:bg-secondary/80 hover:text-secondary-foreground',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground'
                  )
                }
              >
                <TestTube className="mr-3 h-5 w-5 flex-shrink-0" />
                API Test
              </NavLink>
              <NavLink
                to="/auth-test"
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg smooth-transition',
                    'hover:bg-secondary/80 hover:text-secondary-foreground',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground'
                  )
                }
              >
                <Shield className="mr-3 h-5 w-5 flex-shrink-0" />
                Auth Test
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Bottom section with user info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
            System Online
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;