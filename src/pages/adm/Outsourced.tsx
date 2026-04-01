import { useState, useMemo } from 'react'
import { useAppStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export default function Outsourced() {
  const { outsourcedServices, setOutsourcedServices, events } = useAppStore()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    eventId: '',
    type: 'Bolo',
    description: '',
    cost: 0,
    supplier: '',
    date: '',
    status: 'Pendente' as 'Pendente' | 'Pago',
  })

  const today = new Date().toISOString().split('T')[0]
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0]
  const [reportStart, setReportStart] = useState(firstDay)
  const [reportEnd, setReportEnd] = useState(today)

  const handleOpen = (item?: (typeof outsourcedServices)[0]) => {
    if (item) {
      setEditingId(item.id)
      setFormData({
        eventId: item.eventId,
        type: item.type,
        description: item.description,
        cost: item.cost,
        supplier: item.supplier,
        date: item.date,
        status: item.status,
      })
    } else {
      setEditingId(null)
      setFormData({
        eventId: '',
        type: 'Bolo',
        description: '',
        cost: 0,
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pendente',
      })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (!formData.eventId || !formData.supplier)
      return toast({
        title: 'Erro',
        description: 'Preencha evento e fornecedor.',
        variant: 'destructive',
      })
    if (editingId) {
      setOutsourcedServices((prev) =>
        prev.map((o) => (o.id === editingId ? { ...o, ...formData } : o)),
      )
      toast({ title: 'Sucesso', description: 'Serviço atualizado.' })
    } else {
      setOutsourcedServices((prev) => [...prev, { id: Math.random().toString(), ...formData }])
      toast({ title: 'Sucesso', description: 'Serviço registrado.' })
    }
    setIsOpen(false)
  }

  const handleDelete = (id: string) => {
    setOutsourcedServices((prev) => prev.filter((o) => o.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setOutsourcedServices((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === 'Pendente' ? 'Pago' : 'Pendente' } : o,
      ),
    )
  }

  const groupedReport = useMemo(() => {
    const filtered = outsourcedServices.filter((o) => o.date >= reportStart && o.date <= reportEnd)
    const report: Record<string, { total: number; pendente: number; pago: number }> = {}

    filtered.forEach((o) => {
      if (!report[o.supplier]) report[o.supplier] = { total: 0, pendente: 0, pago: 0 }
      report[o.supplier].total += o.cost
      if (o.status === 'Pago') report[o.supplier].pago += o.cost
      else report[o.supplier].pendente += o.cost
    })
    return report
  }, [outsourcedServices, reportStart, reportEnd])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Serviços Terceirizados</h1>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Serviço
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Registro de Serviços</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outsourcedServices
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{new Date(o.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="font-medium">{o.supplier}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{o.type}</span>
                          <span className="text-xs text-muted-foreground">{o.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>R$ {o.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={o.status === 'Pago' ? 'secondary' : 'destructive'}
                          className="cursor-pointer"
                          onClick={() => handleToggleStatus(o.id)}
                        >
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpen(o)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(o.id)}
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

        <Card>
          <CardHeader>
            <CardTitle>Relatório de Pagamentos (Por Período)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label>Data Inicial</Label>
                <Input
                  type="date"
                  value={reportStart}
                  onChange={(e) => setReportStart(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Data Final</Label>
                <Input
                  type="date"
                  value={reportEnd}
                  onChange={(e) => setReportEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {Object.entries(groupedReport).map(([supplier, data]) => (
                <div key={supplier} className="p-3 border rounded-md">
                  <h4 className="font-semibold">{supplier}</h4>
                  <div className="text-sm mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Devido:</span>{' '}
                      <span className="font-medium">R$ {data.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Pago:</span> <span>R$ {data.pago.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Pendente:</span> <span>R$ {data.pendente.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {Object.keys(groupedReport).length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum registro para este período.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Serviço' : 'Novo Serviço Terceirizado'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Evento Relacionado</Label>
              <Select
                value={formData.eventId}
                onValueChange={(v) => setFormData({ ...formData, eventId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.date} - {e.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo de Serviço</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Bolo', 'Doces', 'Salgados', 'Pão', 'Tema', 'Animação', 'Outros'].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Data Execução/Entrega</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Fornecedor</Label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Custo Acordado (R$)</Label>
              <Input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Salvar Registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
