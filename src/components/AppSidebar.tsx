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
  LogOut,
  Settings,
  ChevronRight,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useAppStore } from '@/stores/main'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function AppSidebar() {
  const location = useLocation()
  const { currentUser, logout } = useAppStore()

  if (!currentUser) return null

  const navItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/', roles: ['Admin', 'Gerente'] },
    { title: 'Agenda/Salões', icon: CalendarDays, url: '/agenda', roles: ['Admin', 'Gerente'] },
    { title: 'Contratos', icon: FileText, url: '/contratos', roles: ['Admin', 'Gerente'] },
    { title: 'Leads CRM', icon: Users, url: '/leads', roles: ['Admin'] },
    { title: 'Produção', icon: Package, url: '/estoque', roles: ['Admin'] },
    { title: 'Freelancers', icon: UsersRound, url: '/equipe', roles: ['Admin', 'Freelancer'] },
    { title: 'Financeiro', icon: DollarSign, url: '/financeiro', roles: ['Admin', 'Gerente'] },
    { title: 'Auditoria', icon: ShieldAlert, url: '/relatorios', roles: ['Admin'] },
  ]

  const admItems = [
    { title: 'Funcionários', url: '/adm/funcionarios' },
    { title: 'Fornecedores', url: '/adm/fornecedores' },
    { title: 'Freelancers', url: '/adm/freelancers' },
  ]

  const filteredNav = navItems.filter((item) => item.roles.includes(currentUser.role))
  const showAdm = ['Admin'].includes(currentUser.role)
  const isAdmActive = location.pathname.startsWith('/adm')

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-row items-center gap-2 border-b border-sidebar-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
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

              {showAdm && (
                <Collapsible defaultOpen={isAdmActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip="Administração" isActive={isAdmActive}>
                        <Settings className="w-4 h-4" />
                        <span>Administração (ADM)</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {admItems.map((item) => {
                          const isSubActive = location.pathname === item.url
                          return (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild isActive={isSubActive}>
                                <Link to={item.url}>
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair do Sistema
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
