import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function Team() {
  const { team, events, currentUser } = useAppStore()
  const { toast } = useToast()

  const isFreelancer = currentUser.role === 'Freelancer'

  const handleConfirm = () => {
    toast({ title: 'Presença Confirmada', description: 'Você confirmou presença no evento.' })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary">
        {isFreelancer ? 'Minha Escala' : 'Equipe e Escalas'}
      </h1>

      {!isFreelancer && (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {team.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-lg font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.role} • {member.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos Escala</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events
              .filter((e) => e.status === 'Confirmado')
              .map((event) => (
                <div
                  key={event.id}
                  className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg">{event.clientName}</h3>
                    <p className="text-muted-foreground">
                      {event.date} às {event.time} - {event.hall}
                    </p>
                  </div>
                  {isFreelancer ? (
                    <Button onClick={handleConfirm}>Confirmar Presença</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="border-amber-200 text-amber-700 bg-amber-50"
                      >
                        2 pendentes
                      </Badge>
                      <Button variant="secondary" size="sm">
                        Gerenciar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
