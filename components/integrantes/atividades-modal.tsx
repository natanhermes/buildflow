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
  Loader2
} from "lucide-react"
import { type IntegranteWithRelations } from '@/services/integrante/integrante.service'
import { useAtividadesByIntegrante, type SerializedAtividadeWithRelations } from '@/hooks/atividades/use-atividades'
import { formatSerializedDate, formatSerializedTime } from '@/lib/utils/date-serialization'

interface AtividadesModalProps {
  integrante: IntegranteWithRelations
}

interface AtividadeCardProps {
  atividade: SerializedAtividadeWithRelations
  currentIntegranteId: string
}

function AtividadeCard({ atividade, currentIntegranteId }: AtividadeCardProps) {  
  const formatDecimal = (value: number | null) => {
    if (!value) return "-"
    return value.toFixed(2)
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            {atividade.obra.nome}
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatSerializedDate(atividade.createdAt)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {atividade.pavimento.torre?.nome || "Torre"} - {atividade.pavimento.identificador}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Horários */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Expediente
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Início: {formatSerializedTime(atividade.inicioExpediente)}</div>
              <div>Fim: {formatSerializedTime(atividade.fimExpediente)}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Almoço
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Início: {formatSerializedTime(atividade.inicioAlmoco)}</div>
              <div>Fim: {formatSerializedTime(atividade.fimAlmoco)}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Dados técnicos */}
        <div className="grid grid-cols-2 gap-4">
          {atividade.aditivoM3 && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Aditivo (m³)</p>
              <p className="text-sm text-muted-foreground">{formatDecimal(atividade.aditivoM3)}</p>
            </div>
          )}
          
          {atividade.aditivoL && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Aditivo (L)</p>
              <p className="text-sm text-muted-foreground">{formatDecimal(atividade.aditivoL)}</p>
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Saldo Acumulado (m²)</p>
            <p className="text-sm text-muted-foreground">{formatDecimal(atividade.saldoAcumuladoM2)}</p>
          </div>

          {atividade.execucao && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Execução</p>
              <Badge variant="secondary">{atividade.execucao}</Badge>
            </div>
          )}
        </div>

        {/* Observações */}
        {(atividade.obsExecucao || atividade.obsPonto || atividade.obsQtdBetoneira || atividade.obsHOI) && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Observações
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                {atividade.obsExecucao && (
                  <div>
                    <span className="font-medium">Execução:</span> {atividade.obsExecucao}
                  </div>
                )}
                {atividade.obsPonto && (
                  <div>
                    <span className="font-medium">Ponto:</span> {atividade.obsPonto}
                  </div>
                )}
                {atividade.obsQtdBetoneira && (
                  <div>
                    <span className="font-medium">Betoneira:</span> {atividade.obsQtdBetoneira}
                  </div>
                )}
                {atividade.obsHOI && (
                  <div>
                    <span className="font-medium">HOI:</span> {atividade.obsHOI}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Outros integrantes */}
        {atividade.atividadeIntegrantes.length > 1 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-1">
                <User className="h-4 w-4" />
                Outros Integrantes ({atividade.atividadeIntegrantes.length - 1})
              </p>
              <div className="flex flex-wrap gap-1">
                {atividade.atividadeIntegrantes
                  .filter(ai => ai.integrante.id !== currentIntegranteId)
                  .map((ai) => (
                    <Badge key={ai.integrante.id} variant="outline" className="text-xs">
                      {ai.integrante.nome}
                    </Badge>
                  ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function AtividadesModal({ integrante }: AtividadesModalProps) {
  const [open, setOpen] = useState(false)
  const { 
    data: atividades = [], 
    isLoading: loading, 
    error, 
    refetch 
  } = useAtividadesByIntegrante(open ? integrante.id : "")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Activity className="mr-2 h-4 w-4" />
          Ver Atividades
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Atividades de {integrante.nome}
          </DialogTitle>
          <DialogDescription>
            Histórico completo de atividades do integrante
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Carregando atividades...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                {error instanceof Error ? error.message : 'Erro ao carregar atividades'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {!loading && !error && atividades.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma atividade encontrada</h3>
              <p className="text-muted-foreground">
                Este integrante ainda não participou de nenhuma atividade.
              </p>
            </div>
          )}

          {!loading && !error && atividades.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {atividades.length} atividade(s) encontrada(s)
                </p>
                <Badge variant="secondary">
                  Total: {atividades.length}
                </Badge>
              </div>
              
              {atividades.map((atividade) => (
                <AtividadeCard key={atividade.id} atividade={atividade} currentIntegranteId={integrante.id} />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}