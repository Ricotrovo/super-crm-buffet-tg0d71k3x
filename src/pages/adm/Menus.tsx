import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { MenuBaseStaff, MenuScalingRule, MenuOptionalItem } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Menus() {
  const { menuConfigs, setMenuConfigs, addLog } = useAppStore()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const defaultForm = {
    name: '',
    price50Guests: 0,
    extraGuestPre: 0,
    extraGuestDay: 0,
    baseStaff: [] as MenuBaseStaff[],
    scalingRules: [] as MenuScalingRule[],
    optionalItems: [] as MenuOptionalItem[],
  }

  const [formData, setFormData] = useState(defaultForm)

  const ROLES = [
    'Monitor',
    'Garçom',
    'Cozinha',
    'Decorador',
    'Segurança',
    'Recepcionista',
    'Animador',
    'Limpeza',
  ]

  const handleOpen = (menu?: (typeof menuConfigs)[0]) => {
    if (menu) {
      setEditingId(menu.id)
      setFormData({
        name: menu.name,
        price50Guests: menu.price50Guests,
        extraGuestPre: menu.extraGuestPre,
        extraGuestDay: menu.extraGuestDay,
        baseStaff: menu.baseStaff ? [...menu.baseStaff] : [],
        scalingRules: menu.scalingRules ? [...menu.scalingRules] : [],
        optionalItems: menu.optionalItems ? [...menu.optionalItems] : [],
      })
    } else {
      setEditingId(null)
      setFormData(defaultForm)
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.name)
      return toast({ title: 'Erro', description: 'Nome obrigatório', variant: 'destructive' })
    if (editingId) {
      setMenuConfigs((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...formData } : m)))
      addLog('Cardápio Atualizado', `Cardápio: ${formData.name}`)
      toast({ title: 'Sucesso', description: 'Cardápio atualizado.' })
    } else {
      const newMenu = { id: Math.random().toString(), ...formData }
      setMenuConfigs((prev) => [...prev, newMenu])
      addLog('Cardápio Criado', `Cardápio: ${formData.name}`)
      toast({ title: 'Sucesso', description: 'Cardápio criado.' })
    }
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    setMenuConfigs((prev) => prev.filter((m) => m.id !== id))
    toast({ title: 'Sucesso', description: 'Cardápio removido.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Cardápios</h1>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Cardápio
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Cardápio</TableHead>
                <TableHead>Valor Pacote (50 conv.)</TableHead>
                <TableHead>Convidado Extra (Pré)</TableHead>
                <TableHead>Convidado Extra (Dia)</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuConfigs.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell className="font-medium">{menu.name}</TableCell>
                  <TableCell>R$ {menu.price50Guests.toFixed(2)}</TableCell>
                  <TableCell>R$ {menu.extraGuestPre.toFixed(2)}</TableCell>
                  <TableCell>R$ {menu.extraGuestDay.toFixed(2)}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpen(menu)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(menu.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {menuConfigs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    Nenhum cardápio cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Cardápio' : 'Novo Cardápio'}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="geral" className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="geral" className="flex-1">
                Valores Básicos
              </TabsTrigger>
              <TabsTrigger value="equipe" className="flex-1">
                Equipe & Escala
              </TabsTrigger>
              <TabsTrigger value="opcionais" className="flex-1">
                Opcionais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Nome do Cardápio</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Pacote 50 Conv. (R$)</Label>
                  <Input
                    type="number"
                    value={formData.price50Guests}
                    onChange={(e) =>
                      setFormData({ ...formData, price50Guests: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Conv. Extra Pré-evento (R$)</Label>
                  <Input
                    type="number"
                    value={formData.extraGuestPre}
                    onChange={(e) =>
                      setFormData({ ...formData, extraGuestPre: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Conv. Extra no Dia do Evento (R$)</Label>
                <Input
                  type="number"
                  value={formData.extraGuestDay}
                  onChange={(e) =>
                    setFormData({ ...formData, extraGuestDay: Number(e.target.value) })
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="equipe" className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Equipe Base</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        baseStaff: [...formData.baseStaff, { role: '', quantity: 1 }],
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Função
                  </Button>
                </div>
                {formData.baseStaff.map((staff, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Select
                      value={staff.role}
                      onValueChange={(v) => {
                        const newStaff = [...formData.baseStaff]
                        newStaff[i].role = v
                        setFormData({ ...formData, baseStaff: newStaff })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Função" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      value={staff.quantity}
                      className="w-24"
                      onChange={(e) => {
                        const newStaff = [...formData.baseStaff]
                        newStaff[i].quantity = Number(e.target.value)
                        setFormData({ ...formData, baseStaff: newStaff })
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          baseStaff: formData.baseStaff.filter((_, idx) => idx !== i),
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Regras de Escalonamento</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        scalingRules: [
                          ...formData.scalingRules,
                          { guestThreshold: 60, role: '', extraQuantity: 1 },
                        ],
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Regra
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ex: Acima de 60 convidados, adicionar +1 Garçom.
                </p>
                {formData.scalingRules.map((rule, i) => (
                  <div key={i} className="flex gap-2 items-center flex-wrap">
                    <span className="text-sm">Acima de</span>
                    <Input
                      type="number"
                      min="1"
                      value={rule.guestThreshold}
                      className="w-20"
                      onChange={(e) => {
                        const newRules = [...formData.scalingRules]
                        newRules[i].guestThreshold = Number(e.target.value)
                        setFormData({ ...formData, scalingRules: newRules })
                      }}
                    />
                    <span className="text-sm">conv. add</span>
                    <Input
                      type="number"
                      min="1"
                      value={rule.extraQuantity}
                      className="w-20"
                      onChange={(e) => {
                        const newRules = [...formData.scalingRules]
                        newRules[i].extraQuantity = Number(e.target.value)
                        setFormData({ ...formData, scalingRules: newRules })
                      }}
                    />
                    <Select
                      value={rule.role}
                      onValueChange={(v) => {
                        const newRules = [...formData.scalingRules]
                        newRules[i].role = v
                        setFormData({ ...formData, scalingRules: newRules })
                      }}
                    >
                      <SelectTrigger className="flex-1 min-w-[120px]">
                        <SelectValue placeholder="Função" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          scalingRules: formData.scalingRules.filter((_, idx) => idx !== i),
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="opcionais" className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Itens Opcionais</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      optionalItems: [
                        ...formData.optionalItems,
                        {
                          id: Math.random().toString(),
                          name: '',
                          price: 0,
                          triggersExtraStaff: false,
                        },
                      ],
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Opcional
                </Button>
              </div>
              {formData.optionalItems.map((opt, i) => (
                <div key={i} className="p-4 border rounded-md space-y-3 bg-muted/20">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Label className="text-xs">Nome do Serviço</Label>
                      <Input
                        value={opt.name}
                        onChange={(e) => {
                          const newOpts = [...formData.optionalItems]
                          newOpts[i].name = e.target.value
                          setFormData({ ...formData, optionalItems: newOpts })
                        }}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Valor (R$)</Label>
                      <Input
                        type="number"
                        value={opt.price}
                        onChange={(e) => {
                          const newOpts = [...formData.optionalItems]
                          newOpts[i].price = Number(e.target.value)
                          setFormData({ ...formData, optionalItems: newOpts })
                        }}
                      />
                    </div>
                    <div className="pt-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            optionalItems: formData.optionalItems.filter((_, idx) => idx !== i),
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`trigger-${i}`}
                      checked={opt.triggersExtraStaff}
                      onCheckedChange={(checked) => {
                        const newOpts = [...formData.optionalItems]
                        newOpts[i].triggersExtraStaff = checked === true
                        if (!checked) newOpts[i].staffRole = undefined
                        setFormData({ ...formData, optionalItems: newOpts })
                      }}
                    />
                    <Label htmlFor={`trigger-${i}`} className="text-sm font-normal">
                      Requer +1 funcionário na escala?
                    </Label>
                  </div>
                  {opt.triggersExtraStaff && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">Qual função?</span>
                      <Select
                        value={opt.staffRole || ''}
                        onValueChange={(v) => {
                          const newOpts = [...formData.optionalItems]
                          newOpts[i].staffRole = v
                          setFormData({ ...formData, optionalItems: newOpts })
                        }}
                      >
                        <SelectTrigger className="w-48 h-8 text-sm">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
