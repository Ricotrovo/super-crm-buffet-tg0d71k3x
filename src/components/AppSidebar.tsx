import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  DollarSign,
  Package,
  UsersRound,
  ShieldAlert,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAppStore } from '@/stores/main'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()
  const { currentUser } = useAppStore()

  const navItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/', roles: ['Admin', 'Gerente'] },
    { title: 'Leads', icon: Users, url: '/leads', roles: ['Admin', 'Gerente'] },
    { title: 'Agenda', icon: CalendarDays, url: '/agenda', roles: ['Admin', 'Gerente'] },
    { title: 'Contratos', icon: FileText, url: '/contratos', roles: ['Admin', 'Gerente'] },
    { title: 'Financeiro', icon: DollarSign, url: '/financeiro', roles: ['Admin', 'Gerente'] },
    { title: 'Estoque', icon: Package, url: '/estoque', roles: ['Admin', 'Gerente'] },
    {
      title: 'Equipe',
      icon: UsersRound,
      url: '/equipe',
      roles: ['Admin', 'Gerente', 'Freelancer'],
    },
    { title: 'Logs do Sistema', icon: ShieldAlert, url: '/logs', roles: ['Admin'] },
  ]

  const filteredNav = navItems.filter((item) => item.roles.includes(currentUser.role))

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-row items-center gap-2 border-b border-sidebar-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
          T
        </div>
        <span className="font-bold text-lg text-sidebar-foreground truncate">Tribo da Folia</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNav.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url !== '/' && location.pathname.startsWith(item.url))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
