import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash2 } from 'lucide-react'
import { Lead, LeadChild } from '@/lib/types'
import { differenceInYears, isValid } from 'date-fns'

interface LeadFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (lead: Partial<Lead>) => void
}

export function LeadFormDialog({ open, onOpenChange, onSave }: LeadFormDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    mobilePhone: '',
    businessPhone: '',
    email: '',
    instagramProfile: '',
    source: 'WhatsApp',
    children: [],
    eventDate: '',
    guestCount: 0,
    selectedMenu: '',
    hasVisited: false,
    hasTasted: false,
    visitDate: '',
    observations: '',
    score: 5,
  })

  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        mobilePhone: '',
        businessPhone: '',
        email: '',
        instagramProfile: '',
        source: 'WhatsApp',
        children: [],
        eventDate: '',
        guestCount: 0,
        selectedMenu: '',
        hasVisited: false,
        hasTasted: false,
        visitDate: '',
        observations: '',
        score: 5,
      })
      setErrors({})
    }
  }, [open])

  const maskPhone = (val: string) => {
    let v = val.replace(/\D/g, '')
    if (v.length <= 2) return v.length > 0 ? `(${v}` : v
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`
    if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`
  }

  const handleChange = (field: keyof Lead, value: any) => {
    let finalValue = value
    if (field === 'mobilePhone' || field === 'businessPhone') {
      finalValue = maskPhone(value)
    }
    setFormData((prev) => ({ ...prev, [field]: finalValue }))
  }

  const addChild = () => {
    const newChild: LeadChild = { id: Date.now().toString(), name: '', birthDate: '' }
    handleChange('children', [...(formData.children || []), newChild])
  }

  const updateChild = (id: string, field: keyof LeadChild, value: string) => {
    const updatedChildren = formData.children?.map((c) =>
      c.id === id ? { ...c, [field]: value } : c,
    )
    handleChange('children', updatedChildren)
  }

  const removeChild = (id: string) => {
    handleChange(
      'children',
      formData.children?.filter((c) => c.id !== id),
    )
  }

  const calculateAge = (birthDate: string, eventDate?: string) => {
    if (!birthDate) return ''
    try {
      const birth = new Date(`${birthDate}T12:00:00`)
      if (!isValid(birth)) return ''
      const targetDate = eventDate ? new Date(`${eventDate}T12:00:00`) : new Date()
      if (!isValid(targetDate)) return ''
      const age = differenceInYears(targetDate, birth)
      return age >= 0 ? `${age} anos` : 'A nascer'
    } catch {
      return ''
    }
  }

  const [errors, setErrors] = useState<{ name?: boolean; mobilePhone?: boolean }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      name: !formData.name?.trim(),
      mobilePhone:
        !formData.mobilePhone?.trim() || formData.mobilePhone.replace(/\D/g, '').length < 10,
    }

    setErrors(newErrors)

    try {
      if (newErrors.name || newErrors.mobilePhone) {
        toast({
          title: 'Campos Obrigatórios',
          description: 'Por favor, preencha corretamente o Nome e Celular (mínimo 10 dígitos).',
          variant: 'destructive',
        })
        return
      }

      onSave(formData)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro Interno',
        description: 'Não foi possível validar os dados do formulário.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 py-4">
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-8 pb-4">
            <section className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Informações de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={errors.name ? 'text-destructive' : ''}>Nome do Lead *</Label>
                  <Input
                    required
                    className={
                      errors.name ? 'border-destructive focus-visible:ring-destructive' : ''
                    }
                    value={formData.name || ''}
                    onChange={(e) => {
                      handleChange('name', e.target.value)
                      if (errors.name) setErrors((p) => ({ ...p, name: false }))
                    }}
                    placeholder="Ex: Maria Silva"
                  />
                  {errors.name && <p className="text-xs text-destructive">Nome é obrigatório.</p>}
                </div>
                <div className="space-y-2">
                  <Label>Origem</Label>
                  <Select
                    value={formData.source || 'WhatsApp'}
                    onValueChange={(v) => handleChange('source', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={errors.mobilePhone ? 'text-destructive' : ''}>Celular *</Label>
                  <Input
                    required
                    className={
                      errors.mobilePhone ? 'border-destructive focus-visible:ring-destructive' : ''
                    }
                    value={formData.mobilePhone || ''}
                    onChange={(e) => {
                      handleChange('mobilePhone', e.target.value)
                      if (errors.mobilePhone) setErrors((p) => ({ ...p, mobilePhone: false }))
                    }}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                  {errors.mobilePhone && (
                    <p className="text-xs text-destructive">Celular inválido.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Telefone Comercial</Label>
                  <Input
                    value={formData.businessPhone || ''}
                    onChange={(e) => handleChange('businessPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Perfil do Instagram</Label>
                  <Input
                    value={formData.instagramProfile || ''}
                    onChange={(e) => handleChange('instagramProfile', e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-semibold">Aniversariantes (Filhos)</h3>
                <Button type="button" variant="outline" size="sm" onClick={addChild}>
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Criança
                </Button>
              </div>
              <div className="space-y-4">
                {formData.children?.map((child) => (
                  <div
                    key={child.id}
                    className="flex flex-wrap sm:flex-nowrap gap-4 items-end bg-muted/50 p-3 rounded-lg border"
                  >
                    <div className="w-full sm:flex-1 space-y-2">
                      <Label>Nome da Criança</Label>
                      <Input
                        value={child.name || ''}
                        onChange={(e) => updateChild(child.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="w-full sm:flex-1 space-y-2">
                      <Label>Nascimento</Label>
                      <Input
                        type="date"
                        value={child.birthDate || ''}
                        onChange={(e) => updateChild(child.id, 'birthDate', e.target.value)}
                      />
                    </div>
                    <div className="w-full sm:w-24 space-y-2">
                      <Label>Idade (na data do evento)</Label>
                      <Input
                        readOnly
                        disabled
                        value={calculateAge(child.birthDate, formData.eventDate)}
                        className="bg-muted"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive mt-2 sm:mt-0"
                      onClick={() => removeChild(child.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {formData.children?.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma criança adicionada.</p>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Detalhes do Evento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Data da Festa</Label>
                  <Input
                    type="date"
                    value={formData.eventDate || ''}
                    onChange={(e) => handleChange('eventDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Convidados</Label>
                  <Input
                    type="number"
                    min="0"
                    value={
                      formData.guestCount === undefined || Number.isNaN(formData.guestCount)
                        ? ''
                        : formData.guestCount
                    }
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      handleChange('guestCount', isNaN(val) ? 0 : val)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cardápio Escolhido</Label>
                  <Input
                    value={formData.selectedMenu || ''}
                    onChange={(e) => handleChange('selectedMenu', e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Qualificação e Visita</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <Label className="cursor-pointer">Visitou ou já conhece o salão?</Label>
                    <Switch
                      checked={formData.hasVisited}
                      onCheckedChange={(c) => handleChange('hasVisited', c)}
                    />
                  </div>
                  <div className="flex items-center justify-between border p-3 rounded-lg">
                    <Label className="cursor-pointer">Já fez a degustação?</Label>
                    <Switch
                      checked={formData.hasTasted}
                      onCheckedChange={(c) => handleChange('hasTasted', c)}
                    />
                  </div>
                  {formData.hasVisited && (
                    <div className="space-y-2">
                      <Label>Data da Visita</Label>
                      <Input
                        type="date"
                        value={formData.visitDate || ''}
                        onChange={(e) => handleChange('visitDate', e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-6 bg-muted/30 p-4 rounded-xl border">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base">Temperatura do Lead</Label>
                      <span className="text-2xl font-bold text-primary">{formData.score}</span>
                    </div>
                    <Slider
                      min={5}
                      max={10}
                      step={1}
                      value={[formData.score || 5]}
                      onValueChange={(v) => handleChange('score', v[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                      <span>❄️ Frio (5)</span>
                      <span>🔥 Quente (10)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label>Observações e Negociação</Label>
                <Textarea
                  className="min-h-[100px] resize-y"
                  placeholder="Detalhes da negociação, relatórios da visita, objeções do cliente..."
                  value={formData.observations || ''}
                  onChange={(e) => handleChange('observations', e.target.value)}
                />
              </div>
            </section>
          </form>
        </ScrollArea>
        <div className="px-6 py-4 border-t bg-muted/20 flex justify-end gap-2 shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="lead-form">
            Salvar Lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
