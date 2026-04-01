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

export default function Menus() {
  const { menuConfigs, setMenuConfigs, addLog } = useAppStore()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price50Guests: 0,
    extraGuestPre: 0,
    extraGuestDay: 0,
  })

  const handleOpen = (menu?: (typeof menuConfigs)[0]) => {
    if (menu) {
      setEditingId(menu.id)
      setFormData({
        name: menu.name,
        price50Guests: menu.price50Guests,
        extraGuestPre: menu.extraGuestPre,
        extraGuestDay: menu.extraGuestDay,
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', price50Guests: 0, extraGuestPre: 0, extraGuestDay: 0 })
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Cardápio' : 'Novo Cardápio'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
          </div>
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
