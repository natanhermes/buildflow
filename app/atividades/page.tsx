import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"
import { mockAtividades } from "@/lib/mock-data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AtividadesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Atividades</h2>
        </div>
        <Button asChild>
          <Link href="/atividades/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Atividade
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros</CardTitle>
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar atividades..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Execução</TableHead>
                <TableHead>m²</TableHead>
                <TableHead>m³</TableHead>
                <TableHead>Aditivos</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAtividades.map((atividade) => (
                <TableRow key={atividade.id}>
                  <TableCell className="font-medium">
                    {format(atividade.data, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{atividade.identificacao_obra}</TableCell>
                  <TableCell>{atividade.local}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{atividade.execucao}</TableCell>
                  <TableCell>{atividade.total_m2}</TableCell>
                  <TableCell>{atividade.total_m3}</TableCell>
                  <TableCell>
                    {atividade.aditivo_m3}m³ / {atividade.aditivo_l}L
                  </TableCell>
                  <TableCell>
                    <Badge variant={atividade.percentual >= 80 ? "default" : "secondary"}>
                      {atividade.percentual}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
