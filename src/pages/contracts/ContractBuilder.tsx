import { useState, useMemo, useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

export default function ContractBuilder({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { nextContractNumber, events, leads, setContracts, setFinancials, addLog } = useAppStore()
  const { toast } = useToast()
  const [step, setStep] = useState('detalhes')

  const [eventId, setEventId] = useState('')
  const [clientNationality, setClientNationality] = useState('Brasileiro(a)')
  const [clientMaritalStatus, setClientMaritalStatus] = useState('Solteiro(a)')
  const [clientRg, setClientRg] = useState('')
  const [clientCpf, setClientCpf] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')

  const [birthdayPersonName, setBirthdayPersonName] = useState('')
  const [birthdayPersonAge, setBirthdayPersonAge] = useState<number | ''>('')
  const [decorationTheme, setDecorationTheme] = useState('')
  const [specialInclusions, setSpecialInclusions] = useState('')
  const [alcoholicDrinksIncluded, setAlcoholicDrinksIncluded] = useState(false)
  const [imageRightsGranted, setImageRightsGranted] = useState(true)

  const [basePrice, setBasePrice] = useState(3500)
  const [extraGuests, setExtraGuests] = useState(0)
  const [extraRate, setExtraRate] = useState(100)
  const [optionals, setOptionals] = useState(0)
  const [installments, setInstallments] = useState(1)
  const [paymentMethodDescription, setPaymentMethodDescription] = useState(
    'Sinal de 30% e o restante até 5 dias antes do evento.',
  )

  const total = useMemo(
    () => basePrice + extraGuests * extraRate + optionals,
    [basePrice, extraGuests, extraRate, optionals],
  )

  useEffect(() => {
    if (eventId) {
      const ev = events.find((e) => e.id === eventId)
      if (ev) {
        const lead = leads.find((l) => l.name === ev.clientName)
        if (lead) setClientPhone(lead.phone)
      }
    }
  }, [eventId, events, leads])

  const handleSave = () => {
    if (!eventId || total <= 0)
      return toast({
        title: 'Erro',
        description: 'Selecione evento e valor.',
        variant: 'destructive',
      })
    const ev = events.find((e) => e.id === eventId)
    if (!ev) return

    const newContract = {
      id: Math.random().toString(),
      number: nextContractNumber,
      clientId: ev.clientId,
      clientName: ev.clientName,
      eventId,
      total,
      status: 'Ativo' as const,
      createdAt: new Date().toISOString(),
      basePrice,
      extraGuests,
      extraRate,
      optionals,
      clientNationality,
      clientMaritalStatus,
      clientRg,
      clientCpf,
      clientAddress,
      clientEmail,
      clientPhone,
      birthdayPersonName,
      birthdayPersonAge: Number(birthdayPersonAge),
      eventDate: ev.date,
      eventTimeStart: ev.time,
      eventTimeEnd: '22:00',
      eventHall: ev.hall,
      guestCount: ev.guests,
      decorationTheme,
      specialInclusions,
      alcoholicDrinksIncluded,
      paymentMethodDescription,
      imageRightsGranted,
      signatureStatus: 'Rascunho' as const,
    }

    setContracts((p) => [...p, newContract])
    const newFins = Array.from({ length: installments }).map((_, i) => ({
      id: Math.random().toString(),
      contractId: newContract.id,
      contractNumber: newContract.number,
      installmentNumber: i + 1,
      totalInstallments: installments,
      value: total / installments,
      dueDate: new Date(Date.now() + i * 30 * 86400000).toISOString().split('T')[0],
      status: 'Pendente' as const,
    }))
    setFinancials((p) => [...p, ...newFins])
    addLog('Contrato Gerado', `Nº ${nextContractNumber} para ${ev.clientName}`)
    toast({ title: 'Sucesso', description: `Contrato #${nextContractNumber} gerado.` })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Novo Contrato #{nextContractNumber}</SheetTitle>
        </SheetHeader>
        <Tabs value={step} onValueChange={setStep} className="w-full">
          <TabsList className="grid w-full grid-cols-5 text-xs">
            <TabsTrigger value="detalhes">Vínculo</TabsTrigger>
            <TabsTrigger value="cliente">Cliente</TabsTrigger>
            <TabsTrigger value="evento">Evento</TabsTrigger>
            <TabsTrigger value="calculo">Cálculo</TabsTrigger>
            <TabsTrigger value="pagamento">Pagto</TabsTrigger>
          </TabsList>
          <TabsContent value="detalhes" className="space-y-4 pt-4">
            <Label>Vincular a Evento</Label>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o evento" />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.clientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>
          <TabsContent value="cliente" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nacionalidade</Label>
                <Input
                  value={clientNationality}
                  onChange={(e) => setClientNationality(e.target.value)}
                />
              </div>
              <div>
                <Label>Estado Civil</Label>
                <Input
                  value={clientMaritalStatus}
                  onChange={(e) => setClientMaritalStatus(e.target.value)}
                />
              </div>
              <div>
                <Label>RG</Label>
                <Input value={clientRg} onChange={(e) => setClientRg(e.target.value)} />
              </div>
              <div>
                <Label>CPF</Label>
                <Input value={clientCpf} onChange={(e) => setClientCpf(e.target.value)} />
              </div>
              <div className="col-span-2">
                <Label>Endereço Completo</Label>
                <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="evento" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Aniversariante</Label>
                <Input
                  value={birthdayPersonName}
                  onChange={(e) => setBirthdayPersonName(e.target.value)}
                />
              </div>
              <div>
                <Label>Idade</Label>
                <Input
                  type="number"
                  value={birthdayPersonAge}
                  onChange={(e) => setBirthdayPersonAge(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Tema</Label>
                <Input
                  value={decorationTheme}
                  onChange={(e) => setDecorationTheme(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Cortesias</Label>
                <Textarea
                  value={specialInclusions}
                  onChange={(e) => setSpecialInclusions(e.target.value)}
                />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  checked={alcoholicDrinksIncluded}
                  onCheckedChange={setAlcoholicDrinksIncluded}
                />
                <Label>Bebida Alcoólica?</Label>
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Switch checked={imageRightsGranted} onCheckedChange={setImageRightsGranted} />
                <Label>Autoriza LGPD?</Label>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="calculo" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Base (R$)</Label>
                <Input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Opcionais (R$)</Label>
                <Input
                  type="number"
                  value={optionals}
                  onChange={(e) => setOptionals(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Convidados Extras</Label>
                <Input
                  type="number"
                  value={extraGuests}
                  onChange={(e) => setExtraGuests(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Taxa Extra</Label>
                <Input
                  type="number"
                  value={extraRate}
                  onChange={(e) => setExtraRate(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="text-xl font-bold mt-4">Total: R$ {total.toFixed(2)}</div>
          </TabsContent>
          <TabsContent value="pagamento" className="space-y-4 pt-4">
            <Label>Parcelas</Label>
            <Select
              value={installments.toString()}
              onValueChange={(v) => setInstallments(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>Condições</Label>
            <Textarea
              value={paymentMethodDescription}
              onChange={(e) => setPaymentMethodDescription(e.target.value)}
            />
          </TabsContent>
        </Tabs>
        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {step !== 'pagamento' ? (
            <Button
              onClick={() =>
                setStep(
                  ['detalhes', 'cliente', 'evento', 'calculo', 'pagamento'][
                    ['detalhes', 'cliente', 'evento', 'calculo', 'pagamento'].indexOf(step) + 1
                  ],
                )
              }
            >
              Avançar
            </Button>
          ) : (
            <Button onClick={handleSave}>Salvar</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
