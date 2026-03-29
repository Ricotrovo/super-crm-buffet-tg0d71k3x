import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, MapPin } from 'lucide-react'
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
import { Freelancer, FreelancerRole } from '@/lib/types'
import { mockFreelancers } from '@/stores/mockData'
import { useToast } from '@/components/ui/use-toast'
import { maskCPF, maskCEP, maskPhone, isValidCPF } from '@/lib/utils'

export default function Freelancers() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>(mockFreelancers)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFreelancer, setEditingFreelancer] = useState<Freelancer | null>(null)
  const [freelancerToDelete, setFreelancerToDelete] = useState<Freelancer | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Freelancer>>({ roles: [] })

  const filteredFreelancers = freelancers.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.cpf && f.cpf.includes(search)) ||
      f.roles.some((r) => r.role.toLowerCase().includes(search.toLowerCase())),
  )

  const handleOpenDialog = (freelancer?: Freelancer) => {
    if (freelancer) {
      setEditingFreelancer(freelancer)
      setFormData({ ...freelancer, roles: freelancer.roles.map((r) => ({ ...r })) })
    } else {
      setEditingFreelancer(null)
      setFormData({ roles: [] })
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
        }
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível buscar o CEP.',
          variant: 'destructive',
        })
      }
    }
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
        title: 'Erro de Validação',
        description: 'O nome do freelancer é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    if (formData.cpf && !isValidCPF(formData.cpf)) {
      toast({
        title: 'CPF Inválido',
        description: 'Verifique o CPF informado.',
        variant: 'destructive',
      })
      return
    }

    if (formData.roles?.some((r) => !r.role || r.payRate <= 0)) {
      toast({
        title: 'Atenção às Funções',
        description: 'Selecione a função e informe um cachê maior que zero para todas as linhas.',
        variant: 'destructive',
      })
      return
    }

    const addressStr = formData.street
      ? `${formData.street}, ${formData.number || 'S/N'} - ${formData.neighborhood}, ${formData.city}/${formData.state}`
      : formData.address || ''

    const completeData = {
      ...formData,
      address: addressStr,
    }

    if (editingFreelancer) {
      setFreelancers(
        freelancers.map((f) =>
          f.id === editingFreelancer.id ? ({ ...f, ...completeData } as Freelancer) : f,
        ),
      )
      toast({ title: 'Sucesso', description: 'Freelancer atualizado na base de talentos.' })
    } else {
      const newFreelancer: Freelancer = {
        ...(completeData as any),
        id: Math.random().toString(),
        name: formData.name || '',
        contactInfo: formData.contactInfo || '',
        roles: formData.roles || [],
      }
      setFreelancers([...freelancers, newFreelancer])
      toast({ title: 'Sucesso', description: 'Novo talento adicionado à equipe freelancer.' })
    }
    setIsDialogOpen(false)
  }

  const confirmDelete = () => {
    if (freelancerToDelete) {
      setFreelancers(freelancers.filter((f) => f.id !== freelancerToDelete.id))
      toast({ title: 'Excluído', description: 'Freelancer removido com sucesso.' })
      setFreelancerToDelete(null)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banco de Freelancers</h1>
          <p className="text-muted-foreground">
            Gerencie talentos externos, múltiplas funções e cachês por evento.
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
            placeholder="Buscar por nome, CPF ou função..."
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
              <TableHead>CPF / Contato</TableHead>
              <TableHead>Funções e Cachês</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFreelancers.map((freelancer) => (
              <TableRow key={freelancer.id}>
                <TableCell className="font-medium">{freelancer.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    {freelancer.cpf && <span>{freelancer.cpf}</span>}
                    <span className="text-muted-foreground">{freelancer.contactInfo || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.roles.map((r, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                      >
                        {r.role}: R$ {r.payRate.toFixed(2)}
                      </span>
                    ))}
                    {freelancer.roles.length === 0 && (
                      <span className="text-muted-foreground text-xs italic">
                        Sem funções ativas
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(freelancer)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFreelancerToDelete(freelancer)}
                    >
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFreelancer ? 'Editar Freelancer' : 'Novo Freelancer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Carlos Silva"
                />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input
                  value={formData.cpf || ''}
                  onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Contato (Telefone/Email)</Label>
                <Input
                  value={formData.contactInfo || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: maskPhone(e.target.value) })
                  }
                  placeholder="(11) 90000-0000"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Endereço
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Label>Bairro</Label>
                  <Input
                    value={formData.neighborhood || ''}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                </div>
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
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Funções e Cachês</Label>
                  <p className="text-xs text-muted-foreground">
                    Um freelancer pode atuar em múltiplas funções.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addRole}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Função
                </Button>
              </div>

              {formData.roles?.length === 0 && (
                <div className="text-center p-4 border border-dashed rounded-md bg-muted/20 text-sm text-muted-foreground">
                  Nenhuma função cadastrada. Clique acima para adicionar.
                </div>
              )}

              <div className="space-y-2">
                {formData.roles?.map((role, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-2 items-center bg-muted/50 p-2 rounded-lg border border-border/50"
                  >
                    <div className="flex-1 w-full">
                      <Select
                        value={role.role || ''}
                        onValueChange={(val) => updateRole(index, 'role', val)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a função" />
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
                    <div className="w-full sm:w-40 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        R$
                      </span>
                      <Input
                        type="number"
                        className="pl-8"
                        placeholder="0.00"
                        step="0.01"
                        value={role.payRate || ''}
                        onChange={(e) => updateRole(index, 'payRate', Number(e.target.value))}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRole(index)}
                      className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Freelancer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!freelancerToDelete}
        onOpenChange={(open) => !open && setFreelancerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Freelancer</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover{' '}
              <span className="font-semibold">{freelancerToDelete?.name}</span> do banco de
              talentos? Isso pode impactar escalas futuras.
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
