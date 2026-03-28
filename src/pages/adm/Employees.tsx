import { useState } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
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
import { Employee, Role } from '@/lib/types'
import { mockEmployees } from '@/stores/mockData'
import { useToast } from '@/components/ui/use-toast'

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Employee>>({})

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()),
  )

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee)
      setFormData(employee)
    } else {
      setEditingEmployee(null)
      setFormData({ accessLevel: 'Gerente' })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.role) {
      toast({
        title: 'Erro',
        description: 'Preencha os campos obrigatórios (Nome e Cargo).',
        variant: 'destructive',
      })
      return
    }

    if (editingEmployee) {
      setEmployees(
        employees.map((e) =>
          e.id === editingEmployee.id ? ({ ...e, ...formData } as Employee) : e,
        ),
      )
      toast({ title: 'Sucesso', description: 'Funcionário atualizado.' })
    } else {
      const newEmployee: Employee = {
        id: Math.random().toString(),
        name: formData.name || '',
        registrationId: formData.registrationId || '',
        documents: formData.documents || '',
        address: formData.address || '',
        role: formData.role || '',
        baseSalary: Number(formData.baseSalary) || 0,
        accessLevel: (formData.accessLevel as Role) || 'Gerente',
      }
      setEmployees([...employees, newEmployee])
      toast({ title: 'Sucesso', description: 'Funcionário cadastrado.' })
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id))
    toast({ title: 'Sucesso', description: 'Funcionário removido.' })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie a equipe interna e seus acessos ao sistema.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cargo..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Salário Base</TableHead>
              <TableHead>Acesso</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.registrationId || '-'}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    employee.baseSalary,
                  )}
                </TableCell>
                <TableCell>{employee.accessLevel}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(employee)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum funcionário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome Completo *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Matrícula</Label>
              <Input
                value={formData.registrationId || ''}
                onChange={(e) => setFormData({ ...formData, registrationId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Documentos (CPF/RG)</Label>
              <Input
                value={formData.documents || ''}
                onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo/Função *</Label>
              <Select
                value={formData.role || ''}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gerente Geral">Gerente Geral</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Garçom">Garçom</SelectItem>
                  <SelectItem value="Cozinha">Cozinha</SelectItem>
                  <SelectItem value="Decorador">Decorador</SelectItem>
                  <SelectItem value="Segurança">Segurança</SelectItem>
                  <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Endereço Completo</Label>
              <Input
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, Número, Bairro, Cidade, CEP"
              />
            </div>
            <div className="space-y-2">
              <Label>Salário Base (R$)</Label>
              <Input
                type="number"
                value={formData.baseSalary || ''}
                onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissão de Acesso</Label>
              <Select
                value={formData.accessLevel}
                onValueChange={(val) => setFormData({ ...formData, accessLevel: val as Role })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Freelancer">Freelancer</SelectItem>
                </SelectContent>
              </Select>
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
