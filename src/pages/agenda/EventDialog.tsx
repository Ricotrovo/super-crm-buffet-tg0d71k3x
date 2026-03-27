import { useState, useEffect } from 'react'
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

const VALID_TIMES = ['12:00', '12:30', '13:00', '14:00', '19:00', '19:30', '20:00']

export default function EventDialog({
  open,
  onOpenChange,
  selectedDate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
}) {
  const { events, setEvents, addLog } = useAppStore()
  const { toast } = useToast()

  const [client, setClient] = useState('')
  const [date, setDate] = useState(selectedDate ? selectedDate.toISOString().split('T')[0] : '')
  const [time, setTime] = useState('')
  const [hall, setHall] = useState<Hall>('Salão Premium')

  useEffect(() => {
    if (selectedDate) setDate(selectedDate.toISOString().split('T')[0])
  }, [selectedDate, open])

  const handleSave = () => {
    if (!client || !date || !time) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    const dayEvents = events.filter((e) => e.date === date)

    // Overbooking validation
    const isConflict = dayEvents.some((e) => e.time === time && e.hall === hall)
    if (isConflict) {
      toast({
        title: 'Horário Indisponível',
        description: `O ${hall} já possui evento às ${time}.`,
        variant: 'destructive',
      })
      return
    }

    // Business Rules
    if (time === '13:00') {
      const dinnerEvents = dayEvents.filter(
        (ev) => ev.time === '19:00' || ev.time === '19:30' || ev.time === '20:00',
      )
      if (dinnerEvents.some((ev) => ev.time !== '20:00')) {
        toast({
          title: 'Regra de Negócio',
          description: 'Não é possível alocar às 13h pois há um jantar antes das 20h.',
          variant: 'destructive',
        })
        return
      }
    }
    if (time === '19:00' || time === '19:30') {
      const has13h = dayEvents.some((ev) => ev.time === '13:00')
      if (has13h) {
        toast({
          title: 'Regra de Negócio',
          description: 'Não é possível alocar jantar antes das 20h pois há evento às 13h.',
          variant: 'destructive',
        })
        return
      }
    }

    const newEvent = {
      id: Math.random().toString(),
      clientId: `c${Date.now()}`,
      clientName: client,
      date,
      time,
      hall,
      status: 'Confirmado' as const,
      guests: 50,
    }

    setEvents((prev) => [...prev, newEvent])
    addLog('Evento Criado', `${client} em ${date} no ${hall}`)
    toast({
      title: 'Sucesso',
      description: 'Evento agendado com sucesso e integrado ao GCalendar.',
    })
    onOpenChange(false)
    setClient('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Evento (Integração GCalendar)</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Cliente</Label>
            <Input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Nome do Cliente"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Data</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Horário Permitido</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {VALID_TIMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t} {t === '14:00' && '(Escolar)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
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
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
