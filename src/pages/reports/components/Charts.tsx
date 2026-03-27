import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts'

export default function Charts({
  data,
  onChartClick,
}: {
  data: any
  onChartClick: (filter: string) => void
}) {
  const cashFlowConfig = {
    revenue: { label: 'Receita', color: 'hsl(var(--chart-1))' },
    expense: { label: 'Despesa', color: 'hsl(var(--chart-2))' },
    balance: { label: 'Saldo', color: 'hsl(var(--chart-3))' },
  }

  const eventsConfig = {
    events: { label: 'Eventos', color: 'hsl(var(--chart-4))' },
  }

  const funnelConfig = {
    count: { label: 'Leads' },
  }

  const menuConfig = {
    revenue: { label: 'Receita' },
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={cashFlowConfig} className="h-[300px] w-full">
            <LineChart data={data.chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="monthStr" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickFormatter={(val) => `R$${val / 1000}k`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="var(--color-expense)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="var(--color-balance)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Volume de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={eventsConfig} className="h-[300px] w-full">
            <LineChart data={data.chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="monthStr" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="events"
                stroke="var(--color-events)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={funnelConfig} className="h-[300px] w-full">
            <PieChart margin={{ top: 10, bottom: 10 }}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={data.funnel}
                dataKey="count"
                nameKey="stage"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
              >
                {data.funnel.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Receita por Cardápio</CardTitle>
          <p className="text-xs text-muted-foreground">
            Clique em uma barra para detalhar o tipo de cardápio na tabela
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={menuConfig} className="h-[300px] w-full">
            <BarChart data={data.menuRevenue} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(val) => `R$${val / 1000}k`}
                tickLine={false}
                axisLine={false}
              />
              <YAxis dataKey="menu" type="category" tickLine={false} axisLine={false} width={80} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="revenue"
                radius={[0, 4, 4, 0]}
                onClick={(entry) => onChartClick(entry?.payload?.menu || entry?.menu)}
                cursor="pointer"
              >
                {data.menuRevenue.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
