import { useState, useMemo } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppStore } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ContractBuilder({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { nextContractNumber, events, setContracts, setFinancials, addLog } = useAppStore()
  const { toast } = useToast()
  const [step, setStep] = useState('detalhes')

  // Form State
  const [eventId, setEventId] = useState('')
  const [basePrice, setBasePrice] = useState(3500)
  const [extraGuests, setExtraGuests] = useState(0)
  const [extraRate, setExtraRate] = useState(80)
  const [optionals, setOptionals] = useState(0)
  const [installments, setInstallments] = useState(1)

  const total = useMemo(() => {
    return basePrice + extraGuests * extraRate + optionals
  }, [basePrice, extraGuests, extraRate, optionals])

  const handleSave = () => {
    if (!eventId || total <= 0) {
      toast({
        title: 'Erro',
        description: 'Selecione um evento e verifique os valores.',
        variant: 'destructive',
      })
      return
    }

    const event = events.find((e) => e.id === eventId)
    if (!event) return

    const newContract = {
      id: Math.random().toString(),
      number: nextContractNumber,
      clientId: event.clientId,
      clientName: event.clientName,
      eventId,
      total,
      status: 'Ativo' as const,
      createdAt: new Date().toISOString(),
      basePrice,
      extraGuests,
      extraRate,
      optionals,
    }

    setContracts((prev) => [...prev, newContract])

    // Generate Installments
    const instValue = total / installments
    const newFins = Array.from({ length: installments }).map((_, i) => ({
      id: Math.random().toString(),
      contractId: newContract.id,
      contractNumber: newContract.number,
      installmentNumber: i + 1,
      totalInstallments: installments,
      value: instValue,
      dueDate: new Date(Date.now() + i * 30 * 86400000).toISOString().split('T')[0],
      status: 'Pendente' as const,
    }))
    setFinancials((prev) => [...prev, ...newFins])

    addLog('Contrato Gerado', `Nº ${nextContractNumber} para ${event.clientName}`)
    toast({
      title: 'Contrato Gerado!',
      description: `Contrato #${nextContractNumber} gerado com sucesso.`,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Novo Contrato Sequencial</SheetTitle>
          <SheetDescription>
            O próximo contrato será gerado com o número #{nextContractNumber}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={step} onValueChange={setStep} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detalhes">Vínculo</TabsTrigger>
            <TabsTrigger value="calculo">Cálculo</TabsTrigger>
            <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label>Vincular a Evento Confirmado</Label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o evento" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.clientName} - {new Date(e.date).toLocaleDateString('pt-BR')} ({e.hall})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="calculo" className="space-y-4 pt-4">
            <div className="grid gap-4 bg-muted/30 p-4 rounded-lg border">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Valor Base Menu (R$)</Label>
                  <Input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Opcionais (R$)</Label>
                  <Input
                    type="number"
                    value={optionals}
                    onChange={(e) => setOptionals(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Convidados Extras</Label>
                  <Input
                    type="number"
                    value={extraGuests}
                    onChange={(e) => setExtraGuests(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Taxa Extra (R$/pessoa)</Label>
                  <Input
                    type="number"
                    value={extraRate}
                    onChange={(e) => setExtraRate(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-primary/10 rounded-md flex justify-between items-center border border-primary/20">
                <span className="font-semibold text-lg text-primary">Valor Total Calculado:</span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    total,
                  )}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pagamento" className="space-y-4 pt-4">
            <div className="grid gap-2">
              <Label>Número de Parcelas (Max 10)</Label>
              <Select
                value={installments.toString()}
                onValueChange={(v) => setInstallments(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground p-4 border rounded bg-muted/20">
              Valor por parcela:{' '}
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                total / installments,
              )}
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {step !== 'pagamento' ? (
            <Button onClick={() => setStep(step === 'detalhes' ? 'calculo' : 'pagamento')}>
              Avançar
            </Button>
          ) : (
            <Button onClick={handleSave}>Finalizar e Gerar</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
