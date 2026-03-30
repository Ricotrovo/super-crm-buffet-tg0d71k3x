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
import { FileText, Plus, Printer, Link as LinkIcon, Download, Send } from 'lucide-react'
import ContractBuilder from './ContractBuilder'
import { ContractPrintView } from './ContractPrintView'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Contract } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

export default function Contracts() {
  const { contracts, financials, updateContract } = useAppStore()
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [viewContract, setViewContract] = useState<Contract | null>(null)
  const { toast } = useToast()

  const handlePrint = () => {
    window.print()
  }

  const getSignatureBadge = (c: Contract) => {
    switch (c.signatureStatus) {
      case 'Assinado':
        return <Badge className="bg-green-500">Assinado</Badge>
      case 'Pendente de Assinatura':
        return <Badge className="bg-yellow-500 text-yellow-950">Pendente</Badge>
      default:
        return <Badge variant="outline">Rascunho</Badge>
    }
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
                <TableHead>Assinatura</TableHead>
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
                    <TableCell>{getSignatureBadge(contract)}</TableCell>
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
            <DialogHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
              <DialogTitle>Contrato #{viewContract.number}</DialogTitle>
              <div className="flex flex-wrap gap-2">
                {viewContract.signatureStatus !== 'Assinado' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateContract(viewContract.id, {
                          signatureStatus: 'Pendente de Assinatura',
                        })
                        setViewContract({
                          ...viewContract,
                          signatureStatus: 'Pendente de Assinatura',
                        })
                        toast({
                          title: 'Assinatura solicitada',
                          description: 'O status do contrato foi atualizado.',
                        })
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" /> Solicitar Assinatura
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `${window.location.origin}/assinatura/${viewContract.id}`
                        navigator.clipboard.writeText(url)
                        toast({
                          title: 'Link copiado!',
                          description: 'Envie para o cliente via WhatsApp.',
                        })
                      }}
                    >
                      <LinkIcon className="w-4 h-4 mr-2" /> Link
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" /> Imprimir
                </Button>
              </div>
            </DialogHeader>
            <ContractPrintView contract={viewContract} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
