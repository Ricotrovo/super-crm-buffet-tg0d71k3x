import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAppStore } from '@/stores/main'
import EventDialog from './EventDialog'

export default function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { events } = useAppStore()

  const selectedDateStr = date ? date.toISOString().split('T')[0] : ''
  const dayEvents = events
    .filter((e) => e.date === selectedDateStr)
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Agenda de Eventos</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Agendar
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm w-full"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Eventos em {date?.toLocaleDateString('pt-BR')}</CardTitle>
          </CardHeader>
          <CardContent>
            {dayEvents.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                Nenhum evento agendado para esta data.
              </div>
            ) : (
              <div className="space-y-4">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{event.time}</span>
                        <Badge variant={event.hall === 'Salão A' ? 'default' : 'secondary'}>
                          {event.hall}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            event.status === 'Confirmado'
                              ? 'text-green-600 border-green-200 bg-green-50'
                              : ''
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="font-medium text-lg">{event.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.guests} convidados previstos
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex gap-2">
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} selectedDate={date} />
    </div>
  )
}
