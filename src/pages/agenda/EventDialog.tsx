import { useState } from 'react'
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

export default function EventDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { events, setEvents, addLog } = useAppStore()
  const { toast } = useToast()

  const [contractNumber, setContractNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('12:00')
  const [hall, setHall] = useState<Hall>('Salão Premium')
  const [menu, setMenu] = useState('')
  const [guests, setGuests] = useState('50')

  const resetForm = () => {
    setContractNumber('')
    setClientName('')
    setDate('')
    setTime('12:00')
    setHall('Salão Premium')
    setMenu('')
    setGuests('50')
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

    // Basic conflict validation
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
      menu,
      date,
      time,
      hall,
      status: 'Confirmado' as const,
      guests: parseInt(guests) || 0,
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
      <DialogContent className="max-w-2xl">
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
            <Input
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
              placeholder="Ex: Festa Kids Tradicional, Teen Party Snacks..."
            />
          </div>

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
