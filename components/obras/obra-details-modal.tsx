import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Calendar, DollarSign, FileText, Users, Activity } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { type ObraWithRelations } from "@/services/obra/obra.service"

interface ObraDetailsModalProps {
  obra: ObraWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ObraDetailsModal({ obra, open, onOpenChange }: ObraDetailsModalProps) {
  if (!obra) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {obra.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              <Badge variant="outline">Ativa</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">CEI:</span>
                  <span>{obra.cei}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">Endereço:</span>
                  <span className="flex-1">{obra.endereco}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Período:</span>
                  <span>
                    {format(obra.dataInicio, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                    {format(obra.dataFim, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Valor/m²:</span>
                  <span>R$ {Number(obra.valorM2).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Totais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Totais da Obra</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Executado</p>
                <p className="text-3xl font-bold">R$ {Number(obra.totalExecutado).toLocaleString()}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Pendente</p>
                <p className="text-3xl font-bold">R$ {Number(obra.totalPendente).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="text-sm font-medium text-muted-foreground">Valor Total Geral</p>
              <p className="text-2xl font-bold text-primary">
                R$ {Number(obra.totalGeral).toLocaleString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Estatísticas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estatísticas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Torres</span>
                </div>
                <p className="text-xl font-bold">{obra.torres?.length || 0}</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Pavimentos</span>
                </div>
                <p className="text-xl font-bold">
                  {obra.torres?.reduce((total, torre) => total + (torre.pavimentos?.length || 0), 0) || 0}
                </p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Progresso</span>
                </div>
                <p className="text-xl font-bold">
                  {obra.totalGeral && Number(obra.totalGeral) > 0 
                    ? Math.round((Number(obra.totalExecutado) / Number(obra.totalGeral)) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}