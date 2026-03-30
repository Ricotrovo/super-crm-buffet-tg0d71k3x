import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, CalendarDays, Clock, Users, FileText, Utensils, User } from 'lucide-react'
import { useAppStore } from '@/stores/main'
import EventDialog from './EventDialog'

export default function Agenda() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { events } = useAppStore()

  // Sort events chronologically by date and time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-secondary">Agenda de Eventos</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </div>

      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            Nenhum evento agendado.
          </div>
        ) : (
          sortedEvents.map((ev) => (
            <Card key={ev.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Date & Time Sidebar */}
                  <div className="bg-muted/30 p-6 md:w-64 flex flex-col gap-3 border-b md:border-b-0 md:border-r">
                    <div className="flex items-center gap-2 font-bold text-lg text-primary">
                      <CalendarDays className="h-5 w-5" />
                      {formatDate(ev.date)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                      <Clock className="h-4 w-4" />
                      {ev.time}
                    </div>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={
                          ev.hall === 'Salão Premium'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }
                      >
                        {ev.hall}
                      </Badge>
                    </div>
                    <div>
                      <Badge variant="secondary" className="text-xs">
                        {ev.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Event Details Grid */}
                  <div className="p-6 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">
                        Nº de Contrato
                      </div>
                      <div className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground/70" />
                        {ev.contractNumber || 'Não informado'}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">
                        Nome do Contratante
                      </div>
                      <div className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground/70" />
                        {ev.clientName}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">Cardápio</div>
                      <div className="font-semibold flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-muted-foreground/70" />
                        {ev.menu || 'Não definido'}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">
                        Qtde. Convidados
                      </div>
                      <div className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground/70" />
                        {ev.guests} convidados
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EventDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
