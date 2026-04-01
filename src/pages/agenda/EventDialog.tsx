import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { Hall } from '@/lib/types'
import { Checkbox } from '@/components/ui/checkbox'

export default function EventDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { events, setEvents, addLog, menuConfigs } = useAppStore()
  const { toast } = useToast()

  const [contractNumber, setContractNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('12:00')
  const [hall, setHall] = useState<Hall>('Salão Premium')
  const [menuId, setMenuId] = useState('')
  const [guests, setGuests] = useState('50')
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([])

  const selectedMenuConfig = useMemo(
    () => menuConfigs.find((m) => m.id === menuId),
    [menuConfigs, menuId],
  )

  const resetForm = () => {
    setContractNumber('')
    setClientName('')
    setDate('')
    setTime('12:00')
    setHall('Salão Premium')
    setMenuId('')
    setGuests('50')
    setSelectedOptionals([])
  }

  const handleToggleOptional = (optName: string) => {
    setSelectedOptionals((prev) =>
      prev.includes(optName) ? prev.filter((n) => n !== optName) : [...prev, optName],
    )
  }

  const handleSave = () => {
    if (!clientName || !date || !time) {
      toast({
        title: 'Erro',
        description: 'Preencha os campos obrigatórios (Cliente, Data, Horário).',
        variant: 'destructive',
      })
      return
    }

    const dayEvents = events.filter((e) => e.date === date)

    const isConflict = dayEvents.some((e) => e.time === time && e.hall === hall)
    if (isConflict) {
      toast({
        title: 'Horário Indisponível',
        description: `O ${hall} já possui evento às ${time}.`,
        variant: 'destructive',
      })
      return
    }

    const newEvent = {
      id: Math.random().toString(),
      clientId: `c${Date.now()}`,
      clientName,
      contractNumber,
      menu: selectedMenuConfig?.name,
      menuId,
      date,
      time,
      hall,
      status: 'Confirmado' as const,
      guests: parseInt(guests) || 0,
      selectedOptionals,
    }

    setEvents((prev) => [...prev, newEvent])
    addLog('Evento Criado', `${clientName} em ${date} às ${time} no ${hall}`)
    toast({
      title: 'Sucesso',
      description: 'Evento adicionado à agenda.',
    })

    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) resetForm()
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Novo Evento</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="grid gap-2 md:col-span-2">
            <Label>Nome do Contratante *</Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome do cliente responsável"
            />
          </div>

          <div className="grid gap-2">
            <Label>Nº de Contrato</Label>
            <Input
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder="Ex: 8002"
            />
          </div>

          <div className="grid gap-2">
            <Label>Qtde. Convidados</Label>
            <Input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="Ex: 50"
              min="1"
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label>Cardápio</Label>
            <Select
              value={menuId}
              onValueChange={(v) => {
                setMenuId(v)
                setSelectedOptionals([])
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {menuConfigs.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMenuConfig?.optionalItems && selectedMenuConfig.optionalItems.length > 0 && (
            <div className="grid gap-2 md:col-span-2 bg-muted/30 p-3 rounded-md border">
              <Label>Serviços Opcionais</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {selectedMenuConfig.optionalItems.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <Checkbox
                      id={opt.id}
                      checked={selectedOptionals.includes(opt.name)}
                      onCheckedChange={() => handleToggleOptional(opt.name)}
                    />
                    <Label htmlFor={opt.id} className="font-normal cursor-pointer">
                      {opt.name} (+ R$ {opt.price})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Data *</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Horário *</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label>Salão</Label>
            <Select value={hall} onValueChange={(v: any) => setHall(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Salão Premium">Salão Premium</SelectItem>
                <SelectItem value="Salão Kids&Teens">Salão Kids&Teens</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Evento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
