import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, UserPlus, Phone } from 'lucide-react'

export default function Team() {
  const { team, events, currentUser, escalas, setEscalas, addLog } = useAppStore()
  const { toast } = useToast()
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState('')
  const [selectedMember, setSelectedMember] = useState('')

  const isFreelancer = currentUser?.role === 'Freelancer'

  const handleAssign = () => {
    if (!selectedEvent || !selectedMember) return
    const newEscala = {
      id: Math.random().toString(),
      eventId: selectedEvent,
      memberId: selectedMember,
      status: 'Pendente' as const,
    }
    setEscalas((prev) => [...prev, newEscala])
    addLog('Escala Atribuída', `Membro ${selectedMember} no evento ${selectedEvent}`)
    toast({ title: 'Escala enviada', description: 'Notificação WhatsApp simulada enviada.' })
    setAssignOpen(false)
  }

  const handleFreelancerAction = (
    escalaId: string,
    action: 'Confirmado' | 'Recusado' | 'Check-in',
  ) => {
    setEscalas((prev) =>
      prev.map((e) => {
        if (e.id === escalaId) {
          if (action === 'Check-in') return { ...e, checkIn: new Date().toLocaleTimeString() }
          return { ...e, status: action }
        }
        return e
      }),
    )
    toast({ title: 'Atualizado', description: `Ação registrada: ${action}` })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">
          {isFreelancer ? 'Minha Escala' : 'Hub de Freelancers'}
        </h1>
        {!isFreelancer && (
          <Button onClick={() => setAssignOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Escalar Equipe
          </Button>
        )}
      </div>

      {!isFreelancer && (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {team.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" title="Avisar WhatsApp">
                  <Phone className="w-4 h-4 text-green-600" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isFreelancer ? 'Meus Eventos' : 'Escalas em Andamento'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {escalas
              .filter((e) => (isFreelancer ? e.memberId === currentUser.id : true))
              .map((escala) => {
                const event = events.find((ev) => ev.id === escala.eventId)
                const member = team.find((m) => m.id === escala.memberId)
                if (!event) return null

                return (
                  <div
                    key={escala.id}
                    className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-base">
                        {event.clientName} - {event.hall}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                      </p>
                      {!isFreelancer && (
                        <p className="text-xs font-medium text-primary mt-1">
                          Escalado: {member?.name}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={escala.status === 'Confirmado' ? 'default' : 'outline'}>
                        Status: {escala.status}
                      </Badge>

                      {isFreelancer && escala.status === 'Pendente' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleFreelancerAction(escala.id, 'Confirmado')}
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleFreelancerAction(escala.id, 'Recusado')}
                          >
                            Recusar
                          </Button>
                        </div>
                      )}

                      {isFreelancer && escala.status === 'Confirmado' && !escala.checkIn && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600"
                          onClick={() => handleFreelancerAction(escala.id, 'Check-in')}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Realizar Check-in
                        </Button>
                      )}

                      {(escala.checkIn || !isFreelancer) && (
                        <div className="text-xs text-muted-foreground text-right">
                          {escala.checkIn ? `Check-in: ${escala.checkIn}` : 'Check-in pendente'}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            {escalas.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Nenhuma escala ativa.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Escala</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Evento</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {events
                    .filter((e) => e.status === 'Confirmado')
                    .map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.clientName} - {e.date}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Freelancer</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {team.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAssign} className="w-full">
            Enviar Convite WhatsApp
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
