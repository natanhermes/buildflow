"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Activity, 
  Building, 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  FileText,
  Eye,
  Gauge,
  BarChart3
} from "lucide-react"
import { type SerializedAtividadeWithRelations } from '@/hooks/atividades/use-atividades'
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AtividadeModalProps {
  atividade: SerializedAtividadeWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AtividadeModal({ atividade, open, onOpenChange }: AtividadeModalProps) {

  const formatDecimal = (value: number | null) => {
    if (!value) return "-"
    return value.toFixed(2)
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "-"
    // Para horários salvos como Date, extrair apenas a parte de hora
    const date = new Date(dateString)
    return format(date, "HH:mm", { locale: ptBR })
  }

  const getStatusVariant = (execucao: string | undefined) => {
    switch (execucao) {
      case 'EXECUTADO':
        return 'default'
      case 'FINAL':
        return 'secondary'
      case 'INICIAL':
        return 'outline'
      case 'MEIO':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (execucao: string | undefined) => {
    switch (execucao) {
      case 'EXECUTADO':
        return 'Executado'
      case 'FINAL':
        return 'Final'
      case 'INICIAL':
        return 'Inicial'
      case 'MEIO':
        return 'Em andamento'
      default:
        return 'Não definido'
    }
  }

  if (!atividade) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Detalhes da Atividade
          </DialogTitle>
          <DialogDescription>
            Informações completas da atividade e integrantes participantes
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-6">
            {/* Informações principais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  {atividade.obra.nome}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>CEI: {atividade.obra.cei}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Data da Atividade</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(atividade.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Pavimento</p>
                    <p className="text-sm text-muted-foreground">
                      {atividade.pavimento.torre?.nome || "Torre"} - {atividade.pavimento.identificador}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Status de Execução</p>
                    <Badge variant={getStatusVariant(atividade.execucao)} className="mt-1">
                      <Gauge className="h-3 w-3 mr-1" />
                      {getStatusLabel(atividade.execucao)}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Responsável</p>
                    <p className="text-sm text-muted-foreground">
                      {atividade.usuario.nome} {atividade.usuario.sobrenome}
                    </p>
                  </div>
                </div>

                {/* Dados do pavimento */}
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    Dados do Pavimento
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Área Total</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDecimal(atividade.pavimento.areaM2)}m²
                      </p>
                    </div>
                    
                    {atividade.pavimento.areaExecutadaM2 && (
                      <div>
                        <p className="text-sm font-medium">Área Executada</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDecimal(atividade.pavimento.areaExecutadaM2)}m²
                        </p>
                      </div>
                    )}

                    {atividade.pavimento.percentualExecutado && (
                      <div>
                        <p className="text-sm font-medium">Percentual Executado</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDecimal(atividade.pavimento.percentualExecutado)}%
                        </p>
                      </div>
                    )}

                    {atividade.pavimento.dataExecucao && (
                      <div>
                        <p className="text-sm font-medium">Data de Execução</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(atividade.pavimento.dataExecucao), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Expediente</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Início: {formatTime(atividade.inicioExpediente)}</div>
                      <div>Fim: {formatTime(atividade.fimExpediente)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Almoço</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Início: {formatTime(atividade.inicioAlmoco)}</div>
                      <div>Fim: {formatTime(atividade.fimAlmoco)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados técnicos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Saldo Acumulado (m²)</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {formatDecimal(atividade.saldoAcumuladoM2)}
                    </p>
                  </div>

                  {atividade.aditivoM3 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Aditivo (m³)</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {formatDecimal(atividade.aditivoM3)}
                      </p>
                    </div>
                  )}
                  
                  {atividade.aditivoL && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Aditivo (L)</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {formatDecimal(atividade.aditivoL)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Integrantes participantes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Integrantes Participantes ({atividade.atividadeIntegrantes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {atividade.atividadeIntegrantes.map((ai) => (
                    <div 
                      key={ai.integrante.id} 
                      className="p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="font-medium">{ai.integrante.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        CPF: {ai.integrante.cpf}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Área acumulada: {formatDecimal(atividade.saldoAcumuladoM2)}m²
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            {(atividade.obsExecucao || atividade.obsPonto || atividade.obsQtdBetoneira || atividade.obsHOI) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Observações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {atividade.obsExecucao && (
                      <div>
                        <p className="text-sm font-medium">Execução:</p>
                        <p className="text-sm text-muted-foreground">{atividade.obsExecucao}</p>
                      </div>
                    )}
                    {atividade.obsPonto && (
                      <div>
                        <p className="text-sm font-medium">Ponto:</p>
                        <p className="text-sm text-muted-foreground">{atividade.obsPonto}</p>
                      </div>
                    )}
                    {atividade.obsQtdBetoneira && (
                      <div>
                        <p className="text-sm font-medium">Betoneira:</p>
                        <p className="text-sm text-muted-foreground">{atividade.obsQtdBetoneira}</p>
                      </div>
                    )}
                    {atividade.obsHOI && (
                      <div>
                        <p className="text-sm font-medium">HOI:</p>
                        <p className="text-sm text-muted-foreground">{atividade.obsHOI}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}