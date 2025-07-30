import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Atividade } from "@/lib/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface RecentActivitiesProps {
  atividades: Atividade[]
}

export function RecentActivities({ atividades }: RecentActivitiesProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Últimas Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Execução</TableHead>
              <TableHead>m²</TableHead>
              <TableHead>%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {atividades.slice(0, 5).map((atividade) => (
              <TableRow key={atividade.id}>
                <TableCell className="font-medium">{format(atividade.data, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell>{atividade.local}</TableCell>
                <TableCell className="max-w-[200px] truncate">{atividade.execucao}</TableCell>
                <TableCell>{atividade.total_m2}</TableCell>
                <TableCell>
                  <Badge variant={atividade.percentual >= 80 ? "default" : "secondary"}>{atividade.percentual}%</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
