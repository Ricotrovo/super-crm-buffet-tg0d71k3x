import { useState, useEffect } from 'react'
import { isWithinInterval, startOfDay, endOfDay, format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const MENUS = ['Supremo', 'Prime', 'Boteco', 'Gold Gourmet']

// Generate deterministic mock data representing 5 years of historical data
const MOCK_DATA = Array.from({ length: 500 }).map((_, i) => {
  const now = new Date()
  const date = subMonths(now, i % 60)
  date.setDate(((i * 7) % 28) + 1)

  const revenue = 3000 + ((i * 123) % 5000)
  const expense = revenue * (0.4 + (i % 20) / 100)

  return {
    id: `ev-${i}`,
    eventName: `Evento ${MENUS[i % 4]} ${i + 1}`,
    date: date.toISOString(),
    revenue,
    expense,
    menuType: MENUS[i % 4],
    isConfirmed: i % 10 !== 0,
  }
})

export function useReportData(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!startDate || !endDate) return

    setIsLoading(true)

    // Simulate API delay for performance criteria
    const timer = setTimeout(() => {
      const start = startOfDay(startDate)
      const end = endOfDay(endDate)

      const filtered = MOCK_DATA.filter((d) => {
        const dDate = new Date(d.date)
        return isWithinInterval(dDate, { start, end })
      })

      const totalEvents = filtered.filter((d) => d.isConfirmed).length
      const totalRevenue = filtered.reduce((acc, d) => acc + d.revenue, 0)
      const totalExpense = filtered.reduce((acc, d) => acc + d.expense, 0)
      const balance = totalRevenue - totalExpense

      const monthlyData: Record<string, any> = {}
      filtered.forEach((d) => {
        const dDate = new Date(d.date)
        const monthKey = format(dDate, 'yyyy-MM')
        const monthStr = format(dDate, 'MMM/yy', { locale: ptBR })

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { monthKey, monthStr, events: 0, revenue: 0, expense: 0 }
        }

        if (d.isConfirmed) monthlyData[monthKey].events += 1
        monthlyData[monthKey].revenue += d.revenue
        monthlyData[monthKey].expense += d.expense
      })

      const sortedMonths = Object.values(monthlyData)
        .sort((a: any, b: any) => a.monthKey.localeCompare(b.monthKey))
        .map((md: any) => ({
          monthStr: md.monthStr,
          events: md.events,
          revenue: md.revenue,
          expense: md.expense,
          balance: md.revenue - md.expense,
        }))

      const funnel = [
        { stage: 'Leads', count: totalEvents * 4, fill: 'hsl(var(--chart-1))' },
        { stage: 'Qualificados', count: totalEvents * 3, fill: 'hsl(var(--chart-2))' },
        { stage: 'Agendados', count: Math.floor(totalEvents * 1.5), fill: 'hsl(var(--chart-3))' },
        { stage: 'Contratos', count: totalEvents, fill: 'hsl(var(--chart-4))' },
      ]

      const menuRevMap: Record<string, number> = {}
      MENUS.forEach((m) => (menuRevMap[m] = 0))
      filtered.forEach((d) => {
        menuRevMap[d.menuType] += d.revenue
      })

      const menuRevenue = MENUS.map((m, i) => ({
        menu: m,
        revenue: menuRevMap[m],
        fill: `hsl(var(--chart-${i + 1}))`,
      }))

      const profitability = filtered
        .map((d) => ({
          id: d.id,
          eventName: d.eventName,
          date: d.date,
          grossRevenue: d.revenue,
          totalExpense: d.expense,
          netProfit: d.revenue - d.expense,
          margin: d.revenue > 0 ? ((d.revenue - d.expense) / d.revenue) * 100 : 0,
          menuType: d.menuType,
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setData({
        kpis: { totalEvents, totalRevenue, totalExpense, balance },
        chartData: sortedMonths,
        funnel,
        menuRevenue,
        profitability,
      })

      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [startDate, endDate])

  return { data, isLoading }
}
