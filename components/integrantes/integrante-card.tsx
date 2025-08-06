"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Calendar, Hash } from "lucide-react"
import { type IntegranteWithRelations } from '@/services/integrante/integrante.service'
import { AtividadesModal } from './atividades-modal'
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface IntegranteCardProps {
  integrante: IntegranteWithRelations
}

export function IntegranteCard({ integrante }: IntegranteCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            {integrante.nome}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Hash className="h-4 w-4" />
          <span>CPF: {integrante.cpf}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Cadastrado em: {format(integrante.createdAt, "dd/MM/yyyy", { locale: ptBR })}</span>
        </div>

        {integrante.atividadeIntegrantes && integrante.atividadeIntegrantes.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Últimas atividades:</p>
            <div className="space-y-1">
              {integrante.atividadeIntegrantes.slice(0, 2).map((ai) => (
                <div key={ai.atividade.id} className="text-xs text-muted-foreground">
                  {ai.atividade.obra.nome} - {ai.atividade.pavimento.identificador}
                </div>
              ))}
              {integrante.atividadeIntegrantes.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{integrante.atividadeIntegrantes.length - 2} outras
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Editar
          </Button>
          <AtividadesModal integrante={integrante} />
        </div>
      </CardContent>
    </Card>
  )
}