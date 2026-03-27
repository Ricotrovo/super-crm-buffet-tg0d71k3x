import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, MessageCircle, Instagram, Facebook, Plus, BrainCircuit } from 'lucide-react'
import { LeadStage, Lead } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

const STAGES: LeadStage[] = ['Novo', 'Qualificado', 'Agendado', 'Contrato', 'Perdido']

export default function Leads() {
  const { leads, setLeads, addLog } = useAppStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [chatLead, setChatLead] = useState<Lead | null>(null)

  const moveLead = (lead: Lead, direction: 1 | -1) => {
    const currentIndex = STAGES.indexOf(lead.stage)
    const newStage = STAGES[currentIndex + direction]
    if (newStage) {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, stage: newStage, daysInStage: 0 } : l)),
      )
      addLog('Moveu Lead', `${lead.name} para ${newStage}`)
      if (newStage === 'Contrato') {
        toast({ title: 'Lead Convertido!', description: 'Redirecionando para gerar contrato...' })
        setTimeout(() => navigate('/contratos'), 1500)
      }
    }
  }

  const simulateAI = (lead: Lead) => {
    toast({ title: 'Analisando mensagens...', description: 'Extraindo intenção do cliente.' })
    setTimeout(() => {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id
            ? {
                ...l,
                aiSummary: 'Cliente quer festa para 80 pessoas em Dezembro. Orçamento: R$ 6000.',
              }
            : l,
        ),
      )
      toast({ title: 'Análise Concluída', description: 'Resumo de IA gerado com sucesso.' })
    }, 1500)
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Funil de Vendas</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Lead
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
                    onChat={() => setChatLead(lead)}
                    onAI={() => simulateAI(lead)}
                    isLast={stage === 'Contrato' || stage === 'Perdido'}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {chatLead && (
        <Dialog open={!!chatLead} onOpenChange={(open) => !open && setChatLead(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Chat Omnichannel - {chatLead.name}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] bg-muted/30 rounded-md p-4 mb-4">
              <div className="space-y-4">
                <div className="bg-background border rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Olá, gostaria de saber os valores para festa infantil.</p>
                  <span className="text-[10px] text-muted-foreground mt-1">10:42 AM</span>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 max-w-[80%] ml-auto">
                  <p className="text-sm">
                    Olá {chatLead.name}! Claro, para quantas pessoas seria e qual a data desejada?
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1 text-right block">
                    10:45 AM
                  </span>
                </div>
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input placeholder="Digite uma mensagem..." />
              <Button>Enviar</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function LeadCard({
  lead,
  onMove,
  onChat,
  onAI,
  isLast,
}: {
  lead: Lead
  onMove: (l: Lead, dir: 1 | -1) => void
  onChat: () => void
  onAI: () => void
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
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary group">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div
            className="font-medium text-sm flex items-center gap-2 cursor-pointer hover:underline"
            onClick={onChat}
          >
            {getIcon()}
            {lead.name}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-2">{lead.phone}</div>

        {lead.aiSummary ? (
          <div className="bg-primary/5 border border-primary/10 text-xs p-2 rounded mb-3 flex items-start gap-2">
            <BrainCircuit className="h-3 w-3 mt-0.5 text-primary shrink-0" />
            <span className="line-clamp-2" title={lead.aiSummary}>
              {lead.aiSummary}
            </span>
          </div>
        ) : (
          <div className="mb-3">
            <Button variant="outline" size="sm" className="h-6 text-[10px] w-full" onClick={onAI}>
              <BrainCircuit className="h-3 w-3 mr-1" />
              Qualificar com IA
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {lead.daysInStage} dias aqui
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isLast && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onMove(lead, 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
