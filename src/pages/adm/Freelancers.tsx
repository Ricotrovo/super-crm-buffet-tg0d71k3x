import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Freelancer, FreelancerRole } from '@/lib/types'
import { mockFreelancers } from '@/stores/mockData'
import { useToast } from '@/components/ui/use-toast'

export default function Freelancers() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>(mockFreelancers)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFreelancer, setEditingFreelancer] = useState<Freelancer | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Freelancer>>({ roles: [] })

  const filteredFreelancers = freelancers.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.roles.some((r) => r.role.toLowerCase().includes(search.toLowerCase())),
  )

  const handleOpenDialog = (freelancer?: Freelancer) => {
    if (freelancer) {
      setEditingFreelancer(freelancer)
      // Deep copy roles array
      setFormData({ ...freelancer, roles: freelancer.roles.map((r) => ({ ...r })) })
    } else {
      setEditingFreelancer(null)
      setFormData({ roles: [] })
    }
    setIsDialogOpen(true)
  }

  const addRole = () => {
    setFormData({
      ...formData,
      roles: [...(formData.roles || []), { role: '', payRate: 0 }],
    })
  }

  const removeRole = (index: number) => {
    const newRoles = [...(formData.roles || [])]
    newRoles.splice(index, 1)
    setFormData({ ...formData, roles: newRoles })
  }

  const updateRole = (index: number, field: keyof FreelancerRole, value: string | number) => {
    const newRoles = [...(formData.roles || [])]
    newRoles[index] = { ...newRoles[index], [field]: value }
    setFormData({ ...formData, roles: newRoles })
  }

  const handleSave = () => {
    if (!formData.name) {
      toast({
        title: 'Erro',
        description: 'Preencha o nome do freelancer.',
        variant: 'destructive',
      })
      return
    }

    if (formData.roles?.some((r) => !r.role)) {
      toast({
        title: 'Erro',
        description: 'Selecione uma função para todas as linhas adicionadas.',
        variant: 'destructive',
      })
      return
    }

    if (editingFreelancer) {
      setFreelancers(
        freelancers.map((f) =>
          f.id === editingFreelancer.id ? ({ ...f, ...formData } as Freelancer) : f,
        ),
      )
      toast({ title: 'Sucesso', description: 'Freelancer atualizado.' })
    } else {
      const newFreelancer: Freelancer = {
        id: Math.random().toString(),
        name: formData.name || '',
        contactInfo: formData.contactInfo || '',
        roles: formData.roles || [],
      }
      setFreelancers([...freelancers, newFreelancer])
      toast({ title: 'Sucesso', description: 'Freelancer cadastrado.' })
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setFreelancers(freelancers.filter((f) => f.id !== id))
    toast({ title: 'Sucesso', description: 'Freelancer removido.' })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Freelancers</h1>
          <p className="text-muted-foreground">
            Gerencie o banco de talentos externos e múltiplos cachês.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Freelancer
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou função..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Funções e Cachês</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFreelancers.map((freelancer) => (
              <TableRow key={freelancer.id}>
                <TableCell className="font-medium">{freelancer.name}</TableCell>
                <TableCell>{freelancer.contactInfo || '-'}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.roles.map((r, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {r.role}: R$ {r.payRate}
                      </span>
                    ))}
                    {freelancer.roles.length === 0 && (
                      <span className="text-muted-foreground text-xs">Sem funções</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(freelancer)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(freelancer.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredFreelancers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Nenhum freelancer encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFreelancer ? 'Editar Freelancer' : 'Novo Freelancer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Contato (Telefone/Email)</Label>
                <Input
                  value={formData.contactInfo || ''}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Funções e Cachês Associados</Label>
                <Button variant="outline" size="sm" onClick={addRole}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Função
                </Button>
              </div>

              {formData.roles?.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Nenhuma função adicionada a este freelancer.
                </p>
              )}

              {formData.roles?.map((role, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-2 items-end bg-muted/50 p-3 rounded-lg"
                >
                  <div className="flex-1 space-y-1 w-full">
                    <Label className="text-xs">Função</Label>
                    <Select
                      value={role.role || ''}
                      onValueChange={(val) => updateRole(index, 'role', val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monitor">Monitor</SelectItem>
                        <SelectItem value="Garçom">Garçom</SelectItem>
                        <SelectItem value="Cozinha">Cozinha</SelectItem>
                        <SelectItem value="Decorador">Decorador</SelectItem>
                        <SelectItem value="Segurança">Segurança</SelectItem>
                        <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                        <SelectItem value="Animador">Animador</SelectItem>
                        <SelectItem value="Limpeza">Limpeza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-32 space-y-1">
                    <Label className="text-xs">Cachê (R$)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={role.payRate || ''}
                      onChange={(e) => updateRole(index, 'payRate', Number(e.target.value))}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRole(index)}
                    className="shrink-0 mb-0.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
