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
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Products() {
  const { products, setProducts, addLog } = useAppStore()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [stockOpen, setStockOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [stockOp, setStockOp] = useState<'in' | 'out'>('in')
  const [stockQtd, setStockQtd] = useState(1)

  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    category: '',
    currentStock: 0,
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleOpen = (prod?: (typeof products)[0]) => {
    if (prod) {
      setEditingId(prod.id)
      setFormData({
        name: prod.name,
        supplier: prod.supplier,
        category: prod.category,
        currentStock: prod.currentStock,
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', supplier: '', category: '', currentStock: 0 })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.name)
      return toast({ title: 'Erro', description: 'Nome obrigatório', variant: 'destructive' })
    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...formData } : p)))
      toast({ title: 'Sucesso', description: 'Produto atualizado.' })
    } else {
      setProducts((prev) => [...prev, { id: Math.random().toString(), ...formData }])
      toast({ title: 'Sucesso', description: 'Produto cadastrado.' })
    }
    setIsOpen(false)
  }

  const handleStock = () => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === selectedProduct) {
          const newStock = stockOp === 'in' ? p.currentStock + stockQtd : p.currentStock - stockQtd
          addLog(
            stockOp === 'in' ? 'Entrada de Estoque' : 'Saída de Estoque',
            `${stockQtd}x ${p.name}`,
          )
          return { ...p, currentStock: Math.max(0, newStock) }
        }
        return p
      }),
    )
    toast({ title: 'Sucesso', description: 'Estoque atualizado.' })
    setStockOpen(false)
  }

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast({ title: 'Sucesso', description: 'Produto removido.' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Produtos e Catálogo</h1>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Produto
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Estoque Atual</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.supplier}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell className="text-center font-bold">{p.currentStock}</TableCell>
                  <TableCell className="flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedProduct(p.id)
                        setStockOp('in')
                        setStockOpen(true)
                      }}
                      title="Entrada"
                    >
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedProduct(p.id)
                        setStockOp('out')
                        setStockOpen(true)
                      }}
                      title="Saída"
                    >
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    </Button>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome do Produto</Label>
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
            {!editingId && (
              <div className="grid gap-2">
                <Label>Estoque Inicial</Label>
                <Input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) =>
                    setFormData({ ...formData, currentStock: Number(e.target.value) })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={stockOpen} onOpenChange={setStockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {stockOp === 'in' ? 'Entrada de Estoque' : 'Saída de Estoque'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 grid gap-4">
            <p className="text-sm text-muted-foreground">
              Produto: <strong>{products.find((p) => p.id === selectedProduct)?.name}</strong>
            </p>
            <div className="grid gap-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                value={stockQtd}
                onChange={(e) => setStockQtd(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStock}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
