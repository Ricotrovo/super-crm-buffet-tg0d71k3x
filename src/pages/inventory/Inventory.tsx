import { useAppStore } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'

export default function Inventory() {
  const { inventory } = useAppStore()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary">Controle de Estoque</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Estoque Atual</TableHead>
                <TableHead className="text-right">Estoque Mínimo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const isLow = item.currentStock < item.minStock
                return (
                  <TableRow key={item.id} className={isLow ? 'bg-destructive/5' : ''}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right font-medium">
                      {item.currentStock} {item.unit}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.minStock} {item.unit}
                    </TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge variant="destructive" className="flex items-center w-fit gap-1">
                          <AlertCircle className="w-3 h-3" /> Baixo
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Adequado
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
