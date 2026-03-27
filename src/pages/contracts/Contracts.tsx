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
          <DialogContent className="max-w-2xl">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Contrato #{viewContract.number}</DialogTitle>
              <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
                <Printer className="w-4 h-4 mr-2" /> Imprimir PDF
              </Button>
            </DialogHeader>
            <div className="space-y-6 print:block print:text-black">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">Tribo da Folia Buffet</h2>
                <p className="text-sm text-muted-foreground">Termo de Prestação de Serviços</p>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Contratante:</strong> {viewContract.clientName}
                </p>
                <p>
                  <strong>Data de Emissão:</strong>{' '}
                  {new Date(viewContract.createdAt).toLocaleDateString('pt-BR')}
                </p>
                <div className="bg-muted p-4 rounded mt-4">
                  <p>Valor Base do Menu: R$ {viewContract.basePrice.toFixed(2)}</p>
                  <p>
                    Convidados Extras ({viewContract.extraGuests}): R${' '}
                    {(viewContract.extraGuests * viewContract.extraRate).toFixed(2)}
                  </p>
                  <p>Opcionais: R$ {viewContract.optionals.toFixed(2)}</p>
                  <p className="font-bold mt-2 pt-2 border-t text-lg">
                    Total Acordado: R$ {viewContract.total.toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">Plano de Pagamento</h3>
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financials
                      .filter((f) => f.contractId === viewContract.id)
                      .sort((a, b) => a.installmentNumber - b.installmentNumber)
                      .map((inst) => (
                        <TableRow key={inst.id}>
                          <TableCell>
                            {inst.installmentNumber}/{inst.totalInstallments}
                          </TableCell>
                          <TableCell>
                            {new Date(inst.dueDate).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>R$ {inst.value.toFixed(2)}</TableCell>
                          <TableCell>{inst.status}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
