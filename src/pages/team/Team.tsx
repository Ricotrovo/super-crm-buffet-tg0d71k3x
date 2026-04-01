import { useState, useMemo } from 'react'
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
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'

export default function Team() {
  const { team, events, currentUser, escalas, setEscalas, addLog, menuConfigs } = useAppStore()
  const { toast } = useToast()
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedMember, setSelectedMember] = useState('')

  const isFreelancer = currentUser?.role === 'Freelancer'
  const activeEvents = useMemo(() => events.filter((e) => e.status === 'Confirmado'), [events])

  const eventStaffRequirements = useMemo(() => {
    const reqs: Record<string, Record<string, { required: number; filled: number }>> = {}
    activeEvents.forEach((ev) => {
      reqs[ev.id] = {}
      const menu = menuConfigs.find((m) => m.id === ev.menuId || m.name === ev.menu)
      if (menu) {
        menu.baseStaff?.forEach((bs) => {
          if (!reqs[ev.id][bs.role]) reqs[ev.id][bs.role] = { required: 0, filled: 0 }
          reqs[ev.id][bs.role].required += bs.quantity
        })
        menu.scalingRules?.forEach((sr) => {
          if (ev.guests > sr.guestThreshold) {
            if (!reqs[ev.id][sr.role]) reqs[ev.id][sr.role] = { required: 0, filled: 0 }
            reqs[ev.id][sr.role].required += sr.extraQuantity
          }
        })
        menu.optionalItems?.forEach((opt) => {
          if (ev.selectedOptionals?.includes(opt.name) && opt.triggersExtraStaff && opt.staffRole) {
            if (!reqs[ev.id][opt.staffRole]) reqs[ev.id][opt.staffRole] = { required: 0, filled: 0 }
            reqs[ev.id][opt.staffRole].required += 1
          }
        })
      }
      escalas
        .filter((e) => e.eventId === ev.id && e.status !== 'Recusado')
        .forEach((esc) => {
          if (esc.role) {
            if (!reqs[ev.id][esc.role]) reqs[ev.id][esc.role] = { required: 0, filled: 0 }
            reqs[ev.id][esc.role].filled += 1
          }
        })
    })
    return reqs
  }, [activeEvents, menuConfigs, escalas])

  const availableMembers = useMemo(() => {
    if (!selectedEvent) return []
    const ev = activeEvents.find((e) => e.id === selectedEvent)
    if (!ev) return []

    return team.filter((m) => {
      // Must not be already in this event
      const inThisEvent = escalas.some(
        (esc) =>
          esc.eventId === selectedEvent && esc.memberId === m.id && esc.status !== 'Recusado',
      )
      if (inThisEvent) return false

      // Must not be in another event at the exact same date and time
      const inConflictingEvent = escalas.some((esc) => {
        if (esc.memberId !== m.id || esc.status === 'Recusado' || esc.eventId === selectedEvent)
          return false
        const otherEv = activeEvents.find((e) => e.id === esc.eventId)
        return otherEv && otherEv.date === ev.date && otherEv.time === ev.time
      })
      if (inConflictingEvent) return false

      return true
    })
  }, [selectedEvent, activeEvents, team, escalas])

  const handleAssign = () => {
    if (!selectedEvent || !selectedMember || !selectedRole) return
    const newEscala = {
      id: Math.random().toString(),
      eventId: selectedEvent,
      memberId: selectedMember,
      role: selectedRole,
      status: 'Pendente' as const,
    }
    setEscalas((prev) => [...prev, newEscala])
    addLog(
      'Escala Atribuída',
      `Membro ${selectedMember} como ${selectedRole} no evento ${selectedEvent}`,
    )
    toast({ title: 'Escala enviada', description: 'Notificação enviada ao freelancer.' })
    setAssignOpen(false)
    setSelectedEvent('')
    setSelectedRole('')
    setSelectedMember('')
  }

  const handleStatus = (id: string, st: 'Confirmado' | 'Recusado' | 'Check-in') => {
    setEscalas((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          if (st === 'Check-in') return { ...e, checkIn: new Date().toLocaleTimeString() }
          return { ...e, status: st }
        }
        return e
      }),
    )
    toast({ title: 'Atualizado', description: `Status: ${st}` })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">
          {isFreelancer ? 'Minha Escala' : 'Escalas e Equipe'}
        </h1>
        {!isFreelancer && (
          <Button onClick={() => setAssignOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Escalar Equipe
          </Button>
        )}
      </div>

      {!isFreelancer &&
        activeEvents.map((event) => {
          const reqs = eventStaffRequirements[event.id] || {}
          const totalReq = Object.values(reqs).reduce((a, b) => a + b.required, 0)
          const totalFill = Object.values(reqs).reduce((a, b) => a + b.filled, 0)
          const isComplete = totalReq > 0 && totalFill >= totalReq

          return (
            <Card key={event.id} className={isComplete ? 'border-green-200' : 'border-orange-200'}>
              <CardHeader className="py-3 bg-muted/20 flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-lg">{event.clientName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('pt-BR')} - {event.time} | {event.hall}{' '}
                    | {event.guests} Convidados
                  </p>
                </div>
                <Badge
                  variant={isComplete ? 'default' : 'secondary'}
                  className={isComplete ? 'bg-green-600' : ''}
                >
                  Preenchimento: {totalFill} / {totalReq}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 flex gap-4 flex-wrap">
                {Object.entries(reqs).map(([role, stats]) => (
                  <div key={role} className="p-2 border rounded text-center min-w-[100px] bg-card">
                    <p className="font-semibold text-sm">{role}</p>
                    <p
                      className={`text-xl ${stats.filled >= stats.required ? 'text-green-600' : 'text-orange-500'}`}
                    >
                      {stats.filled}/{stats.required}
                    </p>
                  </div>
                ))}
                {Object.keys(reqs).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    O cardápio deste evento não possui configuração de equipe.
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}

      <Card>
        <CardHeader>
          <CardTitle>{isFreelancer ? 'Meus Eventos' : 'Membros Escalados'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {escalas
              .filter((e) => (isFreelancer ? e.memberId === currentUser?.id : true))
              .map((escala) => {
                const event = activeEvents.find((ev) => ev.id === escala.eventId)
                const member = team.find((m) => m.id === escala.memberId)
                if (!event) return null
                return (
                  <div
                    key={escala.id}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold">{event.clientName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date} às {event.time}
                      </p>
                      {!isFreelancer && (
                        <p className="text-xs text-primary font-medium mt-1">
                          {member?.name} • Função: {escala.role}
                        </p>
                      )}
                      {isFreelancer && (
                        <p className="text-xs text-primary font-medium mt-1">
                          Função: {escala.role}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={escala.status === 'Confirmado' ? 'default' : 'outline'}>
                        {escala.status}
                      </Badge>
                      {isFreelancer && escala.status === 'Pendente' && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleStatus(escala.id, 'Confirmado')}>
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatus(escala.id, 'Recusado')}
                          >
                            Recusar
                          </Button>
                        </div>
                      )}
                      {isFreelancer && escala.status === 'Confirmado' && !escala.checkIn && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatus(escala.id, 'Check-in')}
                        >
                          Fazer Check-in
                        </Button>
                      )}
                      {(escala.checkIn || !isFreelancer) && escala.checkIn && (
                        <span className="text-xs text-muted-foreground">
                          Check-in: {escala.checkIn}
                        </span>
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
              <Select
                value={selectedEvent}
                onValueChange={(v) => {
                  setSelectedEvent(v)
                  setSelectedRole('')
                  setSelectedMember('')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {activeEvents.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.clientName} - {e.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedEvent && (
              <div className="grid gap-2">
                <Label>Função</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(eventStaffRequirements[selectedEvent] || {}).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedRole && (
              <div className="grid gap-2">
                <Label>Freelancer Disponível</Label>
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o membro..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                    {availableMembers.length === 0 && (
                      <SelectItem value="none" disabled>
                        Nenhum disponível (Conflito)
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <Button
            onClick={handleAssign}
            className="w-full"
            disabled={!selectedEvent || !selectedRole || !selectedMember}
          >
            Enviar Convite
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
