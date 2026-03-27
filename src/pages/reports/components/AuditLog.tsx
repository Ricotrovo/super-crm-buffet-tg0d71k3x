import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'
import { useAppStore } from '@/stores/main'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function AuditLog() {
  const { logs } = useAppStore()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <CardTitle>Log de Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                  Nenhum log registrado.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium">{log.userName}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="text-muted-foreground">{log.details}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
