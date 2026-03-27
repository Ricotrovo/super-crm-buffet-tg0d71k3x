import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ProfitabilityTable({
  data,
  filterMenu,
}: {
  data: any[]
  filterMenu?: string | null
}) {
  const formatCur = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const filteredData = filterMenu ? data.filter((d) => d.menuType === filterMenu) : data
  const displayData = filteredData.slice(0, 50) // Limit rows for rendering performance

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Análise de Rentabilidade{' '}
          {filterMenu && <span className="text-primary">- {filterMenu}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Cardápio</TableHead>
              <TableHead className="text-right">Receita Bruta</TableHead>
              <TableHead className="text-right">Despesa Total</TableHead>
              <TableHead className="text-right">Lucro Líquido</TableHead>
              <TableHead className="text-right">Margem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhum dado encontrado para o filtro atual.
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(row.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium">{row.eventName}</TableCell>
                  <TableCell>{row.menuType}</TableCell>
                  <TableCell className="text-right">{formatCur(row.grossRevenue)}</TableCell>
                  <TableCell className="text-right text-rose-500">
                    {formatCur(row.totalExpense)}
                  </TableCell>
                  <TableCell className="text-right text-emerald-500 font-medium">
                    {formatCur(row.netProfit)}
                  </TableCell>
                  <TableCell className="text-right">{row.margin.toFixed(1)}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
