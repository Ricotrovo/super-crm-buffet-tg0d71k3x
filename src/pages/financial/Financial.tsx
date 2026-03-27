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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Financial() {
  const { financials, expenses, contracts } = useAppStore()

  const totalRev = financials
    .filter((f) => f.status === 'Pago')
    .reduce((sum, f) => sum + f.value, 0)
  const totalExp = expenses.filter((e) => e.status === 'Pago').reduce((sum, e) => sum + e.value, 0)
  const cashFlow = totalRev - totalExp

  const overdueInstallments = financials.filter(
    (f) => f.status === 'Atrasado' || (f.status === 'Pendente' && new Date(f.dueDate) < new Date()),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary">Hub Financeiro</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-green-50 border-green-100">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-green-700">Receitas Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                totalRev,
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-red-700">Despesas Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                totalExp,
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="py-4">
            <CardTitle className="text-sm text-primary">Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                cashFlow,
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receitas">
        <TabsList>
          <TabsTrigger value="receitas">Receitas (Contratos)</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="inadimplencia" className="text-destructive">
            Inadimplência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="receitas" className="mt-4">
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
                  {financials.map((fin) => (
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
                      <TableCell>
                        <Badge
                          variant={
                            fin.status === 'Pago'
                              ? 'default'
                              : fin.status === 'Atrasado'
                                ? 'destructive'
                                : 'secondary'
                          }
                          className={fin.status === 'Pago' ? 'bg-green-500' : ''}
                        >
                          {fin.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="despesas" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell className="font-medium">{exp.description}</TableCell>
                      <TableCell>{exp.category}</TableCell>
                      <TableCell>{new Date(exp.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        -
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(exp.value)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{exp.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inadimplencia" className="mt-4">
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Relatório de Inadimplência</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Parcela Atrasada</TableHead>
                    <TableHead className="text-right">Valor Devido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueInstallments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Nenhuma inadimplência.
                      </TableCell>
                    </TableRow>
                  )}
                  {overdueInstallments.map((fin) => {
                    const contract = contracts.find((c) => c.id === fin.contractId)
                    return (
                      <TableRow key={fin.id}>
                        <TableCell className="font-medium">#{fin.contractNumber}</TableCell>
                        <TableCell>{contract?.clientName}</TableCell>
                        <TableCell>
                          {fin.installmentNumber}/{fin.totalInstallments} (
                          {new Date(fin.dueDate).toLocaleDateString('pt-BR')})
                        </TableCell>
                        <TableCell className="text-right font-bold text-destructive">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(fin.value)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
