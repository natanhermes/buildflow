import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Building2, MapPin, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { mockObras } from "@/lib/mock-data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ObrasPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Obras</h2>
        </div>
        <Button asChild>
          <Link href="/obras/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Obra
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockObras.map((obra) => (
          <Card key={obra.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {obra.nome}
                </CardTitle>
                <Badge variant="outline">Ativa</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {obra.endereco}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(obra.data_inicio, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(obra.data_fim, "dd/MM/yyyy", { locale: ptBR })}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  R$ {obra.valor_m2.toLocaleString()}/m²
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium">Total m²</p>
                  <p className="text-2xl font-bold">{obra.total_m2.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total m³</p>
                  <p className="text-2xl font-bold">{obra.total_m3.toLocaleString()}</p>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href={`/obras/${obra.id}`}>Ver Detalhes</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
