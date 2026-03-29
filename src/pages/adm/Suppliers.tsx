import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, Tag } from 'lucide-react'
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
import { Supplier, SupplierProduct } from '@/lib/types'
import { mockSuppliers } from '@/stores/mockData'
import { useToast } from '@/components/ui/use-toast'
import { maskCNPJ, maskPhone, isValidCNPJ, isValidCPF, maskCPF } from '@/lib/utils'

const CATEGORY_MAP: Record<string, string[]> = {
  Alimentos: ['Buffet', 'Salgados', 'Doces', 'Bolo', 'Descartáveis'],
  Bebidas: ['Refrigerantes', 'Sucos', 'Alcoólicas', 'Gelo'],
  Decoração: ['Balões', 'Flores', 'Temática', 'Mobiliário'],
  Serviços: ['Limpeza', 'Segurança', 'Manutenção', 'Audiovisual'],
  Outros: ['Geral'],
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)

  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Supplier>>({ products: [] })

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      (s.cnpjCpf && s.cnpjCpf.includes(search)),
  )

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier)
      setFormData({
        ...supplier,
        products: supplier.products ? [...supplier.products.map((p) => ({ ...p }))] : [],
      })
    } else {
      setEditingSupplier(null)
      setFormData({ products: [], category: 'Alimentos' })
    }
    setIsDialogOpen(true)
  }

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...(formData.products || []), { id: Math.random().toString(), name: '', cost: 0 }],
    })
  }

  const removeProduct = (index: number) => {
    const newProducts = [...(formData.products || [])]
    newProducts.splice(index, 1)
    setFormData({ ...formData, products: newProducts })
  }

  const updateProduct = (index: number, field: keyof SupplierProduct, value: string | number) => {
    const newProducts = [...(formData.products || [])]
    newProducts[index] = { ...newProducts[index], [field]: value }
    setFormData({ ...formData, products: newProducts })
  }

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val.replace(/\D/g, '').length > 11) {
      setFormData({ ...formData, cnpjCpf: maskCNPJ(val) })
    } else {
      setFormData({ ...formData, cnpjCpf: maskCPF(val) })
    }
  }

  const handleSave = () => {
    if (!formData.companyName || !formData.category) {
      toast({
        title: 'Erro de Validação',
        description: 'Preencha os campos obrigatórios (Empresa e Categoria).',
        variant: 'destructive',
      })
      return
    }

    if (formData.cnpjCpf) {
      const cleanDoc = formData.cnpjCpf.replace(/\D/g, '')
      if (cleanDoc.length === 11 && !isValidCPF(formData.cnpjCpf)) {
        toast({
          title: 'Documento Inválido',
          description: 'O CPF informado é inválido.',
          variant: 'destructive',
        })
        return
      }
      if (cleanDoc.length === 14 && !isValidCNPJ(formData.cnpjCpf)) {
        toast({
          title: 'Documento Inválido',
          description: 'O CNPJ informado é inválido.',
          variant: 'destructive',
        })
        return
      }
    }

    if (formData.products?.some((p) => !p.name)) {
      toast({
        title: 'Tabela de Preços',
        description: 'Preencha o nome de todos os produtos/serviços adicionados.',
        variant: 'destructive',
      })
      return
    }

    if (editingSupplier) {
      setSuppliers(
        suppliers.map((s) =>
          s.id === editingSupplier.id ? ({ ...s, ...formData } as Supplier) : s,
        ),
      )
      toast({ title: 'Sucesso', description: 'Fornecedor atualizado com sucesso.' })
    } else {
      const newSupplier: Supplier = {
        id: Math.random().toString(),
        companyName: formData.companyName || '',
        cnpjCpf: formData.cnpjCpf || '',
        contactInfo: formData.contactInfo || '',
        category: formData.category || '',
        subCategory: formData.subCategory || '',
        productsOffered: formData.productsOffered || '',
        priceTable: formData.priceTable || '',
        products: formData.products || [],
      }
      setSuppliers([...suppliers, newSupplier])
      toast({ title: 'Sucesso', description: 'Fornecedor cadastrado com sucesso.' })
    }
    setIsDialogOpen(false)
  }

  const confirmDelete = () => {
    if (supplierToDelete) {
      setSuppliers(suppliers.filter((s) => s.id !== supplierToDelete.id))
      toast({ title: 'Excluído', description: 'Fornecedor removido do catálogo.' })
      setSupplierToDelete(null)
    }
  }

  const availableSubCategories =
    CATEGORY_MAP[formData.category || 'Alimentos'] || CATEGORY_MAP['Outros']

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie seus parceiros de produtos e serviços categorizados.
          </p>
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
            placeholder="Buscar por nome, categoria ou documento..."
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
              <TableHead>CNPJ/CPF</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Categoria / Sub</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.companyName}</TableCell>
                <TableCell>{supplier.cnpjCpf || '-'}</TableCell>
                <TableCell>{supplier.contactInfo || '-'}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{supplier.category}</span>
                    <span className="text-xs text-muted-foreground">
                      {supplier.subCategory || '-'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(supplier)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSupplierToDelete(supplier)}
                    >
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
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Empresa / Razão Social *</Label>
                <Input
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CNPJ ou CPF</Label>
                <Input
                  value={formData.cnpjCpf || ''}
                  onChange={handleDocChange}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone / Contato</Label>
                <Input
                  value={formData.contactInfo || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: maskPhone(e.target.value) })
                  }
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(val) =>
                      setFormData({ ...formData, category: val, subCategory: '' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(CATEGORY_MAP).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sub-categoria</Label>
                  <Select
                    value={formData.subCategory || ''}
                    onValueChange={(val) => setFormData({ ...formData, subCategory: val })}
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubCategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Tabela de Preços e Serviços
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cadastre os produtos e custos unitários deste fornecedor.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addProduct}>
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Item
                </Button>
              </div>

              {formData.products?.length === 0 && (
                <div className="text-center p-4 border border-dashed rounded-md bg-muted/20 text-sm text-muted-foreground">
                  Nenhum produto cadastrado na tabela de preços.
                </div>
              )}

              <div className="space-y-2">
                {formData.products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-2 items-center bg-muted/30 p-2 rounded-md border border-border/50"
                  >
                    <div className="w-full">
                      <Input
                        placeholder="Nome do produto ou serviço (ex: Salgadinho Sortido 100 un)"
                        value={product.name}
                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="w-full sm:w-48 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        R$
                      </span>
                      <Input
                        type="number"
                        className="pl-8"
                        step="0.01"
                        placeholder="0.00"
                        value={product.cost || ''}
                        onChange={(e) => updateProduct(index, 'cost', Number(e.target.value))}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(index)}
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
            <Button onClick={handleSave}>Salvar Fornecedor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!supplierToDelete}
        onOpenChange={(open) => !open && setSupplierToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Fornecedor</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a remover{' '}
              <span className="font-semibold">{supplierToDelete?.companyName}</span>. Isso não
              afetará os eventos passados, mas removerá o fornecedor da lista de compras ativa.
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
