import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function Financial() {
  const { financials } = useAppStore()

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue =
      status === 'Pendente' && new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
    if (isOverdue || status === 'Atrasado') return <Badge variant="destructive">Atrasado</Badge>
    if (status === 'Pago')
      return (
        <Badge variant="default" className="bg-green-500">
          Pago
        </Badge>
      )
    return <Badge variant="secondary">Pendente</Badge>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary">Controle Financeiro</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-green-50">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-green-700">Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                financials.filter((f) => f.status === 'Pago').reduce((a, b) => a + b.value, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-amber-700">A Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                financials.filter((f) => f.status === 'Pendente').reduce((a, b) => a + b.value, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-red-700">Inadimplência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                financials
                  .filter(
                    (f) =>
                      f.status === 'Atrasado' ||
                      (f.status === 'Pendente' && new Date(f.dueDate) < new Date()),
                  )
                  .reduce((a, b) => a + b.value, 0),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Parcela</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financials
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((fin) => (
                  <TableRow key={fin.id}>
                    <TableCell className="font-medium">#{fin.contractNumber}</TableCell>
                    <TableCell>
                      {fin.installmentNumber}/{fin.totalInstallments}
                    </TableCell>
                    <TableCell>{new Date(fin.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(fin.value)}
                    </TableCell>
                    <TableCell>{getStatusBadge(fin.status, fin.dueDate)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
