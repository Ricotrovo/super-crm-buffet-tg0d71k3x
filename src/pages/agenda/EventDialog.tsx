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

const VALID_TIMES = ['12:00', '12:30', '13:00', '19:00', '19:30', '20:00']

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
  const [hall, setHall] = useState<'Salão A' | 'Salão B'>('Salão A')

  useEffect(() => {
    if (selectedDate) setDate(selectedDate.toISOString().split('T')[0])
  }, [selectedDate, open])

  const handleSave = () => {
    if (!client || !date || !time) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    if (new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) {
      toast({
        title: 'Data Inválida',
        description: 'Não é possível agendar no passado.',
        variant: 'destructive',
      })
      return
    }

    const isConflict = events.some((e) => e.date === date && e.time === time && e.hall === hall)
    if (isConflict) {
      toast({
        title: 'Horário Indisponível',
        description: `O ${hall} já possui evento às ${time} nesta data.`,
        variant: 'destructive',
      })
      return
    }

    const newEvent = {
      id: Math.random().toString(),
      clientId: `c${Date.now()}`,
      clientName: client,
      date,
      time,
      hall,
      status: 'Rascunho' as const,
      guests: 50,
    }

    setEvents((prev) => [...prev, newEvent])
    addLog('Evento Criado', `${client} em ${date}`)
    toast({ title: 'Sucesso', description: 'Evento agendado com sucesso.' })
    onOpenChange(false)
    setClient('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Evento</DialogTitle>
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
                      {t}
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
                <SelectItem value="Salão A">Salão A</SelectItem>
                <SelectItem value="Salão B">Salão B</SelectItem>
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
