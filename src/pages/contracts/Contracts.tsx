import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Printer } from 'lucide-react'
import ContractBuilder from './ContractBuilder'
import { ContractPrintView } from './ContractPrintView'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Contract } from '@/lib/types'

export default function Contracts() {
  const { contracts, financials } = useAppStore()
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [viewContract, setViewContract] = useState<Contract | null>(null)

  const handlePrint = () => {
    window.print()
  }

  const getContractStatusBadge = (c: Contract) => {
    const fins = financials.filter((f) => f.contractId === c.id)
    if (fins.some((f) => f.status === 'Atrasado'))
      return <Badge variant="destructive">Em Atraso</Badge>
    if (fins.every((f) => f.status === 'Pago'))
      return <Badge className="bg-green-500">Quitado</Badge>
    return <Badge variant="secondary">Em Andamento</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Gestão de Contratos</h1>
        <Button onClick={() => setIsBuilderOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Contrato
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead>Situação Pag.</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum contrato gerado.
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-mono font-medium">#{contract.number}</TableCell>
                    <TableCell className="font-medium">{contract.clientName}</TableCell>
                    <TableCell>
                      {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(contract.total)}
                    </TableCell>
                    <TableCell>{getContractStatusBadge(contract)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setViewContract(contract)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ContractBuilder open={isBuilderOpen} onOpenChange={setIsBuilderOpen} />

      {viewContract && (
        <Dialog open={!!viewContract} onOpenChange={(open) => !open && setViewContract(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:h-auto print:overflow-visible print:p-0 print:border-none print:shadow-none print:bg-white print:fixed print:inset-0 print:z-[9999] print:block">
            <DialogHeader className="flex flex-row items-center justify-between print:hidden">
              <DialogTitle>Contrato #{viewContract.number}</DialogTitle>
              <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
                <Printer className="w-4 h-4 mr-2" /> Imprimir Contrato
              </Button>
            </DialogHeader>
            <ContractPrintView contract={viewContract} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
