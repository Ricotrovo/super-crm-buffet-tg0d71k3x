import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/stores/main'
import { Users, CalendarDays, AlertCircle, DollarSign, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'

const Index = () => {
  const { leads, events, financials, inventory } = useAppStore()

  const activeLeads = leads.filter((l) => l.stage !== 'Ganho').length
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const pendingPayments = financials.filter(
    (f) => f.status === 'Pendente' || f.status === 'Atrasado',
  ).length
  const lowStock = inventory.filter((i) => i.currentStock < i.minStock).length

  const funnelData = [
    { stage: 'Novo', count: leads.filter((l) => l.stage === 'Novo').length },
    { stage: 'Contato', count: leads.filter((l) => l.stage === 'Contatado').length },
    { stage: 'Visita', count: leads.filter((l) => l.stage === 'Visita').length },
    { stage: 'Proposta', count: leads.filter((l) => l.stage === 'Proposta').length },
    { stage: 'Ganho', count: leads.filter((l) => l.stage === 'Ganho').length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-secondary">Visão Geral</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/leads">Novo Lead</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/agenda">Novo Evento</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Leads Ativos" value={activeLeads} icon={Users} color="text-blue-500" />
        <MetricCard
          title="Próximos Eventos"
          value={upcomingEvents.length}
          icon={CalendarDays}
          color="text-green-500"
        />
        <MetricCard
          title="Pagamentos Pendentes"
          value={pendingPayments}
          icon={DollarSign}
          color="text-amber-500"
        />
        <MetricCard
          title="Alertas de Estoque"
          value={lowStock}
          icon={AlertCircle}
          color="text-destructive"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
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

        <Card className="col-span-3">
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

export default Index
