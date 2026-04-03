import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Products() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [products, setProducts] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [stockOpen, setStockOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [stockOp, setStockOp] = useState<'in' | 'out'>('in')

  const [stockForm, setStockForm] = useState({ qtd: 1, linkedTo: 'Sporadic', obs: '' })
  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    category: '',
    type: 'Produto',
    current_stock: 0,
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleOpen = (prod?: any) => {
    if (prod) {
      setEditingId(prod.id)
      setFormData({
        name: prod.name,
        supplier: prod.supplier || '',
        category: prod.category || '',
        type: prod.type || 'Produto',
        current_stock: prod.current_stock || 0,
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', supplier: '', category: '', type: 'Produto', current_stock: 0 })
    }
    setIsOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name)
      return toast({ title: 'Erro', description: 'Nome obrigatório', variant: 'destructive' })

    if (editingId) {
      const { error } = await supabase.from('products').update(formData).eq('id', editingId)
      if (error)
        return toast({ title: 'Erro', description: 'Falha ao atualizar', variant: 'destructive' })
      toast({ title: 'Sucesso', description: 'Produto atualizado.' })
    } else {
      const { error } = await supabase.from('products').insert([{ ...formData, user_id: user?.id }])
      if (error)
        return toast({ title: 'Erro', description: 'Falha ao criar', variant: 'destructive' })
      toast({ title: 'Sucesso', description: 'Produto cadastrado.' })
    }
    setIsOpen(false)
    loadProducts()
  }

  const handleStock = async () => {
    if (stockForm.qtd <= 0)
      return toast({ title: 'Erro', description: 'Quantidade inválida', variant: 'destructive' })
    if (stockOp === 'out' && stockForm.linkedTo === 'Sporadic' && !stockForm.obs) {
      return toast({
        title: 'Erro',
        description: 'Observação é obrigatória para saída esporádica',
        variant: 'destructive',
      })
    }

    const newStock =
      stockOp === 'in'
        ? selectedProduct.current_stock + stockForm.qtd
        : selectedProduct.current_stock - stockForm.qtd

    if (newStock < 0)
      return toast({ title: 'Erro', description: 'Estoque insuficiente', variant: 'destructive' })

    const { error: pError } = await supabase
      .from('products')
      .update({ current_stock: newStock })
      .eq('id', selectedProduct.id)
    if (pError)
      return toast({
        title: 'Erro',
        description: 'Falha ao atualizar estoque',
        variant: 'destructive',
      })

    await supabase.from('stock_movements').insert([
      {
        product_id: selectedProduct.id,
        type: stockOp,
        quantity: stockForm.qtd,
        linked_to: stockOp === 'out' ? stockForm.linkedTo : 'Sporadic',
        observation: stockForm.obs,
        user_id: user?.id,
      },
    ])

    toast({ title: 'Sucesso', description: 'Estoque atualizado.' })
    setStockOpen(false)
    loadProducts()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('products').delete().eq('id', id)
    toast({ title: 'Sucesso', description: 'Produto removido.' })
    loadProducts()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Produtos e Serviços</h1>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Item
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Estoque Atual</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.supplier || '-'}</TableCell>
                  <TableCell>{p.category || '-'}</TableCell>
                  <TableCell>{p.type}</TableCell>
                  <TableCell className="text-center font-bold">
                    {p.type === 'Serviço' ? '-' : p.current_stock}
                  </TableCell>
                  <TableCell className="flex justify-end gap-1">
                    {p.type === 'Produto' && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(p)
                            setStockOp('in')
                            setStockForm({ qtd: 1, linkedTo: 'Sporadic', obs: '' })
                            setStockOpen(true)
                          }}
                        >
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(p)
                            setStockOp('out')
                            setStockForm({ qtd: 1, linkedTo: 'Sporadic', obs: '' })
                            setStockOpen(true)
                          }}
                        >
                          <ArrowDown className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleOpen(p)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                    Nenhum item cadastrado.
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
            <DialogTitle>{editingId ? 'Editar Item' : 'Novo Item'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Fornecedor</Label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Categoria</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produto">Produto</SelectItem>
                    <SelectItem value="Serviço">Serviço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type === 'Produto' && !editingId && (
                <div className="grid gap-2">
                  <Label>Estoque Inicial</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.current_stock}
                    onChange={(e) =>
                      setFormData({ ...formData, current_stock: Number(e.target.value) })
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={stockOpen} onOpenChange={setStockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{stockOp === 'in' ? 'Entrada' : 'Saída'} de Estoque</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm">
              Item: <strong>{selectedProduct?.name}</strong>
            </p>
            <div className="grid gap-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                value={stockForm.qtd}
                onChange={(e) => setStockForm({ ...stockForm, qtd: Number(e.target.value) })}
              />
            </div>
            {stockOp === 'out' && (
              <>
                <div className="grid gap-2">
                  <Label>Vincular a</Label>
                  <Select
                    value={stockForm.linkedTo}
                    onValueChange={(val) => setStockForm({ ...stockForm, linkedTo: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Event">Evento</SelectItem>
                      <SelectItem value="Production">Produção</SelectItem>
                      <SelectItem value="Sporadic">Saída Esporádica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {stockForm.linkedTo === 'Sporadic' && (
                  <div className="grid gap-2">
                    <Label>Observação (Obrigatória)</Label>
                    <Input
                      value={stockForm.obs}
                      onChange={(e) => setStockForm({ ...stockForm, obs: e.target.value })}
                      placeholder="Motivo da saída..."
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleStock}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
