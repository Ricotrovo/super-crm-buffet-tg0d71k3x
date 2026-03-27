import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, ChefHat, MoveRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function Inventory() {
  const { inventory, recipes, setInventory, addLog } = useAppStore()
  const { toast } = useToast()

  const [prodOpen, setProdOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState('')
  const [prodQtd, setProdQtd] = useState(1)

  const handleProduce = () => {
    const recipe = recipes.find((r) => r.id === selectedRecipe)
    if (!recipe) return

    let canProduce = true
    const toDeduct = recipe.ingredients.map((ing) => {
      const item = inventory.find((i) => i.id === ing.inventoryId)
      if (!item || item.currentStock < ing.quantity * prodQtd) canProduce = false
      return { id: ing.inventoryId, qty: ing.quantity * prodQtd }
    })

    if (!canProduce) {
      toast({
        title: 'Erro',
        description: 'Insumos insuficientes para esta produção.',
        variant: 'destructive',
      })
      return
    }

    setInventory((prev) =>
      prev.map((item) => {
        const deduct = toDeduct.find((d) => d.id === item.id)
        if (deduct) return { ...item, currentStock: item.currentStock - deduct.qty }
        if (item.name === recipe.snackName)
          return { ...item, currentStock: item.currentStock + prodQtd }
        return item
      }),
    )
    addLog('Produção Realizada', `${prodQtd} lotes de ${recipe.snackName}`)
    toast({ title: 'Sucesso', description: 'Produção registrada e insumos debitados.' })
    setProdOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Produção e Estoque</h1>
        <Button onClick={() => setProdOpen(true)}>
          <ChefHat className="mr-2 h-4 w-4" /> Lançar Produção
        </Button>
      </div>

      <Tabs defaultValue="estoque">
        <TabsList>
          <TabsTrigger value="estoque">Estoque Atual</TabsTrigger>
          <TabsTrigger value="receitas">Receitas (Fichas Técnicas)</TabsTrigger>
        </TabsList>

        <TabsContent value="estoque" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead className="text-right">Estoque Atual</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const isLow = item.currentStock < item.minStock * 1.2 // Alert if < 20% above min
                    return (
                      <TableRow key={item.id} className={isLow ? 'bg-destructive/5' : ''}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-right font-medium">
                          {item.currentStock} {item.unit}
                        </TableCell>
                        <TableCell>
                          {isLow ? (
                            <Badge variant="destructive" className="flex items-center w-fit gap-1">
                              <AlertCircle className="w-3 h-3" /> Baixo
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              OK
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
        </TabsContent>

        <TabsContent value="receitas" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{recipe.snackName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {recipe.ingredients.map((ing) => {
                      const invItem = inventory.find((i) => i.id === ing.inventoryId)
                      return (
                        <li key={ing.inventoryId} className="flex justify-between">
                          <span>{invItem?.name}</span>
                          <span>
                            {ing.quantity} {invItem?.unit}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={prodOpen} onOpenChange={setProdOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lançar Produção de Salgados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Receita</Label>
              <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.snackName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Quantidade de Lotes</Label>
              <Input
                type="number"
                value={prodQtd}
                onChange={(e) => setProdQtd(Number(e.target.value))}
              />
            </div>
            {selectedRecipe && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <MoveRight className="w-4 h-4" /> Insumos debitados:
                </p>
                {recipes
                  .find((r) => r.id === selectedRecipe)
                  ?.ingredients.map((ing) => {
                    const invItem = inventory.find((i) => i.id === ing.inventoryId)
                    return (
                      <div key={ing.inventoryId}>
                        - {ing.quantity * prodQtd} {invItem?.unit} de {invItem?.name}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
          <Button onClick={handleProduce} className="w-full">
            Registrar Produção
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
