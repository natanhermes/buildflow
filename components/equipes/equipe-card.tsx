'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Eye } from "lucide-react"
import { type EquipeWithRelations } from "@/services/equipe/equipe.service"

interface EquipeCardProps {
  equipe: EquipeWithRelations
  onViewDetails: (equipe: EquipeWithRelations) => void
}

export function EquipeCard({ equipe, onViewDetails }: EquipeCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">{equipe.nome}</h3>
          </div>
          <Badge variant="secondary">
            {equipe.integrantes.length} integrantes
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{equipe.obra.nome}</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Integrantes:</p>
          <div className="space-y-1">
            {equipe.integrantes.slice(0, 3).map((integrante) => (
              <p key={integrante.id} className="text-sm text-muted-foreground">
                • {integrante.nome}
              </p>
            ))}
            {equipe.integrantes.length > 3 && (
              <p className="text-sm text-muted-foreground">
                +{equipe.integrantes.length - 3} mais
              </p>
            )}
          </div>
        </div>
        
        <Button 
          onClick={() => onViewDetails(equipe)} 
          variant="outline" 
          className="w-full"
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  )
} 