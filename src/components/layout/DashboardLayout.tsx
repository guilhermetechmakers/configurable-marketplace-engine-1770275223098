import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet as SheetPrimitive,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCurrentUser } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Store,
  Package,
  MessageSquare,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SIDEBAR_COLLAPSED_KEY = 'dashboard-sidebar-collapsed'

const navItems: { to: string; label: string; icon: React.ElementType }[] = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/seller', label: 'Seller', icon: Store },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help', icon: HelpCircle },
]

interface DashboardLayoutProps {
  children?: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const { data: user } = useCurrentUser()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    if (stored !== null) setCollapsed(stored === 'true')
  }, [])

  const persistCollapsed = (value: boolean) => {
    setCollapsed(value)
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(value))
  }

  const isSeller = user?.role === 'seller'
  const items = navItems.filter(
    (item) => item.to !== '/dashboard/seller' || isSeller,
  )

  const navContent = (
    <nav className="flex flex-col gap-1 p-2">
      {items.map(({ to, label, icon: Icon }) => {
        const isActive =
          location.pathname === to ||
          (to === '/dashboard' && location.pathname === '/dashboard') ||
          (to !== '/dashboard' && location.pathname.startsWith(to))
        return (
          <Link
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary text-primary-foreground shadow-card'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar: mobile menu + optional collapse toggle */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card px-4 shadow-sm md:px-6">
        <SheetPrimitive open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-14 items-center border-b border-border px-4 font-semibold">
              Dashboard
            </div>
            {navContent}
          </SheetContent>
        </SheetPrimitive>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => persistCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <span className="text-sm font-medium text-muted-foreground">
          {location.pathname === '/dashboard' && 'Overview'}
          {location.pathname.startsWith('/dashboard/seller') && 'Seller'}
          {location.pathname.startsWith('/orders') && 'Orders'}
          {location.pathname.startsWith('/messages') && 'Messages'}
          {location.pathname.startsWith('/settings') && 'Settings'}
          {location.pathname.startsWith('/help') && 'Help'}
        </span>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            'hidden border-r border-border bg-card transition-[width] duration-300 md:block',
            collapsed ? 'w-[72px]' : 'w-56',
          )}
        >
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            {navContent}
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}
