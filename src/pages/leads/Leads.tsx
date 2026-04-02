import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChevronRight,
  MessageCircle,
  Instagram,
  Facebook,
  Plus,
  BrainCircuit,
  Flame,
  Calendar,
  Users,
  HelpCircle,
} from 'lucide-react'
import { LeadStage, Lead } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LeadFormDialog } from './LeadFormDialog'
import { cn } from '@/lib/utils'

const STAGES: LeadStage[] = ['Novo', 'Qualificado', 'Agendado', 'Contrato', 'Perdido']

export default function Leads() {
  const { leads, setLeads, addLog } = useAppStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [chatLead, setChatLead] = useState<Lead | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [scoreFilter, setScoreFilter] = useState<string>('all')

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
                score: 9,
              }
            : l,
        ),
      )
      toast({ title: 'Análise Concluída', description: 'Resumo de IA gerado com sucesso.' })
    }, 1500)
  }

  const handleSaveLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substring(7),
      name: leadData.name || 'Sem Nome',
      source: (leadData.source as any) || 'WhatsApp',
      phone: leadData.mobilePhone || leadData.phone || '',
      stage: 'Novo',
      daysInStage: 0,
      createdAt: new Date().toISOString(),
    } as Lead

    setLeads((prev) => [...prev, newLead])
    addLog('Lead Criado', `Novo lead ${newLead.name} adicionado`)
    toast({ title: 'Sucesso', description: 'Lead cadastrado com sucesso!' })
  }

  const filteredLeads = leads.filter((l) => {
    if (scoreFilter === 'all') return true
    const score = l.score || 5
    if (scoreFilter === 'hot') return score >= 9
    if (scoreFilter === 'warm') return score >= 7 && score <= 8
    if (scoreFilter === 'cold') return score <= 6
    return true
  })

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-secondary">Funil de Vendas</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filtrar Temperatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Leads</SelectItem>
              <SelectItem value="hot">🔥 Quentes (9-10)</SelectItem>
              <SelectItem value="warm">⭐ Mornos (7-8)</SelectItem>
              <SelectItem value="cold">❄️ Frios (5-6)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Lead
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start">
        {STAGES.map((stage) => (
          <div
            key={stage}
            className="min-w-[280px] w-full max-w-xs flex flex-col gap-3 bg-muted/50 p-3 rounded-xl border border-border/50"
          >
            <div className="flex justify-between items-center px-1">
              <h3 className="font-semibold text-sm">{stage}</h3>
              <Badge variant="secondary">
                {filteredLeads.filter((l) => l.stage === stage).length}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              {filteredLeads
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

      <LeadFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} onSave={handleSaveLead} />

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
  const isHot = lead.score && lead.score >= 9

  const getIcon = () => {
    switch (lead.source) {
      case 'WhatsApp':
        return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'Instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />
      case 'Facebook':
        return <Facebook className="h-4 w-4 text-blue-500" />
      default:
        return <HelpCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card
      className={cn(
        'hover:shadow-md transition-all border-l-4 group relative overflow-hidden',
        isHot ? 'border-l-red-500 bg-red-500/5 hover:bg-red-500/10' : 'border-l-primary',
      )}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div
            className="font-medium text-sm flex items-center gap-2 cursor-pointer hover:underline"
            onClick={onChat}
          >
            {getIcon()}
            {lead.name}
          </div>
          {isHot && (
            <Badge
              variant="destructive"
              className="h-5 px-1.5 text-[10px] gap-1 bg-red-500 hover:bg-red-600 border-none shrink-0"
            >
              <Flame className="w-3 h-3" /> Quente
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-muted-foreground">{lead.mobilePhone || lead.phone}</div>
          {lead.score !== undefined && !isHot && (
            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              Score: {lead.score}
            </span>
          )}
        </div>

        {(lead.eventDate || lead.guestCount) && (
          <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground mb-3 bg-background/50 p-1.5 rounded border border-border/50">
            {lead.eventDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(lead.eventDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              </span>
            )}
            {lead.guestCount !== undefined && lead.guestCount > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {lead.guestCount} conv.
              </span>
            )}
          </div>
        )}

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
          <span className="text-[10px] text-muted-foreground bg-background px-2 py-1 rounded-full border">
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
