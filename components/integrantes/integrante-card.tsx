'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Users, Building2, Edit, Trash2 } from "lucide-react"
import { type IntegranteWithRelations } from "@/services/integrante/integrante.service"

interface IntegranteCardProps {
  integrante: IntegranteWithRelations
  onEdit?: (integrante: IntegranteWithRelations) => void
  onDelete?: (integrante: IntegranteWithRelations) => void
}

export function IntegranteCard({ integrante, onEdit, onDelete }: IntegranteCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">{integrante.nome}</h3>
          </div>
          <Badge variant="outline">
            {integrante.equipe.nome}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Equipe: {integrante.equipe.nome}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>Obra: {integrante.equipe.obra.nome}</span>
        </div>
        
        <div className="flex gap-2">
          {onEdit && (
            <Button 
              onClick={() => onEdit(integrante)} 
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button 
              onClick={() => onDelete(integrante)} 
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 