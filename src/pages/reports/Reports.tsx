import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Relatórios</h1>
      </div>

      <Card className="border-dashed border-2">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Módulo de Relatórios</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>Esta funcionalidade está em desenvolvimento.</p>
          <p className="text-sm mt-2">
            Em breve você poderá exportar relatórios detalhados sobre leads, contratos e finanças.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
