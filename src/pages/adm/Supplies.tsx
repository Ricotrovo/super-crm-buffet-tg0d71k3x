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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Printer, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Supplies() {
  const { events, eventSupplies, setEventSupplies, products } = useAppStore()
  const { toast } = useToast()

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const [newProductId, setNewProductId] = useState('')
  const [newQty, setNewQty] = useState(1)

  const handleAddSupply = () => {
    if (!selectedEvent || !newProductId || newQty <= 0) return
    setEventSupplies((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        eventId: selectedEvent,
        productId: newProductId,
        quantity: newQty,
      },
    ])
    toast({ title: 'Insumo adicionado ao evento' })
    setNewProductId('')
    setNewQty(1)
  }

  const handleDeleteSupply = (id: string) => {
    setEventSupplies((prev) => prev.filter((s) => s.id !== id))
  }

  const handlePrint = () => {
    window.print()
  }

  const filteredEvents = useMemo(() => {
    if (!startDate || !endDate) return []
    return events.filter((e) => e.date >= startDate && e.date <= endDate)
  }, [events, startDate, endDate])

  const shoppingList = useMemo(() => {
    const list: Record<string, { name: string; qty: number; supplier: string }> = {}
    const evIds = filteredEvents.map((e) => e.id)

    eventSupplies
      .filter((s) => evIds.includes(s.eventId))
      .forEach((s) => {
        const prod = products.find((p) => p.id === s.productId)
        if (prod) {
          if (!list[prod.id]) list[prod.id] = { name: prod.name, qty: 0, supplier: prod.supplier }
          list[prod.id].qty += s.quantity
        }
      })
    return Object.values(list)
  }, [eventSupplies, filteredEvents, products])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-secondary">Insumos e Lista de Compras</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 print:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Vincular Insumo ao Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Evento</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o evento" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.date} - {e.clientName} (Conv: {e.guests})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Produto</Label>
                <Select value={newProductId} onValueChange={setNewProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Produto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Quantidade</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                  />
                  <Button onClick={handleAddSupply} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {selectedEvent && (
              <div className="mt-4 border rounded-md p-2">
                <h4 className="text-sm font-semibold mb-2">Insumos deste evento:</h4>
                <ul className="text-sm space-y-2">
                  {eventSupplies
                    .filter((s) => s.eventId === selectedEvent)
                    .map((s) => {
                      const p = products.find((prod) => prod.id === s.productId)
                      return (
                        <li
                          key={s.id}
                          className="flex justify-between items-center bg-muted p-1 rounded"
                        >
                          <span>
                            {s.quantity}x {p?.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleDeleteSupply(s.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </li>
                      )
                    })}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerar Lista de Compras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Data Fim</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Eventos encontrados: {filteredEvents.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {(shoppingList.length > 0 || window.matchMedia('print').matches) && (
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="flex flex-row justify-between items-center print:p-0">
            <CardTitle>Lista de Compras Consolidada</CardTitle>
            <Button variant="outline" onClick={handlePrint} className="print:hidden">
              <Printer className="w-4 h-4 mr-2" /> Imprimir Lista
            </Button>
          </CardHeader>
          <CardContent className="print:p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Quantidade Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shoppingList
                  .sort((a, b) => a.supplier.localeCompare(b.supplier))
                  .map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.supplier}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right font-bold">{item.qty}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
