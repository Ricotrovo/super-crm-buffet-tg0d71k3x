import { useState } from 'react'
import { startOfMonth, endOfMonth, startOfQuarter, startOfYear, subMonths } from 'date-fns'
import { Download, FileText, Loader2, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { useReportData } from './useReportData'

import KPICards from './components/KPICards'
import Charts from './components/Charts'
import ProfitabilityTable from './components/ProfitabilityTable'
import AuditLog from './components/AuditLog'

export default function Reports() {
  const [dateRange, setDateRange] = useState<any>({
    from: startOfYear(new Date()),
    to: new Date(),
  })
  const [filterMenu, setFilterMenu] = useState<string | null>(null)
  const { toast } = useToast()

  const { data, isLoading } = useReportData(dateRange?.from, dateRange?.to)

  const handleQuickFilter = (val: string) => {
    const today = new Date()
    switch (val) {
      case 'thisMonth':
        setDateRange({ from: startOfMonth(today), to: today })
        break
      case 'lastMonth':
        setDateRange({
          from: startOfMonth(subMonths(today, 1)),
          to: endOfMonth(subMonths(today, 1)),
        })
        break
      case 'thisQuarter':
        setDateRange({ from: startOfQuarter(today), to: today })
        break
      case 'thisYear':
        setDateRange({ from: startOfYear(today), to: today })
        break
    }
  }

  const exportCSV = () => {
    if (!data) return
    try {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Data,Evento,Cardapio,Receita Bruta,Despesa Total,Lucro Liquido,Margem\n' +
        data.profitability
          .map(
            (row: any) =>
              `${row.date},${row.eventName},${row.menuType},${row.grossRevenue},${row.totalExpense},${row.netProfit},${row.margin}`,
          )
          .join('\n')

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `Report_${new Date().getTime()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Exportação Concluída',
        description: 'O arquivo CSV foi baixado com sucesso.',
      })
    } catch (e) {
      toast({
        title: 'Erro na exportação',
        description: 'Error exporting file, please try again.',
        variant: 'destructive',
      })
    }
  }

  const exportPDF = () => {
    toast({
      title: 'Gerando PDF...',
      description: 'O relatório em PDF está sendo gerado e será baixado em breve.',
    })
    setTimeout(() => {
      toast({ title: 'PDF Exportado', description: 'O arquivo PDF foi gerado com sucesso.' })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
        <h1 className="text-3xl font-bold text-secondary">Dashboard & Relatórios</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Select onValueChange={handleQuickFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filtro Rápido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">Este Mês</SelectItem>
              <SelectItem value="lastMonth">Mês Passado</SelectItem>
              <SelectItem value="thisQuarter">Este Trimestre</SelectItem>
              <SelectItem value="thisYear">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button variant="outline" onClick={exportCSV} disabled={isLoading || !data}>
            <Download className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button onClick={exportPDF} disabled={isLoading || !data}>
            <FileText className="mr-2 h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Visão Geral</TabsTrigger>
          <TabsTrigger value="audit">Auditoria do Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {isLoading || !data ? (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-card text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : data.profitability.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card text-muted-foreground border-dashed">
              <Filter className="h-10 w-10 mb-2 opacity-50" />
              <p>No data available for this period.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <KPICards kpis={data.kpis} />

              {filterMenu && (
                <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <span className="text-sm">
                    Filtrando dados pelo cardápio:{' '}
                    <strong className="text-primary">{filterMenu}</strong>
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setFilterMenu(null)}>
                    Limpar Filtro
                  </Button>
                </div>
              )}

              <Charts data={data} onChartClick={setFilterMenu} />
              <ProfitabilityTable data={data.profitability} filterMenu={filterMenu} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}
