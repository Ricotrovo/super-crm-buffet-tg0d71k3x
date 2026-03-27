import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useAppStore } from '@/stores/main'

export default function Layout() {
  const { currentUser } = useAppStore()
  const location = useLocation()

  // Basic role protection
  if (currentUser.role === 'Freelancer' && location.pathname !== '/equipe') {
    return <Navigate to="/equipe" replace />
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
