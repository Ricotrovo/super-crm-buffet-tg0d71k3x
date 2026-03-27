import { Bell, Search, UserCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore, MOCK_USERS } from '@/stores/main'
import { Badge } from '@/components/ui/badge'

export function AppHeader() {
  const location = useLocation()
  const { currentUser, setCurrentUser } = useAppStore()

  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
              const isLast = index === pathnames.length - 1
              return (
                <div key={name} className="flex items-center gap-2">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="capitalize">{name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={routeTo} className="capitalize">
                        {name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar contratos, leads..."
            className="w-full bg-background pl-8"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 rounded-full flex items-center gap-2 px-2 hover:bg-muted"
            >
              <UserCircle className="h-6 w-6 text-primary" />
              <div className="flex flex-col items-start text-xs hidden sm:flex">
                <span className="font-medium">{currentUser.name}</span>
                <span className="text-muted-foreground">{currentUser.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Alternar Usuário (Mock)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MOCK_USERS.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className="flex items-center justify-between"
              >
                {user.name}
                {currentUser.id === user.id && (
                  <Badge variant="secondary" className="text-[10px]">
                    Atual
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
