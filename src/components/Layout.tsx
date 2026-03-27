import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useAppStore } from '@/stores/main'

export default function Layout() {
  const { isAuthenticated, currentUser } = useAppStore()
  const location = useLocation()

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (currentUser.role === 'Freelancer' && location.pathname !== '/equipe') {
    return <Navigate to="/equipe" replace />
  }

  const managerAllowed = ['/', '/agenda', '/contratos', '/financeiro']
  if (
    currentUser.role === 'Gerente' &&
    !managerAllowed.some(
      (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    )
  ) {
    return <Navigate to="/" replace />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden flex flex-col bg-slate-50/50">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
