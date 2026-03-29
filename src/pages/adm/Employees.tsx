import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, MapPin } from 'lucide-react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { maskCPF, maskCEP, isValidCPF } from '@/lib/utils'

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)

  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Employee>>({})

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      (e.cpf && e.cpf.includes(search)),
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

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = maskCEP(e.target.value)
    setFormData((prev) => ({ ...prev, cep }))

    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await response.json()
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          }))
          toast({
            title: 'Endereço localizado',
            description: 'Os campos foram preenchidos automaticamente.',
          })
        } else {
          toast({ title: 'CEP não encontrado', variant: 'destructive' })
        }
      } catch (error) {
        toast({ title: 'Erro ao buscar CEP', variant: 'destructive' })
      }
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.cpf) {
      toast({
        title: 'Erro de Validação',
        description: 'Preencha os campos obrigatórios (Nome, CPF e Cargo).',
        variant: 'destructive',
      })
      return
    }

    if (!isValidCPF(formData.cpf)) {
      toast({
        title: 'CPF Inválido',
        description: 'O CPF informado não é válido.',
        variant: 'destructive',
      })
      return
    }

    const addressStr = formData.street
      ? `${formData.street}, ${formData.number || 'S/N'} - ${formData.neighborhood}, ${formData.city}/${formData.state} - CEP: ${formData.cep}`
      : formData.address || ''

    const completeData = {
      ...formData,
      address: addressStr,
    }

    if (editingEmployee) {
      setEmployees(
        employees.map((e) =>
          e.id === editingEmployee.id ? ({ ...e, ...completeData } as Employee) : e,
        ),
      )
      toast({ title: 'Sucesso', description: 'Funcionário atualizado com sucesso.' })
    } else {
      const newEmployee: Employee = {
        ...(completeData as any),
        id: Math.random().toString(),
        name: formData.name || '',
        registrationId: formData.registrationId || `EMP${Math.floor(Math.random() * 1000)}`,
        documents: formData.documents || '',
        role: formData.role || '',
        baseSalary: Number(formData.baseSalary) || 0,
        accessLevel: (formData.accessLevel as Role) || 'Gerente',
      }
      setEmployees([...employees, newEmployee])
      toast({ title: 'Sucesso', description: 'Funcionário cadastrado com sucesso.' })
    }
    setIsDialogOpen(false)
  }

  const confirmDelete = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter((e) => e.id !== employeeToDelete.id))
      toast({ title: 'Excluído', description: 'Funcionário removido com sucesso.' })
      setEmployeeToDelete(null)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie a equipe interna e permissões de acesso ao sistema.
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
            placeholder="Buscar por nome, cargo ou CPF..."
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
              <TableHead>CPF</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Salário Base</TableHead>
              <TableHead>Acesso</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.cpf || '-'}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    employee.baseSalary,
                  )}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                    {employee.accessLevel}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(employee)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEmployeeToDelete(employee)}
                    >
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 sm:col-span-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Dados Pessoais
              </h3>
            </div>
            <div className="space-y-2">
              <Label>Nome Completo *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="space-y-2">
              <Label>CPF *</Label>
              <Input
                value={formData.cpf || ''}
                onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div className="space-y-2 sm:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Endereço
              </h3>
            </div>
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input
                value={formData.cep || ''}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength={9}
              />
            </div>
            <div className="space-y-2">
              <Label>Logradouro</Label>
              <Input
                value={formData.street || ''}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                value={formData.number || ''}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input
                value={formData.complement || ''}
                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                value={formData.neighborhood || ''}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>UF</Label>
                <Input
                  value={formData.state || ''}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  maxLength={2}
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Dados Funcionais
              </h3>
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
                  <SelectItem value="Coordenador">Coordenador</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                  <SelectItem value="Vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Salário Base (R$)</Label>
              <Input
                type="number"
                step="0.01"
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
                  <SelectItem value="Admin">Administrador (Acesso Total)</SelectItem>
                  <SelectItem value="Gerente">Gerente (Acesso Limitado)</SelectItem>
                  <SelectItem value="Freelancer">Freelancer (Sem Acesso ADM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Funcionário</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!employeeToDelete}
        onOpenChange={(open) => !open && setEmployeeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário{' '}
              <span className="font-semibold">{employeeToDelete?.name}</span> do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
