import { useAppStore } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, MessageCircle, Instagram, Facebook, Plus } from 'lucide-react'
import { LeadStage, Lead } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

const STAGES: LeadStage[] = ['Novo', 'Contatado', 'Visita', 'Proposta', 'Ganho']

export default function Leads() {
  const { leads, setLeads, addLog } = useAppStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  const moveLead = (lead: Lead, direction: 1 | -1) => {
    const currentIndex = STAGES.indexOf(lead.stage)
    const newStage = STAGES[currentIndex + direction]
    if (newStage) {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, stage: newStage, daysInStage: 0 } : l)),
      )
      addLog('Moveu Lead', `${lead.name} para ${newStage}`)
      if (newStage === 'Ganho') {
        toast({ title: 'Lead Ganho!', description: 'Redirecionando para gerar contrato...' })
        setTimeout(() => navigate('/contratos'), 1500)
      }
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Funil de Leads</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Lead
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start">
        {STAGES.map((stage) => (
          <div
            key={stage}
            className="min-w-[280px] w-full max-w-xs flex flex-col gap-3 bg-muted/50 p-3 rounded-xl border border-border/50"
          >
            <div className="flex justify-between items-center px-1">
              <h3 className="font-semibold text-sm">{stage}</h3>
              <Badge variant="secondary">{leads.filter((l) => l.stage === stage).length}</Badge>
            </div>
            <div className="flex flex-col gap-2">
              {leads
                .filter((l) => l.stage === stage)
                .map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onMove={moveLead}
                    isLast={stage === 'Ganho'}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LeadCard({
  lead,
  onMove,
  isLast,
}: {
  lead: Lead
  onMove: (l: Lead, dir: 1 | -1) => void
  isLast: boolean
}) {
  const getIcon = () => {
    switch (lead.source) {
      case 'WhatsApp':
        return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'Instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />
      case 'Facebook':
        return <Facebook className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-l-4 border-l-primary">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="font-medium text-sm flex items-center gap-2">
            {getIcon()}
            {lead.name}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-3">{lead.phone}</div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {lead.daysInStage} dias nesta etapa
          </span>
          {!isLast && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMove(lead, 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
