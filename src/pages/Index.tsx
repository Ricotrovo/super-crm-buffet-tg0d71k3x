import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/stores/main'
import { CalendarDays, AlertCircle, Users, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export default function Index() {
  const { currentUser, events, leads, financials } = useAppStore()

  if (!currentUser) return null

  const isAdmin = currentUser.role === 'Admin'
  const isManager = currentUser.role === 'Gerente'

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date() && e.status === 'Confirmado')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pendingLeads = leads.filter((l) => l.stage === 'Novo' || l.stage === 'Contatado').length

  const delayedPayments = financials.filter(
    (f) =>
      f.status === 'Atrasado' ||
      (f.status === 'Pendente' && new Date(f.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))),
  ).length

  const funnelData = [
    { stage: 'Novo', count: leads.filter((l) => l.stage === 'Novo').length },
    { stage: 'Contato', count: leads.filter((l) => l.stage === 'Contatado').length },
    { stage: 'Visita', count: leads.filter((l) => l.stage === 'Visita').length },
    { stage: 'Proposta', count: leads.filter((l) => l.stage === 'Proposta').length },
    { stage: 'Ganho', count: leads.filter((l) => l.stage === 'Ganho').length },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Bem-vindo, {currentUser.name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Aqui está o resumo das suas atividades no CRM.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {(isAdmin || isManager) && (
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/agenda">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Evento
                </Link>
              </Button>
            )}
            {isAdmin && (
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/leads">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Lead
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Próximos Eventos"
          value={upcomingEvents.length}
          icon={CalendarDays}
          color="text-secondary"
        />
        {isAdmin && (
          <MetricCard
            title="Leads Pendentes"
            value={pendingLeads}
            icon={Users}
            color="text-primary"
          />
        )}
        {(isAdmin || isManager) && (
          <MetricCard
            title="Pagamentos Atrasados"
            value={delayedPayments}
            icon={AlertCircle}
            color="text-accent"
          />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {isAdmin && (
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <ChartContainer
                config={{ count: { label: 'Leads', color: 'hsl(var(--primary))' } }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        <Card className={isAdmin ? 'col-span-3' : 'col-span-4 lg:col-span-7'}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos Eventos</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agenda" className="text-xs">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{event.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date} às {event.time}
                    </p>
                  </div>
                  <Badge variant={event.hall === 'Salão A' ? 'default' : 'secondary'}>
                    {event.hall}
                  </Badge>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum evento próximo.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
