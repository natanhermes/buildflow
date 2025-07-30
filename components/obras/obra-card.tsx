import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { type ObraWithRelations } from "@/services/obra/obra.service"

interface ObraCardProps {
  obra: ObraWithRelations
  onViewDetails: (obra: ObraWithRelations) => void
}

export function ObraCard({ obra, onViewDetails }: ObraCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
            {format(obra.dataInicio, "dd/MM/yyyy", { locale: ptBR })} -{" "}
            {format(obra.dataFim, "dd/MM/yyyy", { locale: ptBR })}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            R$ {Number(obra.valorM2).toLocaleString()}/m²
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm font-medium">Total Geral</p>
            <p className="text-2xl font-bold">R$ {Number(obra.totalGeral).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Torres</p>
            <p className="text-2xl font-bold">{obra.torres?.length || 0}</p>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={() => onViewDetails(obra)}
        >
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  )
}