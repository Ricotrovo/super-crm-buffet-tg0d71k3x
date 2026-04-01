import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const DEFAULT_TASKS = [
  'Verificar limpeza geral do salão e banheiros',
  'Ligar e testar ar-condicionado',
  'Testar som, iluminação e TV/Projetor',
  'Receber e conferir bolo e doces terceirizados',
  'Conferir estoque de bebidas nos freezers',
  'Verificar uniformes e crachás da equipe',
  'Revisar cronograma da festa com o gerente',
  'Preparar mesa principal e decoração',
]

export default function Checklist() {
  const { events, eventChecklists, setEventChecklists } = useAppStore()
  const [selectedEventId, setSelectedEventId] = useState<string>('')

  const activeEvents = events.filter((e) => e.status === 'Confirmado' || e.status === 'Concluído')

  // Get or initialize checklist
  const getChecklist = () => {
    if (!selectedEventId) return []
    const existing = eventChecklists.find((c) => c.eventId === selectedEventId)
    if (existing) return existing.items

    // Auto-create defaults if none exist
    const newItems = DEFAULT_TASKS.map((task, i) => ({ id: `new_${i}`, task, isChecked: false }))
    return newItems
  }

  const checklistItems = getChecklist()

  const handleToggle = (itemId: string, checked: boolean) => {
    setEventChecklists((prev) => {
      const exists = prev.find((c) => c.eventId === selectedEventId)
      if (exists) {
        return prev.map((c) =>
          c.eventId === selectedEventId
            ? {
                ...c,
                items: c.items.map((i) => (i.id === itemId ? { ...i, isChecked: checked } : i)),
              }
            : c,
        )
      } else {
        const newChecklist = {
          eventId: selectedEventId,
          items: checklistItems.map((i) => (i.id === itemId ? { ...i, isChecked: checked } : i)),
        }
        return [...prev, newChecklist]
      }
    })
  }

  const completedCount = checklistItems.filter((i) => i.isChecked).length
  const totalCount = checklistItems.length
  const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-secondary mb-2">Checklist Pré-evento</h1>
        <p className="text-muted-foreground">
          Validação de requisitos e tarefas antes do início do evento.
        </p>
      </div>

      <Card>
        <CardHeader className="bg-muted/30">
          <div className="grid gap-2">
            <Label>Selecione o Evento</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Escolha um evento confirmado..." />
              </SelectTrigger>
              <SelectContent>
                {activeEvents.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {new Date(e.date).toLocaleDateString('pt-BR')} - {e.clientName} ({e.time})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {selectedEventId && (
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Progresso da Preparação</h3>
              <Badge
                variant={progress === 100 ? 'default' : 'secondary'}
                className={progress === 100 ? 'bg-green-600' : ''}
              >
                {completedCount} de {totalCount} concluídos
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />

            <div className="space-y-4 mt-8">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={item.id}
                    checked={item.isChecked}
                    onCheckedChange={(checked) => handleToggle(item.id, checked as boolean)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={item.id}
                      className={`text-base font-medium leading-none cursor-pointer ${item.isChecked ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.task}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {progress === 100 && (
              <div className="p-4 mt-6 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-800 font-semibold">Tudo pronto! O evento pode começar.</p>
              </div>
            )}
          </CardContent>
        )}

        {!selectedEventId && (
          <CardContent className="py-12 text-center text-muted-foreground">
            Selecione um evento acima para carregar o checklist.
          </CardContent>
        )}
      </Card>
    </div>
  )
}
