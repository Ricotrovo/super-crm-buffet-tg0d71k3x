import { useState } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Label } from '@/components/ui/label'
import { Supplier } from '@/lib/types'
import { mockSuppliers } from '@/stores/mockData'
import { useToast } from '@/components/ui/use-toast'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Supplier>>({})

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()),
  )

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier)
      setFormData(supplier)
    } else {
      setEditingSupplier(null)
      setFormData({})
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.companyName || !formData.category) {
      toast({ title: 'Erro', description: 'Preencha Empresa e Categoria.', variant: 'destructive' })
      return
    }

    if (editingSupplier) {
      setSuppliers(
        suppliers.map((s) =>
          s.id === editingSupplier.id ? ({ ...s, ...formData } as Supplier) : s,
        ),
      )
      toast({ title: 'Sucesso', description: 'Fornecedor atualizado.' })
    } else {
      const newSupplier: Supplier = {
        id: Math.random().toString(),
        companyName: formData.companyName || '',
        contactInfo: formData.contactInfo || '',
        category: formData.category || '',
        subCategory: formData.subCategory || '',
        productsOffered: formData.productsOffered || '',
        priceTable: formData.priceTable || '',
      }
      setSuppliers([...suppliers, newSupplier])
      toast({ title: 'Sucesso', description: 'Fornecedor cadastrado.' })
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id))
    toast({ title: 'Sucesso', description: 'Fornecedor removido.' })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie seus parceiros de produtos e serviços.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou categoria..."
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
              <TableHead>Empresa</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Sub-categoria</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.companyName}</TableCell>
                <TableCell>{supplier.contactInfo}</TableCell>
                <TableCell>{supplier.category}</TableCell>
                <TableCell>{supplier.subCategory || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(supplier)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredSuppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhum fornecedor encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Empresa *</Label>
              <Input
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Informações de Contato</Label>
              <Input
                value={formData.contactInfo || ''}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                placeholder="Telefone, Email..."
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Input
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ex: Alimentos, Decoração"
              />
            </div>
            <div className="space-y-2">
              <Label>Sub-categoria</Label>
              <Input
                value={formData.subCategory || ''}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                placeholder="Ex: Doces, Salgados"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Produtos Oferecidos</Label>
              <Textarea
                value={formData.productsOffered || ''}
                onChange={(e) => setFormData({ ...formData, productsOffered: e.target.value })}
                placeholder="Detalhe os produtos que o fornecedor entrega..."
                rows={3}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Tabela de Preços (Referência)</Label>
              <Input
                value={formData.priceTable || ''}
                onChange={(e) => setFormData({ ...formData, priceTable: e.target.value })}
                placeholder="Link, código ou descrição da tabela de preços"
              />
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
