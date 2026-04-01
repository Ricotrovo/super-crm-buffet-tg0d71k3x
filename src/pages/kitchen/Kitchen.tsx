import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, ChefHat } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Kitchen() {
  const { events, kitchenTasks, setKitchenTasks } = useAppStore()
  const { toast } = useToast()

  const activeEvents = events.filter((e) => e.status === 'Confirmado')

  const handleCheckout = (taskId: string) => {
    setKitchenTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'Concluído' } : t)),
    )
    toast({ title: 'Item Baixado', description: 'Item marcado como concluído com sucesso.' })
  }

  const handleRevert = (taskId: string) => {
    setKitchenTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: 'Pendente' } : t)))
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 border-b pb-4">
        <ChefHat className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-secondary">Painel da Cozinha</h1>
          <p className="text-muted-foreground">Controle de Produção e Saídas para Eventos</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {activeEvents.map((event) => {
          const tasks = kitchenTasks.filter((t) => t.eventId === event.id)
          if (tasks.length === 0) return null

          const progress =
            (tasks.filter((t) => t.status === 'Concluído').length / tasks.length) * 100

          return (
            <Card key={event.id} className="border-t-4 border-t-primary shadow-md">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{event.clientName}</CardTitle>
                    <p className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />{' '}
                      {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {event.guests} Convidados
                  </Badge>
                </div>
                <div className="w-full bg-secondary/20 h-2 mt-4 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${task.status === 'Concluído' ? 'bg-green-50/50 border-green-200' : 'bg-card'}`}
                    >
                      <div>
                        <p
                          className={`font-semibold text-lg ${task.status === 'Concluído' ? 'text-green-800 line-through opacity-70' : 'text-card-foreground'}`}
                        >
                          {task.itemName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: <strong>{task.quantity}</strong>
                        </p>
                      </div>

                      {task.status === 'Pendente' ? (
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                          onClick={() => handleCheckout(task.id)}
                        >
                          Dar Baixa
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-700 hover:text-green-800 hover:bg-green-100"
                          onClick={() => handleRevert(task.id)}
                        >
                          <CheckCircle2 className="w-6 h-6 mr-1" /> Concluído
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}

        {activeEvents.filter((e) => kitchenTasks.some((t) => t.eventId === e.id)).length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20">
            <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Nenhuma tarefa de produção para os eventos confirmados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
