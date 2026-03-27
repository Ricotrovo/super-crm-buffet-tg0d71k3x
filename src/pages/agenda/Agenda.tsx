import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAppStore } from '@/stores/main'
import EventDialog from './EventDialog'
import { cn } from '@/lib/utils'

const TIMES = ['12:00', '12:30', '13:00', '14:00', '19:00', '19:30', '20:00']
const HALLS = ['Salão Premium', 'Salão Kids&Teens'] as const

export default function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { events, setEvents, addLog } = useAppStore()

  const selectedDateStr = date ? date.toISOString().split('T')[0] : ''
  const dayEvents = events.filter((e) => e.date === selectedDateStr)

  const handleDrop = (e: React.DragEvent, time: string, hall: string) => {
    e.preventDefault()
    const eventId = e.dataTransfer.getData('eventId')
    if (!eventId) return

    // Business Rule Validation
    if (time === '13:00') {
      const dinnerEvents = dayEvents.filter(
        (ev) =>
          ev.id !== eventId && (ev.time === '19:00' || ev.time === '19:30' || ev.time === '20:00'),
      )
      if (dinnerEvents.some((ev) => ev.time !== '20:00')) {
        alert('Não é possível alocar às 13:00 pois há evento à noite antes das 20:00.')
        return
      }
    }
    if (time === '19:00' || time === '19:30') {
      const has13h = dayEvents.some((ev) => ev.id !== eventId && ev.time === '13:00')
      if (has13h) {
        alert('Não é possível alocar jantar antes das 20:00 pois há evento às 13:00.')
        return
      }
    }
    const isOccupied = dayEvents.some(
      (ev) => ev.time === time && ev.hall === hall && ev.id !== eventId,
    )
    if (isOccupied) {
      alert('Horário já ocupado neste salão.')
      return
    }

    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, time, hall: hall as any } : ev)),
    )
    addLog('Evento Movido', `Evento movido para ${time} no ${hall}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Agenda Anti-Overbooking</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('Sincronização Google Calendar Simulada')}>
            Sync Google Calendar
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Agendar
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm w-full"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Horários - {date?.toLocaleDateString('pt-BR')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[600px] border-t">
              <div className="grid grid-cols-3 bg-muted text-muted-foreground font-semibold p-3 border-b">
                <div className="text-center">Horário</div>
                <div className="text-center text-blue-600">Salão Premium</div>
                <div className="text-center text-green-600">Salão Kids&Teens</div>
              </div>

              <div className="divide-y">
                {TIMES.map((time) => (
                  <div key={time} className="grid grid-cols-3 min-h-[80px]">
                    <div className="flex items-center justify-center font-medium bg-muted/20 border-r">
                      {time}
                      {time === '14:00' && (
                        <span className="ml-2 text-xs text-muted-foreground">(Escolar)</span>
                      )}
                    </div>
                    {HALLS.map((hall) => {
                      const ev = dayEvents.find((e) => e.time === time && e.hall === hall)
                      return (
                        <div
                          key={hall}
                          className={cn(
                            'p-2 border-r last:border-r-0 transition-colors',
                            !ev && 'hover:bg-primary/5',
                          )}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, time, hall)}
                        >
                          {ev ? (
                            <div
                              draggable
                              onDragStart={(e) => e.dataTransfer.setData('eventId', ev.id)}
                              className={cn(
                                'h-full w-full rounded-md border p-2 cursor-grab active:cursor-grabbing shadow-sm flex flex-col justify-between',
                                hall === 'Salão Premium'
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-green-50 border-green-200',
                              )}
                            >
                              <div className="font-semibold text-sm line-clamp-1">
                                {ev.clientName}
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {ev.guests} conv.
                                </span>
                                <Badge variant="outline" className="text-[10px] h-4">
                                  {ev.status}
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground/30 border-2 border-dashed border-transparent hover:border-border rounded-md">
                              Arraste ou clique
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} selectedDate={date} />
    </div>
  )
}
